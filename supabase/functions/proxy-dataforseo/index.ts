import { corsHeaders, handleCorsPreflightRequest, buildCorsHeaders } from '../_shared/cors.ts';
import { getAuthenticatedUser, unauthorizedResponse } from '../_shared/auth.ts';
import { validateUserCredits } from '../_shared/security.ts';

/**
 * Edge Function: proxy-dataforseo
 * Proxies requests to DataForSEO API v3.
 * Keeps the DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD secrets on the server side.
 *
 * Expected body: { endpoint: string, payload?: object, method?: 'GET' | 'POST' }
 */

// Declarative lookup map for DataForSEO endpoint costs
const ENDPOINT_COSTS: Record<string, number> = {
  '/keywords_data/google/locations/': 1,
  '/keywords_data/': 5,
  '/serp/': 5,
  '/dataforseo_labs/': 5,
} as const;

/**
 * Resolves the dynamic credit cost based on the targeted DataForSEO API endpoint.
 * - Locations/Geocoding autocomplete is cheap (1 credit).
 * - Comprehensive analysis (Labs / SERP / Keywords) costs 5 credits.
 */
function calculateRequestCost(endpoint: string): number {
  const matchedKey = Object.keys(ENDPOINT_COSTS).find(prefix => endpoint.startsWith(prefix));
  return matchedKey ? ENDPOINT_COSTS[matchedKey] : 5; // Safe default fallback
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('Origin');
  const dynamicCors = buildCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(origin);
  }

  // Reject requests from disallowed origins
  if (!dynamicCors['Access-Control-Allow-Origin']) {
    return new Response('Forbidden', { status: 403 });
  }

  // 1. Authenticate
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return unauthorizedResponse(dynamicCors);
  }

  // 2. Read secrets
  const login = Deno.env.get('DATAFORSEO_LOGIN');
  const password = Deno.env.get('DATAFORSEO_PASSWORD');
  if (!login || !password) {
    return new Response(
      JSON.stringify({ error: 'Server misconfiguration: Missing DataForSEO credentials.' }),
      { status: 500, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
    );
  }

  const BASE_URL = 'https://api.dataforseo.com/v3';

  try {
    // 3. Parse incoming request safely
    let body: { endpoint?: string; payload?: unknown; method?: string } = {};
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'El cuerpo de la solicitud no es un JSON válido.' }),
        { status: 400, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
      );
    }

    const { endpoint, payload, method } = body;

    if (!endpoint || typeof endpoint !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Payload inválido: se requiere el campo "endpoint" como string.' }),
        { status: 400, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Validate endpoint prefix (security: prevent SSRF)
    const allowedPrefixes = Object.keys(ENDPOINT_COSTS);
    const isAllowed = allowedPrefixes.some(prefix => endpoint.startsWith(prefix));
    if (!isAllowed) {
      return new Response(
        JSON.stringify({ error: `Prefijo de endpoint no permitido: "${endpoint}".` }),
        { status: 403, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
      );
    }

    // 5. SECURITY CHECK: Rate Limiting & Credits validation
    let cost = calculateRequestCost(endpoint);

    // Multi-task billing safety: If payload is a non-empty array (batch),
    // multiply the cost by the number of elements.
    if (Array.isArray(payload) && payload.length > 0) {
      cost = cost * payload.length;
    }

    // Structured Audit Log for telemetry tracing
    console.log(`[AUDIT] [proxy-dataforseo] User: ${user.id} | Endpoint: ${endpoint} | Costo: ${cost} créditos`);

    const securityCheck = await validateUserCredits(user.id, cost, 0); // 0 seconds to allow concurrent requests
    if (!securityCheck.success) {
      return new Response(
        JSON.stringify({ 
          error: securityCheck.error || 'Créditos insuficientes para realizar análisis de SEO.', 
          code: securityCheck.code || 'INSUFFICIENT_CREDITS' 
        }),
        { status: 429, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
      );
    }

    // 6. Build auth header
    const authHeader = `Basic ${btoa(`${login}:${password}`)}`;

    // 7. Forward to DataForSEO
    const fetchOptions: RequestInit = {
      method: method || (payload ? 'POST' : 'GET'),
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    };

    if (payload) {
      fetchOptions.body = JSON.stringify(payload);
    }

    const apiResponse = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
    const data = await apiResponse.json();

    return new Response(JSON.stringify(data), {
      status: apiResponse.status,
      headers: { ...dynamicCors, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[proxy-dataforseo] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal proxy error.' }),
      { status: 500, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
    );
  }
});
