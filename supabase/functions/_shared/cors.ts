/**
 * Shared CORS headers for all Edge Functions.
 * Restricts origins to production domain and local development.
 */

const ALLOWED_ORIGINS = [
  'https://local-seo-heatmap-six.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

/**
 * Resolves the correct Access-Control-Allow-Origin header
 * based on the incoming request origin.
 * Returns empty string if origin is not in the allowlist.
 */
function resolveOrigin(requestOrigin: string | null): string {
  if (!requestOrigin) return ALLOWED_ORIGINS[0];
  return ALLOWED_ORIGINS.includes(requestOrigin) ? requestOrigin : '';
}

/**
 * Builds CORS headers with a validated origin.
 */
export function buildCorsHeaders(requestOrigin: string | null): Record<string, string> {
  const origin = resolveOrigin(requestOrigin);
  if (!origin) return {};

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

/**
 * Legacy export for backwards compatibility.
 * Uses the production origin as default.
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS[0],
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Vary': 'Origin',
};

/**
 * Creates a standard CORS preflight response for OPTIONS requests.
 */
export function handleCorsPreflightRequest(requestOrigin?: string | null): Response {
  const headers = requestOrigin ? buildCorsHeaders(requestOrigin) : corsHeaders;
  return new Response('ok', { headers });
}
