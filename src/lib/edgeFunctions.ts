import { supabase } from './supabase';

/**
 * Helper to invoke Supabase Edge Functions with automatic JWT injection.
 * Centralizes all proxy calls through a single, type-safe entry point.
 */
export async function invokeEdgeFunction<T>(
  functionName: string,
  body: Record<string, unknown>
): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    console.error('[EdgeFunction] No access token found in session');
    throw new Error('No active session. Please log in.');
  }

  // console.log('[EdgeFunction] Sending token:', session.access_token.substring(0, 10) + '...');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      'apikey': anonKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
    throw new Error(
      (errorData as { error?: string }).error || `Edge Function error: ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}
