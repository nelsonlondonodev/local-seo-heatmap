-- 1. Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create heatmaps table to store searches
CREATE TABLE IF NOT EXISTS public.heatmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  business_name TEXT NOT NULL,
  place_id TEXT,
  grid_size TEXT NOT NULL,
  radius_km NUMERIC NOT NULL,
  center_lat NUMERIC NOT NULL,
  center_lng NUMERIC NOT NULL,
  points JSONB NOT NULL, -- Flexible storage for the points array
  created_at TIMESTAMPTZ DEFAULT NOW(),
  results_summary JSONB -- Optional: stats like avgRank, etc.
);

-- 3. Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heatmaps ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own heatmaps" 
  ON public.heatmaps FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own heatmaps" 
  ON public.heatmaps FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own heatmaps" 
  ON public.heatmaps FOR DELETE USING (auth.uid() = user_id);

-- 5. Trigger: Automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
