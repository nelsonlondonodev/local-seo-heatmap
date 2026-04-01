-- 1. Create agencies table for White Label
CREATE TABLE IF NOT EXISTS public.agencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  owner_id UUID NOT NULL, -- The 'owner' of this agency
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('super-admin', 'owner', 'admin', 'staff', 'client')),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create heatmaps table to store searches
CREATE TABLE IF NOT EXISTS public.heatmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL, -- Track which agency owns this scan
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

-- 4. Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heatmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies

-- Agencies Policies
CREATE POLICY "SuperAdmins can do everything on agencies" 
  ON public.agencies FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super-admin')
  );

CREATE POLICY "Owners can view their own agency" 
  ON public.agencies FOR SELECT USING (owner_id = auth.uid());

-- Profiles Policies
CREATE POLICY "SuperAdmins can view all profiles" 
  ON public.profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super-admin')
  );

CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Heatmaps Policies
CREATE POLICY "SuperAdmins can view all heatmaps" 
  ON public.heatmaps FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super-admin')
  );

CREATE POLICY "Users can view their own heatmaps" 
  ON public.heatmaps FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own heatmaps" 
  ON public.heatmaps FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own heatmaps" 
  ON public.heatmaps FOR DELETE USING (auth.uid() = user_id);

-- 6. Trigger: Automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
