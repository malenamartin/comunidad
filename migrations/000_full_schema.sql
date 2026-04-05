-- ══════════════════════════════════════════════════════════════
-- COMUNIDAD FARDO — Schema completo (Phases 1 + 2 + 3)
-- Correr UNA SOLA VEZ en una base limpia
-- ══════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── PHASE 1 ───────────────────────────────────────────────────

CREATE TABLE community_members (
  id             SERIAL PRIMARY KEY,
  clerk_user_id  TEXT UNIQUE NOT NULL,
  email          TEXT NOT NULL,
  name           TEXT NOT NULL,
  company        TEXT,
  job_title      TEXT,
  country        TEXT,
  linkedin_url   TEXT,
  bio            TEXT,
  status         TEXT NOT NULL DEFAULT 'active',
  is_founder     BOOLEAN NOT NULL DEFAULT FALSE,
  -- Gamification (Phase 3)
  total_points   INTEGER NOT NULL DEFAULT 0,
  level          TEXT NOT NULL DEFAULT 'bronze',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE invite_codes (
  id            SERIAL PRIMARY KEY,
  code          TEXT UNIQUE NOT NULL,
  created_by    INTEGER REFERENCES community_members(id),
  max_uses      INTEGER NOT NULL DEFAULT 1,
  current_uses  INTEGER NOT NULL DEFAULT 0,
  expires_at    TIMESTAMPTZ,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE posts (
  id          SERIAL PRIMARY KEY,
  author_id   INTEGER NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  post_type   TEXT NOT NULL DEFAULT 'discussion',
  is_pinned   BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  views       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE comments (
  id          SERIAL PRIMARY KEY,
  post_id     INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id   INTEGER NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  parent_id   INTEGER REFERENCES comments(id),
  body        TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reactions (
  id            SERIAL PRIMARY KEY,
  post_id       INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  member_id     INTEGER NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL DEFAULT 'like',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, member_id)
);

CREATE TABLE videos (
  id             SERIAL PRIMARY KEY,
  title          TEXT NOT NULL,
  description    TEXT,
  category       TEXT NOT NULL,
  level          TEXT NOT NULL DEFAULT 'intro',
  duration_min   INTEGER,
  vimeo_id       TEXT,
  thumbnail_url  TEXT,
  order_index    INTEGER NOT NULL DEFAULT 0,
  is_published   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE access_requests (
  id           SERIAL PRIMARY KEY,
  email        TEXT NOT NULL,
  name         TEXT NOT NULL,
  company      TEXT,
  job_title    TEXT,
  country      TEXT,
  linkedin_url TEXT,
  status       TEXT NOT NULL DEFAULT 'pending',
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at  TIMESTAMPTZ
);

-- ── PHASE 2 ───────────────────────────────────────────────────

CREATE TABLE benchmarks (
  id              SERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  industry        TEXT NOT NULL,
  region          TEXT NOT NULL DEFAULT 'LatAm',
  period          TEXT NOT NULL,
  citation_rate   NUMERIC(5,2),
  sov_ai          NUMERIC(5,2),
  llmo_score      NUMERIC(5,2),
  description     TEXT,
  is_published    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE betas (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  tagline      TEXT,
  description  TEXT,
  category     TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'open',
  spots_total  INTEGER,
  spots_taken  INTEGER NOT NULL DEFAULT 0,
  closes_at    TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE beta_access (
  id         SERIAL PRIMARY KEY,
  beta_id    INTEGER NOT NULL REFERENCES betas(id) ON DELETE CASCADE,
  member_id  INTEGER NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  status     TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(beta_id, member_id)
);

CREATE TABLE events (
  id              SERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT,
  event_type      TEXT NOT NULL DEFAULT 'online',
  location        TEXT,
  starts_at       TIMESTAMPTZ NOT NULL,
  ends_at         TIMESTAMPTZ,
  capacity        INTEGER,
  price_members   INTEGER NOT NULL DEFAULT 0,
  price_public    INTEGER,
  registration_url TEXT,
  is_published    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── PHASE 3 ───────────────────────────────────────────────────

CREATE TYPE point_action AS ENUM (
  'post_created', 'comment_created', 'reaction_received',
  'video_completed', 'profile_completed', 'invite_accepted',
  'daily_login', 'benchmark_viewed', 'event_attended'
);

CREATE TABLE member_points_log (
  id           SERIAL PRIMARY KEY,
  member_id    INTEGER NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  action       point_action NOT NULL,
  points       INTEGER NOT NULL,
  reference_id INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION accumulate_points() RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_members SET total_points = total_points + NEW.points WHERE id = NEW.member_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_accumulate_points
  AFTER INSERT ON member_points_log
  FOR EACH ROW EXECUTE FUNCTION accumulate_points();

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

INSERT INTO badges (slug, name, description, icon) VALUES
  ('first_post',      'Primera voz',      'Publicaste tu primer post',       '📢'),
  ('connector',       'Conector',         'Recibiste 10 reacciones',         '🤝'),
  ('video_addict',    'Video adicto',     'Completaste 5 videos',            '🎬'),
  ('top_contributor', 'Top Contributor',  'Llegaste al Top 10 del ranking',  '🥇'),
  ('founding_member', 'Founding Member',  'Uno de los primeros 50 miembros', '🌟'),
  ('benchmark_nerd',  'Benchmark Nerd',   'Consultaste 10 benchmarks',       '📊');

CREATE TABLE video_progress (
  id         SERIAL PRIMARY KEY,
  member_id  INTEGER NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  video_id   INTEGER NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  seconds    INTEGER NOT NULL DEFAULT 0,
  completed  BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(member_id, video_id)
);

CREATE TABLE admin_log (
  id          SERIAL PRIMARY KEY,
  admin_id    TEXT NOT NULL,
  action      TEXT NOT NULL,
  target_type TEXT,
  target_id   TEXT,
  details     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── INDEXES ───────────────────────────────────────────────────

CREATE INDEX idx_members_clerk      ON community_members(clerk_user_id);
CREATE INDEX idx_posts_author       ON posts(author_id);
CREATE INDEX idx_posts_feed         ON posts(is_published, is_pinned DESC, created_at DESC);
CREATE INDEX idx_comments_post      ON comments(post_id);
CREATE INDEX idx_reactions_post     ON reactions(post_id);
CREATE INDEX idx_videos_category    ON videos(category, level, order_index);
CREATE INDEX idx_points_member      ON member_points_log(member_id);
CREATE INDEX idx_vp_member          ON video_progress(member_id);

-- ── INVITE CODE PARA ACCESO INICIAL ──────────────────────────

INSERT INTO invite_codes (code, max_uses, is_active)
VALUES ('FARDO-MALE-2026', 1, true);
