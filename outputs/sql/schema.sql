-- saunas table
CREATE TABLE saunas (
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
  cached_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sauna_id UUID NOT NULL REFERENCES saunas(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- indexes
CREATE INDEX idx_saunas_prefecture ON saunas(prefecture);
CREATE INDEX idx_saunas_place_id ON saunas(place_id);
CREATE INDEX idx_reviews_sauna_id ON reviews(sauna_id);

-- RLS
ALTER TABLE saunas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- saunas: everyone can SELECT, only service_role can INSERT/UPDATE
CREATE POLICY "saunas_select" ON saunas FOR SELECT USING (true);
CREATE POLICY "saunas_insert" ON saunas FOR INSERT WITH CHECK (
  (current_setting('role') = 'service_role')
);
CREATE POLICY "saunas_update" ON saunas FOR UPDATE USING (
  (current_setting('role') = 'service_role')
);

-- reviews: everyone can SELECT and INSERT
CREATE POLICY "reviews_select" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (true);
