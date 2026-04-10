-- Avatares de comunidad (presets admin + elección miembro) y compatibilidad admin

CREATE TABLE IF NOT EXISTS community_preset_avatars (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url     TEXT NOT NULL,
  label         VARCHAR(100),
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_preset_avatars_active ON community_preset_avatars (is_active, sort_order);

ALTER TABLE community_members
  ADD COLUMN IF NOT EXISTS avatar_source VARCHAR(20) NOT NULL DEFAULT 'clerk',
  ADD COLUMN IF NOT EXISTS preset_avatar_id UUID REFERENCES community_preset_avatars(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS clerk_avatar_url TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'community_members_avatar_source_check'
  ) THEN
    ALTER TABLE community_members
      ADD CONSTRAINT community_members_avatar_source_check
      CHECK (avatar_source IN ('clerk', 'preset'));
  END IF;
END $$;
