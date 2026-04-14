-- Admin-managed avatar presets + per-member avatar selection

CREATE TABLE IF NOT EXISTS community_avatar_presets (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  image_url   TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS member_avatar_selection (
  member_id          INTEGER PRIMARY KEY REFERENCES community_members(id) ON DELETE CASCADE,
  preset_id          INTEGER REFERENCES community_avatar_presets(id) ON DELETE SET NULL,
  custom_avatar_url  TEXT,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_avatar_presets_active
  ON community_avatar_presets(is_active, order_index);

INSERT INTO community_avatar_presets (name, image_url, order_index, is_active)
SELECT * FROM (
  VALUES
    ('CMO Naranja', 'https://api.dicebear.com/9.x/lorelei/svg?seed=CMO-Naranja&backgroundColor=ffedd5,fdba74,fb923c', 1, true),
    ('Estratega Azul', 'https://api.dicebear.com/9.x/lorelei/svg?seed=Estratega-Azul&backgroundColor=dbeafe,93c5fd,60a5fa', 2, true),
    ('Growth Verde', 'https://api.dicebear.com/9.x/lorelei/svg?seed=Growth-Verde&backgroundColor=dcfce7,86efac,4ade80', 3, true),
    ('Brand Violeta', 'https://api.dicebear.com/9.x/lorelei/svg?seed=Brand-Violeta&backgroundColor=f3e8ff,d8b4fe,a78bfa', 4, true)
) AS defaults(name, image_url, order_index, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM community_avatar_presets
);

