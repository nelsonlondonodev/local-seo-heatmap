-- SECURITY HARDENING: Rate Limiting & Credit System

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
-- This is the core 'Shield' for the SaaS profitability
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

-- Secure the function execution
REVOKE EXECUTE ON FUNCTION public.check_and_deduct_credits(UUID, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_and_deduct_credits(UUID, INTEGER, INTEGER) TO authenticated, service_role;
