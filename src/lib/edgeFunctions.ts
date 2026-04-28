import { supabase } from './supabase';

/**
 * Helper to invoke Supabase Edge Functions with explicit JWT injection.
 * Centralizes all proxy calls through a single, type-safe entry point.
 */
export async function invokeEdgeFunction<TResponse = unknown, TRequest = Record<string, unknown>>(
  functionName: string,
  body: TRequest
): Promise<TResponse> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.warn(`[EdgeFunction] No active session for ${functionName}. This will likely fail with 401.`);
  }

  const options: { body: TRequest; headers?: Record<string, string> } = { body };
  
  if (session?.access_token) {
    options.headers = {
      Authorization: `Bearer ${session.access_token}`,
    };
  }

  const { data, error } = await supabase.functions.invoke(functionName, options);

  if (error) {
    console.error(`[EdgeFunction] Error invoking ${functionName}:`, error);
    
    // Log detailed response body for debugging proxy errors
    try {
      if (error.context instanceof Response) {
        const bodyText = await error.context.clone().text();
        console.error(`[EdgeFunction] Error Response (${functionName}):`, bodyText);
      } else {
        console.error(`[EdgeFunction] Error Object:`, error);
      }
    } catch (e) {
      console.error(`[EdgeFunction] Could not parse error details:`, e);
    }

    throw new Error(error.message || `Edge Function error: ${functionName}`);
  }

  return data as T;
}
