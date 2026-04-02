-- saunas table
CREATE TABLE IF NOT EXISTS saunas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  prefecture TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  rating DOUBLE PRECISION,
  phone TEXT,
  website TEXT,
  opening_hours JSONB,
  photos JSONB,
  google_reviews JSONB,
  ai_summary TEXT,
  honmono_score INTEGER,
  score_detail JSONB,
  food_info JSONB,
  is_closed BOOLEAN DEFAULT FALSE,
  cached_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- sauna_reviews table (renamed to avoid conflict with existing reviews table)
CREATE TABLE IF NOT EXISTS sauna_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sauna_id UUID NOT NULL REFERENCES saunas(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- indexes
CREATE INDEX IF NOT EXISTS idx_saunas_prefecture ON saunas(prefecture);
CREATE INDEX IF NOT EXISTS idx_saunas_place_id ON saunas(place_id);
CREATE INDEX IF NOT EXISTS idx_sauna_reviews_sauna_id ON sauna_reviews(sauna_id);

-- RLS
ALTER TABLE saunas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sauna_reviews ENABLE ROW LEVEL SECURITY;

-- Add columns if migrating from older schema
ALTER TABLE saunas ADD COLUMN IF NOT EXISTS food_info JSONB;
ALTER TABLE saunas ADD COLUMN IF NOT EXISTS is_closed BOOLEAN DEFAULT FALSE;

-- saunas: everyone can SELECT, only service_role can INSERT/UPDATE
CREATE POLICY "saunas_select" ON saunas FOR SELECT USING (true);
CREATE POLICY "saunas_insert" ON saunas FOR INSERT WITH CHECK (
  (current_setting('role') = 'service_role')
);
CREATE POLICY "saunas_update" ON saunas FOR UPDATE USING (
  (current_setting('role') = 'service_role')
);

-- sauna_reviews: everyone can SELECT and INSERT
CREATE POLICY "sauna_reviews_select" ON sauna_reviews FOR SELECT USING (true);
CREATE POLICY "sauna_reviews_insert" ON sauna_reviews FOR INSERT WITH CHECK (true);
