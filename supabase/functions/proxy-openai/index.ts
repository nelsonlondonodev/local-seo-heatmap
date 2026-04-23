import { corsHeaders, handleCorsPreflightRequest } from '../_shared/cors.ts';
import { getAuthenticatedUser, unauthorizedResponse } from '../_shared/auth.ts';

/**
 * Edge Function: proxy-openai
 * Proxies requests to OpenAI Chat Completions API.
 * Keeps the OPENAI_API_KEY secret on the server side.
 *
 * Expected body: { messages: ChatMessage[], response_format?: object }
 */
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  // 1. Authenticate
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return unauthorizedResponse(corsHeaders);
  }

  // 2. Read secret
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Server misconfiguration: Missing OPENAI_API_KEY secret.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 3. Parse incoming request
    const { messages, response_format } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload: "messages" array is required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[proxy-openai] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal proxy error.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
