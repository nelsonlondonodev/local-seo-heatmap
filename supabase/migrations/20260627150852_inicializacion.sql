-- ==========================================================
-- 1. BASE SCHEMA (supabase_schema.sql)
-- ==========================================================

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
  email TEXT NOT NULL, Full_name TEXT,
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

-- 5. Create Security Definer Functions
CREATE SCHEMA IF NOT EXISTS internal;

CREATE OR REPLACE FUNCTION internal.is_super_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'super-admin'
  );
END;
$$;

-- Secure the function execution
REVOKE EXECUTE ON FUNCTION internal.is_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION internal.is_super_admin() TO authenticated, service_role;

-- 6. Create Policies

-- Agencies Policies
CREATE POLICY "SuperAdmins can do everything on agencies" 
  ON public.agencies FOR ALL USING (internal.is_super_admin());

CREATE POLICY "Owners can view their own agency" 
  ON public.agencies FOR SELECT USING (owner_id = auth.uid());

-- Profiles Policies
CREATE POLICY "SuperAdmins can view all profiles" 
  ON public.profiles FOR SELECT USING (internal.is_super_admin());

CREATE POLICY "SuperAdmins can update all profiles" 
  ON public.profiles FOR UPDATE USING (internal.is_super_admin());

CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Heatmaps Policies
CREATE POLICY "SuperAdmins can view all heatmaps" 
  ON public.heatmaps FOR SELECT USING (internal.is_super_admin());

CREATE POLICY "Users can view their own heatmaps" 
  ON public.heatmaps FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Agency members can view all agency heatmaps" 
  ON public.heatmaps FOR SELECT USING (
    agency_id IN (
      SELECT agency_id FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'admin', 'staff')
    )
  );

CREATE POLICY "Users can create their own heatmaps" 
  ON public.heatmaps FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own heatmaps" 
  ON public.heatmaps FOR DELETE USING (auth.uid() = user_id);

-- 7. Trigger: Automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==========================================================
-- 2. SECURITY HARDENING: Rate Limiting & Credit System (supabase_security_hardening.sql)
-- ==========================================================

-- 1. Extend profiles with credit tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 20,
ADD COLUMN IF NOT EXISTS last_scan_at TIMESTAMPTZ;

-- 2. Create a log for IP-based rate limiting (simple version)
CREATE TABLE IF NOT EXISTS public.ip_rate_limits (
  ip TEXT PRIMARY KEY,
  request_count INTEGER DEFAULT 0,
  last_request TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Atomic Function to check and deduct credits
CREATE OR REPLACE FUNCTION public.check_and_deduct_credits(
  p_user_id UUID,
  p_cost INTEGER,
  p_min_seconds_between_scans INTEGER DEFAULT 30
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_credits INTEGER;
  v_last_scan TIMESTAMPTZ;
  v_seconds_since_last_scan INTEGER;
BEGIN
  -- Get current user state
  SELECT credits, last_scan_at 
  INTO v_current_credits, v_last_scan
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE; -- Lock row for consistency

  -- Check 1: Insufficient Credits
  IF v_current_credits < p_cost THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Créditos insuficientes',
      'code', 'INSUFFICIENT_CREDITS'
    );
  END IF;

  -- Check 2: Temporal Rate Limit (Spam prevention)
  IF v_last_scan IS NOT NULL THEN
    v_seconds_since_last_scan := EXTRACT(EPOCH FROM (NOW() - v_last_scan));
    IF v_seconds_since_last_scan < p_min_seconds_between_scans THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'Por favor, espera ' || (p_min_seconds_between_scans - v_seconds_since_last_scan) || ' segundos antes del próximo escaneo.',
        'code', 'TEMPORAL_LIMIT'
      );
    END IF;
  END IF;

  -- Execution: Deduct credits and update timestamp
  UPDATE public.profiles
  SET 
    credits = credits - p_cost,
    last_scan_at = NOW()
  WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'remaining_credits', v_current_credits - p_cost
  );
END;
$$;

-- Secure the function execution (ONLY service_role can call this)
REVOKE ALL ON FUNCTION public.check_and_deduct_credits(UUID, INTEGER, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_and_deduct_credits(UUID, INTEGER, INTEGER) FROM authenticated;
REVOKE ALL ON FUNCTION public.check_and_deduct_credits(UUID, INTEGER, INTEGER) FROM anon;
GRANT EXECUTE ON FUNCTION public.check_and_deduct_credits(UUID, INTEGER, INTEGER) TO service_role;

-- Secure ip_rate_limits table
ALTER TABLE public.ip_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service_role can access ip_rate_limits"
  ON public.ip_rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ==========================================================
-- 3. SECURITY PATCH (supabase_security_patch.sql)
-- ==========================================================

-- FIX #1: check_and_deduct_credits Security
REVOKE ALL ON FUNCTION public.check_and_deduct_credits(UUID, INTEGER, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_and_deduct_credits(UUID, INTEGER, INTEGER) FROM authenticated;
REVOKE ALL ON FUNCTION public.check_and_deduct_credits(UUID, INTEGER, INTEGER) FROM anon;
GRANT EXECUTE ON FUNCTION public.check_and_deduct_credits(UUID, INTEGER, INTEGER) TO service_role;

-- FIX #2: is_super_admin Isolation
CREATE OR REPLACE FUNCTION internal.is_super_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'super-admin'
  );
END;
$$;

REVOKE ALL ON FUNCTION internal.is_super_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION internal.is_super_admin() FROM anon;
GRANT EXECUTE ON FUNCTION internal.is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION internal.is_super_admin() TO service_role;

-- Update Policies RLS to point to the new function
DROP POLICY IF EXISTS "SuperAdmins can do everything on agencies" ON public.agencies;
CREATE POLICY "SuperAdmins can do everything on agencies" 
  ON public.agencies FOR ALL USING (internal.is_super_admin());

DROP POLICY IF EXISTS "SuperAdmins can view all profiles" ON public.profiles;
CREATE POLICY "SuperAdmins can view all profiles" 
  ON public.profiles FOR SELECT USING (internal.is_super_admin());

DROP POLICY IF EXISTS "SuperAdmins can update all profiles" ON public.profiles;
CREATE POLICY "SuperAdmins can update all profiles" 
  ON public.profiles FOR UPDATE USING (internal.is_super_admin());

DROP POLICY IF EXISTS "SuperAdmins can view all heatmaps" ON public.heatmaps;
CREATE POLICY "SuperAdmins can view all heatmaps" 
  ON public.heatmaps FOR SELECT USING (internal.is_super_admin());

-- Drop the old public function to satisfy security advisor
DROP FUNCTION IF EXISTS public.is_super_admin();

-- FIX #3: ip_rate_limits table security
ALTER TABLE public.ip_rate_limits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Only service_role can access ip_rate_limits" ON public.ip_rate_limits;
CREATE POLICY "Only service_role can access ip_rate_limits"
  ON public.ip_rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ==========================================================
-- 4. CREDITS PATCH (supabase_credits_patch.sql)
-- ==========================================================

-- Alter the default credits for newly registered users on the profiles table
ALTER TABLE public.profiles ALTER COLUMN credits SET DEFAULT 50;

-- Adjust credits of existing client/free profiles from 20 to 50 credits
UPDATE public.profiles 
SET credits = 50 
WHERE credits = 20 AND role = 'client';


-- ==========================================================
-- 5. KEYWORD INTELLIGENCE MODULE (supabase_kw_intelligence.sql)
-- ==========================================================

-- 1. Create keyword_projects table
CREATE TABLE IF NOT EXISTS public.keyword_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  target_url TEXT,
  location_code INTEGER,
  language_code TEXT DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create tracked_keywords table
CREATE TABLE IF NOT EXISTS public.tracked_keywords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.keyword_projects(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  search_engine TEXT DEFAULT 'google',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create keyword_history table
CREATE TABLE IF NOT EXISTS public.keyword_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword_id UUID NOT NULL REFERENCES public.tracked_keywords(id) ON DELETE CASCADE,
  rank INTEGER,
  rank_change INTEGER DEFAULT 0,
  search_volume INTEGER,
  results_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE public.keyword_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracked_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_history ENABLE ROW LEVEL SECURITY;

-- 5. Policies

-- Keyword Projects
CREATE POLICY "Users can view their own keyword projects" 
  ON public.keyword_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own keyword projects" 
  ON public.keyword_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own keyword projects" 
  ON public.keyword_projects FOR DELETE USING (auth.uid() = user_id);

-- Tracked Keywords
CREATE POLICY "Users can view keywords of their own projects" 
  ON public.tracked_keywords FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.keyword_projects WHERE id = project_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can insert keywords to their own projects" 
  ON public.tracked_keywords FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.keyword_projects WHERE id = project_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can delete their own tracked keywords" 
  ON public.tracked_keywords FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.keyword_projects WHERE id = project_id AND user_id = auth.uid())
  );

-- Keyword History
CREATE POLICY "Users can view history of their own keywords" 
  ON public.keyword_history FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tracked_keywords tk
      JOIN public.keyword_projects kp ON tk.project_id = kp.id
      WHERE tk.id = keyword_id AND kp.user_id = auth.uid()
    )
  );
