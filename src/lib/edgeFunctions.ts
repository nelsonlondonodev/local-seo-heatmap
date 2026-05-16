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

  const { data, error } = await supabase.functions.invoke(functionName, options as any);

  if (error) {
    console.error(`[EdgeFunction] Error invoking ${functionName}:`, error);
    
    // Attempt to extract the server-side error message (e.g., 'Créditos insuficientes')
    let errorMessage = error.message;
    
    try {
      if (error.context instanceof Response) {
        const bodyText = await error.context.clone().text();
        const json = JSON.parse(bodyText);
        if (json.error) {
          errorMessage = json.error;
        }
      }
    } catch (e) {
      console.warn(`[EdgeFunction] Failed to parse error JSON for ${functionName}`);
    }

    throw new Error(errorMessage || `Error en la función: ${functionName}`);
  }

  return data as TResponse;
}
