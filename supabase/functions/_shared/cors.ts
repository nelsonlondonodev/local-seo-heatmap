/**
 * Shared CORS headers for all Edge Functions.
 * Allows requests from any origin during development.
 * In production, restrict to your domain(s).
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/**
 * Creates a standard CORS preflight response for OPTIONS requests.
 */
export function handleCorsPreflightRequest(): Response {
  return new Response('ok', { headers: corsHeaders });
}
