import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

/**
 * Validates the user JWT from the Authorization header.
 * Returns the authenticated user or null if invalid.
 */
export async function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    console.error('[auth] No Authorization header found');
    return null;
  }

  // Use built-in env vars for Supabase internal client
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[auth] Missing SUPABASE_URL or SUPABASE_ANON_KEY');
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('[auth] Error validating user:', error.message);
      return null;
    }

    if (!user) {
      console.error('[auth] No user found for token');
      return null;
    }

    return user;
  } catch (err) {
    console.error('[auth] Unexpected error during getUser:', err);
    return null;
  }
}

/**
 * Creates a standardized JSON error response.
 */
export function unauthorizedResponse(corsHeaders: Record<string, string>): Response {
  return new Response(
    JSON.stringify({ error: 'Unauthorized: Invalid or missing JWT token.' }),
    { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
