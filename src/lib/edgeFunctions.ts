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
  
  if (!session) {
    console.warn(`[EdgeFunction] No active session for ${functionName}. This will likely fail with 401.`);
  } else {
    // console.log(`[EdgeFunction] Session found, invoking ${functionName}...`);
  }

  const options: { body: Record<string, unknown>; headers?: Record<string, string> } = { body };
  
  if (session?.access_token) {
    options.headers = {
      Authorization: `Bearer ${session.access_token}`,
    };
  }

  const { data, error } = await supabase.functions.invoke(functionName, options);

  if (error) {
    console.error(`[EdgeFunction] Error invoking ${functionName}:`, error);
    throw new Error(error.message || `Edge Function error: ${functionName}`);
  }

  return data as T;
}
