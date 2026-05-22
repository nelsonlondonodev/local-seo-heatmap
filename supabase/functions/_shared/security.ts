import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

/**
 * Validates and deducts credits for a user transaction.
 * This is called from Edge Functions before executing expensive API calls.
 */
export async function validateUserCredits(userId: string, cost: number, minSeconds = 20) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase.rpc('check_and_deduct_credits', {
    p_user_id: userId,
    p_cost: cost,
    p_min_seconds_between_scans: minSeconds
  });

  if (error) {
    console.error('[security] RPC Error:', error);
    return { success: false, error: 'Database security check failed.' };
  }

  return data as { success: boolean; error?: string; code?: string; remaining_credits?: number };
}

/**
 * Basic IP-based throttling (optional additional layer)
 */
export async function checkIpRateLimit(ip: string) {
  // Implementation for Phase 2 if needed (using ip_rate_limits table)
  return true;
}
