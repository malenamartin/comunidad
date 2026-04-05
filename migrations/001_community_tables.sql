-- Comunidad Fardo — Phase 1 tables
-- Run once against your PostgreSQL database.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS community_members (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
  email         VARCHAR(255) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  company       VARCHAR(255),
  job_title     VARCHAR(255),
  country       VARCHAR(100),
  linkedin_url  VARCHAR(500),
  bio           TEXT,
  points        INTEGER DEFAULT 0,
  level         VARCHAR(50) DEFAULT 'invisible',
  invite_code_used VARCHAR(50),
  is_founder    BOOLEAN DEFAULT false,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invite_codes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          VARCHAR(50) UNIQUE NOT NULL,
  created_by    UUID REFERENCES community_members(id),
  max_uses      INTEGER DEFAULT 1,
  current_uses  INTEGER DEFAULT 0,
  expires_at    TIMESTAMP,
  is_active     BOOLEAN DEFAULT true,
  notes         TEXT,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id     UUID REFERENCES community_members(id),
  title         VARCHAR(500) NOT NULL,
  body          TEXT NOT NULL,
  post_type     VARCHAR(50) NOT NULL,
  is_pinned     BOOLEAN DEFAULT false,
  is_published  BOOLEAN DEFAULT true,
  views         INTEGER DEFAULT 0,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id       UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id     UUID REFERENCES community_members(id),
  parent_id     UUID REFERENCES comments(id),
  body          TEXT NOT NULL,
  is_published  BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id     UUID REFERENCES community_members(id),
  post_id       UUID REFERENCES posts(id) ON DELETE CASCADE,
  reaction_type VARCHAR(20) DEFAULT 'like',
  created_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE(member_id, post_id)
);

CREATE TABLE IF NOT EXISTS videos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(500) NOT NULL,
  description   TEXT,
  category      VARCHAR(50) NOT NULL,
  level         VARCHAR(20) DEFAULT 'intro',
  duration_min  INTEGER,
  vimeo_id      VARCHAR(100),
  thumbnail_url VARCHAR(500),
  order_index   INTEGER DEFAULT 0,
  is_published  BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- access_requests table for manual review flow
CREATE TABLE IF NOT EXISTS access_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  company       VARCHAR(255),
  job_title     VARCHAR(255),
  country       VARCHAR(100),
  linkedin_url  VARCHAR(500),
  status        VARCHAR(20) DEFAULT 'pending',
  -- pending | approved | rejected
  notes         TEXT,
  created_at    TIMESTAMP DEFAULT NOW(),
  reviewed_at   TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(is_published, is_pinned DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(post_type);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_post ON reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_members_clerk ON community_members(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category, level, order_index);
