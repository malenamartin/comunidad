-- Phase 2 tables
-- Append to existing migration or run separately.

CREATE TABLE IF NOT EXISTS benchmarks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry        VARCHAR(100) NOT NULL,
  period          VARCHAR(20) NOT NULL,
  citation_rate   DECIMAL(5,2),
  sov_avg         DECIMAL(5,2),
  aeo_score_top   DECIMAL(5,2),
  geo_score_top   DECIMAL(5,2),
  llmo_score_top  DECIMAL(5,2),
  llmo_score_avg  DECIMAL(5,2),
  top_brands      JSONB,
  insights        TEXT,
  is_published    BOOLEAN DEFAULT false,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS betas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  description   TEXT,
  status        VARCHAR(30) DEFAULT 'soon',
  max_testers   INTEGER,
  current_count INTEGER DEFAULT 0,
  launch_date   DATE,
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS beta_access (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beta_id     UUID REFERENCES betas(id),
  member_id   UUID REFERENCES community_members(id),
  status      VARCHAR(20) DEFAULT 'waitlist',
  approved_at TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(beta_id, member_id)
);

CREATE TABLE IF NOT EXISTS events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(500) NOT NULL,
  description   TEXT,
  event_date    TIMESTAMP NOT NULL,
  location      VARCHAR(255),
  country       VARCHAR(100),
  format        VARCHAR(20) DEFAULT 'presencial',
  speakers      JSONB,
  register_url  VARCHAR(500),
  recording_url VARCHAR(500),
  member_price  DECIMAL(10,2),
  public_price  DECIMAL(10,2),
  is_published  BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Si betas existía de un esquema viejo sin order_index, crear la columna antes de los índices
ALTER TABLE betas ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Si events existía sin columnas esperadas por los índices
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_date TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_benchmarks_industry ON benchmarks(industry, is_published);
CREATE INDEX IF NOT EXISTS idx_benchmarks_period ON benchmarks(period);
CREATE INDEX IF NOT EXISTS idx_betas_status ON betas(status, order_index);
CREATE INDEX IF NOT EXISTS idx_beta_access_member ON beta_access(member_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date, is_published);
