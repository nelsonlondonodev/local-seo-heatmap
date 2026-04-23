import { corsHeaders, handleCorsPreflightRequest } from '../_shared/cors.ts';
import { getAuthenticatedUser, unauthorizedResponse } from '../_shared/auth.ts';

/**
 * Edge Function: proxy-serper
 * Proxies requests to Serper.dev APIs (Maps + Search).
 * Keeps the SERPER_API_KEY secret on the server side.
 *
 * Expected body: { endpoint: 'maps' | 'search', payload: object }
 */
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  // 1. Authenticate (TEMPORARILY DISABLED FOR DEBUGGING)
  /*
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return unauthorizedResponse(corsHeaders);
  }
  */

  // 2. Read secret
  const apiKey = Deno.env.get('SERPER_API_KEY');
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Server misconfiguration: Missing SERPER_API_KEY secret.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 3. Parse incoming request
    const { endpoint, payload } = await req.json();

    const validEndpoints: Record<string, string> = {
      maps: 'https://google.serper.dev/maps',
      search: 'https://google.serper.dev/search',
    };

    const targetUrl = validEndpoints[endpoint];
    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: `Invalid endpoint: "${endpoint}". Use "maps" or "search".` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[proxy-serper] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal proxy error.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
