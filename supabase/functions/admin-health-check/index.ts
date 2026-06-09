import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { corsHeaders, handleCorsPreflightRequest, buildCorsHeaders } from '../_shared/cors.ts';
import { getAuthenticatedUser, unauthorizedResponse } from '../_shared/auth.ts';

interface SingleHealthCheck {
  status: 'ok' | 'error';
  latencyMs: number;
  message: string;
  balance?: number;
}

interface HealthCheckResult {
  serper: SingleHealthCheck;
  dataforseo: SingleHealthCheck;
  openai: SingleHealthCheck;
  google: SingleHealthCheck;
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

  // 1. Authenticate user JWT
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return unauthorizedResponse(dynamicCors);
  }

  // 2. Authorize user by checking if they are super-admin or admin
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ error: 'Server misconfiguration: Missing internal credentials.' }),
      { status: 500, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || (profile.role !== 'super-admin' && profile.role !== 'admin')) {
    return new Response(
      JSON.stringify({ error: 'Acceso denegado: Se requieren privilegios de administrador.' }),
      { status: 403, headers: { ...dynamicCors, 'Content-Type': 'application/json' } }
    );
  }

  // 3. Define the health check promises
  const checkSerper = async (): Promise<SingleHealthCheck> => {
    const start = Date.now();
    const apiKey = Deno.env.get('SERPER_API_KEY');
    if (!apiKey) {
      return { status: 'error', latencyMs: 0, message: 'Falta configurar SERPER_API_KEY.' };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: 'ping', num: 1 }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const latencyMs = Date.now() - start;
      if (res.status === 200) {
        return { status: 'ok', latencyMs, message: 'Conectado' };
      }
      return { status: 'error', latencyMs, message: `Error HTTP ${res.status}` };
    } catch (err) {
      const latencyMs = Date.now() - start;
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      return { status: 'error', latencyMs, message: `Fallo de conexión: ${msg}` };
    }
  };

  const checkDataForSeo = async (): Promise<SingleHealthCheck> => {
    const start = Date.now();
    const login = Deno.env.get('DATAFORSEO_LOGIN');
    const password = Deno.env.get('DATAFORSEO_PASSWORD');
    if (!login || !password) {
      return { status: 'error', latencyMs: 0, message: 'Faltan credenciales de DataForSEO.' };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const authHeader = `Basic ${btoa(`${login}:${password}`)}`;
      const res = await fetch('https://api.dataforseo.com/v3/user', {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const latencyMs = Date.now() - start;
      if (res.status === 200) {
        const data = await res.json();
        // Check for DataForSEO-specific successful status code
        if (data.status_code === 20000 && data.tasks?.[0]?.result?.[0]) {
          const result = data.tasks[0].result[0];
          const balance = result.money ?? 0;
          return {
            status: 'ok',
            latencyMs,
            message: 'Conectado',
            balance,
          };
        }
        return { status: 'error', latencyMs, message: 'Respuesta inesperada de la API.' };
      }
      return { status: 'error', latencyMs, message: `Error HTTP ${res.status}` };
    } catch (err) {
      const latencyMs = Date.now() - start;
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      return { status: 'error', latencyMs, message: `Fallo de conexión: ${msg}` };
    }
  };

  const checkOpenAi = async (): Promise<SingleHealthCheck> => {
    const start = Date.now();
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      return { status: 'error', latencyMs: 0, message: 'Falta configurar OPENAI_API_KEY.' };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const latencyMs = Date.now() - start;
      if (res.status === 200) {
        return { status: 'ok', latencyMs, message: 'Conectado' };
      }
      return { status: 'error', latencyMs, message: `Error HTTP ${res.status}` };
    } catch (err) {
      const latencyMs = Date.now() - start;
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      return { status: 'error', latencyMs, message: `Fallo de conexión: ${msg}` };
    }
  };

  const checkGoogle = async (): Promise<SingleHealthCheck> => {
    const start = Date.now();
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!apiKey) {
      return { status: 'error', latencyMs: 0, message: 'Falta configurar GOOGLE_MAPS_API_KEY.' };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      // Call Geocoding API with a lightweight address query to test the API key
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=Googleplex&key=${apiKey}`,
        {
          method: 'GET',
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      const latencyMs = Date.now() - start;
      if (res.status === 200) {
        const data = await res.json();
        // Even if results are empty or denied, a status 200 with data shows API connectivity.
        // If it returns a specific API key error inside the payload, we handle it as error.
        if (data.status === 'REQUEST_DENIED') {
          return { status: 'error', latencyMs, message: `Google API Error: ${data.error_message || 'Acceso denegado'}` };
        }
        return { status: 'ok', latencyMs, message: 'Conectado' };
      }
      return { status: 'error', latencyMs, message: `Error HTTP ${res.status}` };
    } catch (err) {
      const latencyMs = Date.now() - start;
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      return { status: 'error', latencyMs, message: `Fallo de conexión: ${msg}` };
    }
  };

  // 4. Run all health checks concurrently
  const [serper, dataforseo, openai, google] = await Promise.all([
    checkSerper(),
    checkDataForSeo(),
    checkOpenAi(),
    checkGoogle(),
  ]);

  const result: HealthCheckResult = {
    serper,
    dataforseo,
    openai,
    google,
  };

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { ...dynamicCors, 'Content-Type': 'application/json' },
  });
});
