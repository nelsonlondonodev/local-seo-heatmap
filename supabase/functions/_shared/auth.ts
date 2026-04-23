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

  const token = authHeader.replace('Bearer ', '');

  // Use built-in env vars for Supabase internal client
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[auth] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return null;
  }

  // Use service_role to have admin privileges for user validation
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('[auth] Error validating user with getUser(token):', error.message);
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
