-- ==========================================================
-- New Port Said Restaurant - Full Database Schema
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  image TEXT,
  description TEXT,
  icon TEXT DEFAULT 'Flame',
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  is_daily BOOLEAN DEFAULT FALSE,
  badge TEXT,
  description TEXT,
  image TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Restaurant Settings Table
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id TEXT PRIMARY KEY DEFAULT 'default_settings',
  name TEXT NOT NULL,
  name_en TEXT,
  tagline TEXT,
  phones TEXT[] DEFAULT '{}',
  address TEXT,
  whatsapp TEXT,
  working_hours TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Customer Reviews Table
CREATE TABLE IF NOT EXISTS customer_reviews (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  rating INT DEFAULT 5,
  comment TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Suggestions & Complaints (Feedback) Table
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  type TEXT DEFAULT 'suggestion', -- 'suggestion', 'complaint'
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Row Level Security (RLS) Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow Public Read
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Menu Items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON restaurant_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Approved Reviews" ON customer_reviews FOR SELECT USING (status = 'approved');

-- Allow Public Insert for Reviews & Feedback
CREATE POLICY "Public Insert Reviews" ON customer_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Feedback" ON feedback FOR INSERT WITH CHECK (true);

-- Allow Public Write / Admin (For demo API key full access)
CREATE POLICY "Full Access Categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Menu Items" ON menu_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Settings" ON restaurant_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Reviews" ON customer_reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Feedback" ON feedback FOR ALL USING (true) WITH CHECK (true);
