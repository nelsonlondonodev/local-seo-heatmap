-- ==========================================================
-- DATABASE PATCH: Adjust Default Initial Credits to 50
-- Run this in your Supabase SQL Editor (https://supabase.com)
-- ==========================================================

-- 1. Alter the default credits for newly registered users on the profiles table
-- This overrides the previous default of 20 credits.
ALTER TABLE public.profiles ALTER COLUMN credits SET DEFAULT 50;

-- 2. Optional: Adjust credits of existing client/free profiles from 20 to 50 credits
-- This helps align existing accounts created during testing with the new limit.
UPDATE public.profiles 
SET credits = 50 
WHERE credits = 20 AND role = 'client';

-- 3. Verification query (run to confirm the default value is set to 50)
-- SELECT column_name, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'profiles' AND column_name = 'credits';
