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
    
    // Intento de capturar el cuerpo real del error 401 para ver qué dice
    try {
      if (error.context instanceof Response) {
        const bodyText = await error.context.clone().text();
        console.error(`[EdgeFunction] DETALLE DEL ERROR REAL (${functionName}):`, bodyText);
      } else {
        console.error(`[EdgeFunction] OBJETO ERROR COMPLETO:`, JSON.stringify(error, null, 2));
      }
    } catch (e) {
      console.error(`[EdgeFunction] No se pudo leer el detalle del error:`, e);
    }

    throw new Error(error.message || `Edge Function error: ${functionName}`);
  }

  return data as T;
}
