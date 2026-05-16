import { corsHeaders, handleCorsPreflightRequest, buildCorsHeaders } from '../_shared/cors.ts';
import { getAuthenticatedUser, unauthorizedResponse } from '../_shared/auth.ts';
import { validateUserCredits } from '../_shared/security.ts';

/**
 * Edge Function: proxy-openai
 * Proxies requests to OpenAI Chat Completions API with Security Hardening.
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

  // 2. SECURITY CHECK: OpenAI calls cost 2 credits (Base cost)
  const securityCheck = await validateUserCredits(user.id, 2);
  if (!securityCheck.success) {
    return new Response(
      JSON.stringify({ error: securityCheck.error, code: securityCheck.code }),
      { status: 429, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
    );
  }

  // 3. Read secret
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Server misconfiguration: Missing OPENAI_API_KEY.' }),
      { status: 500, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { messages, response_format } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload: "messages" array is required.' }),
        { status: 400, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Forward to OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        response_format: response_format || { type: 'json_object' },
      }),
    });

    const data = await openaiResponse.json();

    return new Response(JSON.stringify(data), {
      status: openaiResponse.status,
      headers: { ...dynamicCors, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[proxy-openai] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal proxy error.' }),
      { status: 500, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
    );
  }
});
