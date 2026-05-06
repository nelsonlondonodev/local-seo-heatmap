import { corsHeaders, handleCorsPreflightRequest, buildCorsHeaders } from '../_shared/cors.ts';
import { getAuthenticatedUser, unauthorizedResponse } from '../_shared/auth.ts';

/**
 * Edge Function: proxy-dataforseo
 * Proxies requests to DataForSEO API v3.
 * Keeps the DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD secrets on the server side.
 *
 * Expected body: { endpoint: string, payload?: object, method?: 'GET' | 'POST' }
 * Example endpoints:
 *   - "/keywords_data/google_ads/keywords_for_keywords/live"
 *   - "/keywords_data/google_ads/search_volume/live"
 *   - "/serp/google/organic/live/advanced"
 *   - "/keywords_data/google/locations/ES"
 */
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
    // 3. Parse incoming request
    const { endpoint, payload, method } = await req.json();

    if (!endpoint || typeof endpoint !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid payload: "endpoint" string is required.' }),
        { status: 400, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Validate endpoint prefix (security: prevent SSRF)
    const allowedPrefixes = [
      '/keywords_data/',
      '/serp/',
      '/dataforseo_labs/',
    ];
    const isAllowed = allowedPrefixes.some(prefix => endpoint.startsWith(prefix));
    if (!isAllowed) {
      return new Response(
        JSON.stringify({ error: `Endpoint not allowed: "${endpoint}".` }),
        { status: 403, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Build auth header
    const authHeader = `Basic ${btoa(`${login}:${password}`)}`;

    // 6. Forward to DataForSEO
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
