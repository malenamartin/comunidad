-- Phase 3: Gamification, Video Progress, Admin

-- ── GAMIFICATION ─────────────────────────────────────────────────────────────

CREATE TYPE point_action AS ENUM (
  'post_created', 'comment_created', 'reaction_received',
  'video_completed', 'profile_completed', 'invite_accepted',
  'daily_login', 'benchmark_viewed', 'event_attended'
);

CREATE TABLE member_points_log (
  id            SERIAL PRIMARY KEY,
  member_id     INTEGER NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  action        point_action NOT NULL,
  points        INTEGER NOT NULL,
  reference_id  INTEGER,          -- post_id, video_id, etc.
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_points_member ON member_points_log(member_id);

-- Materialised total per member (updated by trigger)
ALTER TABLE community_members
  ADD COLUMN IF NOT EXISTS total_points INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level        TEXT    NOT NULL DEFAULT 'bronze';

-- Recompute level from total_points
CREATE OR REPLACE FUNCTION update_member_level() RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_members SET
    level = CASE
      WHEN total_points >= 5000 THEN 'platinum'
      WHEN total_points >= 1000 THEN 'gold'
      WHEN total_points >= 250  THEN 'silver'
      ELSE 'bronze'
    END
  WHERE id = NEW.member_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_level
  AFTER INSERT ON member_points_log
  FOR EACH ROW EXECUTE FUNCTION update_member_level();

-- Accumulate points trigger
CREATE OR REPLACE FUNCTION accumulate_points() RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_members
    SET total_points = total_points + NEW.points
  WHERE id = NEW.member_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_accumulate_points
  AFTER INSERT ON member_points_log
  FOR EACH ROW EXECUTE FUNCTION accumulate_points();

-- Badges
CREATE TABLE badges (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT NOT NULL DEFAULT '🏆',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE member_badges (
  id         SERIAL PRIMARY KEY,
  member_id  INTEGER NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  badge_id   INTEGER NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(member_id, badge_id)
);

-- Default badges
INSERT INTO badges (slug, name, description, icon) VALUES
  ('first_post',      'Primera voz',      'Publicaste tu primer post',            '📢'),
  ('connector',       'Conector',         'Recibiste 10 reacciones',              '🤝'),
  ('video_addict',    'Video adicto',      'Completaste 5 videos',                '🎬'),
  ('top_contributor', 'Top Contributor',  'Llegaste al Top 10 del ranking',       '🥇'),
  ('founding_member', 'Founding Member',  'Uno de los primeros 50 miembros',      '🌟'),
  ('benchmark_nerd',  'Benchmark Nerd',   'Consultaste 10 benchmarks',            '📊');

-- ── VIDEO PROGRESS ────────────────────────────────────────────────────────────

CREATE TABLE video_progress (
  id           SERIAL PRIMARY KEY,
  member_id    INTEGER NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  video_id     INTEGER NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  seconds      INTEGER NOT NULL DEFAULT 0,   -- furthest second reached
  completed    BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(member_id, video_id)
);

CREATE INDEX idx_vp_member ON video_progress(member_id);

-- ── ADMIN ─────────────────────────────────────────────────────────────────────

-- Audit log for admin actions
CREATE TABLE admin_log (
  id          SERIAL PRIMARY KEY,
  admin_id    TEXT NOT NULL,           -- clerk_user_id
  action      TEXT NOT NULL,
  target_type TEXT,                    -- 'member', 'post', 'invite_code', etc.
  target_id   TEXT,
  details     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
