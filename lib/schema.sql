-- =========================================================================
-- مطعم نيو بورسعيد | New Port Said Restaurant - Supabase Schema
-- Copy and paste this SQL script in your Supabase SQL Editor and click RUN
-- =========================================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_en TEXT,
    image TEXT,
    description TEXT,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    is_daily BOOLEAN DEFAULT FALSE,
    badge TEXT,
    description TEXT,
    image TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Restaurant Settings & Contact Info Table
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
    id TEXT PRIMARY KEY DEFAULT 'default_settings',
    name TEXT NOT NULL DEFAULT 'مطعم نيو بورسعيد',
    name_en TEXT DEFAULT 'New Port Said Restaurant',
    tagline TEXT DEFAULT 'أكل بشوات • طعم أصيل يُشوى بشغف',
    phones TEXT[] DEFAULT ARRAY['01007375151', '01100130080', '01008329497'],
    address TEXT DEFAULT 'سوهاج الجديدة - مول ريتاج 1',
    whatsapp TEXT DEFAULT '201007375151',
    working_hours TEXT DEFAULT 'يومياً من ١٢:٠٠ ظهراً حتى ٠٢:٠٠ صباحاً',
    facebook_url TEXT DEFAULT 'https://facebook.com',
    instagram_url TEXT DEFAULT 'https://instagram.com',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- 5. Create Permissive Policies for Read and Write
-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Public write categories" ON public.categories;
DROP POLICY IF EXISTS "Public read menu_items" ON public.menu_items;
DROP POLICY IF EXISTS "Public write menu_items" ON public.menu_items;
DROP POLICY IF EXISTS "Public read settings" ON public.restaurant_settings;
DROP POLICY IF EXISTS "Public write settings" ON public.restaurant_settings;

-- Allow Public Read Access
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read menu_items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON public.restaurant_settings FOR SELECT USING (true);

-- Allow Anonymous/Public Insert, Update, Delete for Admin Dashboard
CREATE POLICY "Public write categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public write menu_items" ON public.menu_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public write settings" ON public.restaurant_settings FOR ALL USING (true) WITH CHECK (true);
