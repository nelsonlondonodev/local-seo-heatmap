import { corsHeaders, handleCorsPreflightRequest } from '../_shared/cors.ts';
import { getAuthenticatedUser, unauthorizedResponse } from '../_shared/auth.ts';

/**
 * Edge Function: proxy-places
 * Proxies requests to Google Places API (New v1).
 * Keeps the GOOGLE_MAPS_API_KEY secret on the server side.
 *
 * Expected body: { textQuery: string, maxResultCount?: number }
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
  const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Server misconfiguration: Missing GOOGLE_MAPS_API_KEY secret.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 3. Parse incoming request
    const { textQuery, maxResultCount } = await req.json();

    if (!textQuery || typeof textQuery !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid payload: "textQuery" string is required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Forward to Google Places API
    const googleResponse = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount',
      },
      body: JSON.stringify({
        textQuery,
        maxResultCount: maxResultCount || 5,
      }),
    });

    const data = await googleResponse.json();

    return new Response(JSON.stringify(data), {
      status: googleResponse.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[proxy-places] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal proxy error.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
