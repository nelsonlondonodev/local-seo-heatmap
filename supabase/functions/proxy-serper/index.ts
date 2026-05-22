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

  // Deserializar con tipado estricto (eliminando any implícitos)
  let body: { endpoint?: string; payload?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'El cuerpo de la solicitud no es un JSON válido.' }),
      { status: 400, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
    );
  }

  const { endpoint, payload } = body;

  if (!endpoint || typeof endpoint !== 'string') {
    return new Response(
      JSON.stringify({ error: 'Payload inválido: se requiere el campo "endpoint" como string.' }),
      { status: 400, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
    );
  }

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

  // 2. SECURITY CHECK: Rate Limiting & Credits
  // All valid endpoints cost 1 credit.
  const cost = 1;

  const securityCheck = await validateUserCredits(user.id, cost, 0); // 0 seconds to allow concurrent requests
  if (!securityCheck.success) {
    return new Response(
      JSON.stringify({ 
        error: securityCheck.error, 
        code: securityCheck.code 
      }),
      { status: 429, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
    );
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
