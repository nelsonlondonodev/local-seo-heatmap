import { corsHeaders, handleCorsPreflightRequest, buildCorsHeaders } from '../_shared/cors.ts';
import { getAuthenticatedUser, unauthorizedResponse } from '../_shared/auth.ts';
import { validateUserCredits } from '../_shared/security.ts';

/**
 * Edge Function: proxy-serper
 * Proxies requests to Serper.dev APIs (Maps + Search).
 * Now includes Rate Limiting and Credit Verification.
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

  // 2. SECURITY CHECK: Rate Limiting & Credits
  // For 'maps' endpoint, we consider a cost of 1 credit per point.
  // For 'search', we might consider it 1 or 0 depending on policy.
  const { endpoint, payload } = await req.json();
  const cost = endpoint === 'maps' ? 1 : 0; // Search is cheaper/cached often

  if (cost > 0) {
    const securityCheck = await validateUserCredits(user.id, cost);
    if (!securityCheck.success) {
      return new Response(
        JSON.stringify({ 
          error: securityCheck.error, 
          code: securityCheck.code 
        }),
        { status: 429, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
      );
    }
  }

  // 3. Read secret
  const apiKey = Deno.env.get('SERPER_API_KEY');
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Server misconfiguration: Missing SERPER_API_KEY secret.' }),
      { status: 500, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const validEndpoints: Record<string, string> = {
      maps: 'https://google.serper.dev/maps',
      search: 'https://google.serper.dev/search',
    };

    const targetUrl = validEndpoints[endpoint];
    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: `Invalid endpoint: "${endpoint}".` }),
        { status: 400, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Forward to Serper
    const serperResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await serperResponse.json();

    return new Response(JSON.stringify(data), {
      status: serperResponse.status,
      headers: { ...dynamicCors, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[proxy-serper] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal proxy error.' }),
      { status: 500, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
    );
  }
});
