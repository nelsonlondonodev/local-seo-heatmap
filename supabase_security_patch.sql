-- =============================================
-- SECURITY PATCH: Fix Supabase Security Advisor Warnings
-- Run this in Supabase SQL Editor IMMEDIATELY
-- =============================================

-- ===========================================
-- FIX #1: check_and_deduct_credits
-- PROBLEM: PUBLIC and authenticated users can call it directly
-- SOLUTION: Only service_role (Edge Functions) should execute this
-- ===========================================

-- Revoke from EVERYONE first (clean slate)
REVOKE ALL ON FUNCTION public.check_and_deduct_credits(UUID, INTEGER, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_and_deduct_credits(UUID, INTEGER, INTEGER) FROM authenticated;
REVOKE ALL ON FUNCTION public.check_and_deduct_credits(UUID, INTEGER, INTEGER) FROM anon;

-- Grant ONLY to service_role (used by Edge Functions internally)
GRANT EXECUTE ON FUNCTION public.check_and_deduct_credits(UUID, INTEGER, INTEGER) TO service_role;

-- ===========================================
-- FIX #2: is_super_admin Isolation (Remove Warning)
-- PROBLEM: Signed-in users can execute public.is_super_admin() via /rest/v1/rpc
-- SOLUTION: Move the function to internal schema and drop the old public one.
-- ===========================================

-- 1. Create internal schema
CREATE SCHEMA IF NOT EXISTS internal;

-- 2. Create function under internal schema
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

-- 3. Configure strict permissions on new function
REVOKE ALL ON FUNCTION internal.is_super_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION internal.is_super_admin() FROM anon;
GRANT EXECUTE ON FUNCTION internal.is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION internal.is_super_admin() TO service_role;

-- 4. Update Policies RLS to point to the new function
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

-- 5. Drop the old public function to satisfy security advisor
DROP FUNCTION IF EXISTS public.is_super_admin();

-- ===========================================
-- FIX #3: ip_rate_limits table security
-- Ensure RLS is enabled and only service_role can access
-- ===========================================

ALTER TABLE public.ip_rate_limits ENABLE ROW LEVEL SECURITY;

-- No public policies - only service_role (Edge Functions) can read/write
-- This table is invisible to all frontend users

-- ===========================================
-- VERIFICATION: Run this to confirm permissions are correct
-- ===========================================
-- SELECT 
--   routine_name, 
--   grantee, 
--   privilege_type 
-- FROM information_schema.routine_privileges 
-- WHERE routine_name IN ('check_and_deduct_credits', 'is_super_admin')
-- ORDER BY routine_name, grantee;
