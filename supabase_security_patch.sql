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
-- FIX #2: is_super_admin
-- PROBLEM: Signed-in users can call it directly (minor risk, but flagged)
-- NOTE: This function IS needed by authenticated users for RLS policies,
--       but we revoke from PUBLIC (anonymous) to reduce surface area.
-- ===========================================

REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_super_admin() FROM anon;

-- Re-grant only to who needs it
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO service_role;

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
