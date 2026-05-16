import { describe, it, expect, vi, beforeEach } from 'vitest';
import { invokeEdgeFunction } from '../edgeFunctions';
import { supabase } from '../supabase';

// Mock Supabase client
vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
    functions: {
      invoke: vi.fn(),
    },
  },
}));

describe('invokeEdgeFunction Security & Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { access_token: 'fake-token' } },
    });
  });

  it('should propagate a specific error message from a JSON response body', async () => {
    // Simulate a 429 Rate Limit error from the Edge Function
    const mockErrorResponse = new Response(
      JSON.stringify({ error: 'Créditos insuficientes' }),
      { status: 429, headers: { 'content-type': 'application/json' } }
    );

    (supabase.functions.invoke as any).mockResolvedValue({
      data: null,
      error: {
        message: 'Rate limit exceeded',
        context: mockErrorResponse,
      },
    });

    await expect(invokeEdgeFunction('test-func', {}))
      .rejects.toThrow('Créditos insuficientes');
  });

  it('should use a default error message if JSON is invalid or missing error field', async () => {
    const mockErrorResponse = new Response(
      'Server Error',
      { status: 500 }
    );

    (supabase.functions.invoke as any).mockResolvedValue({
      data: null,
      error: {
        message: 'Original Error',
        context: mockErrorResponse,
      },
    });

    await expect(invokeEdgeFunction('test-func', {}))
      .rejects.toThrow('Original Error');
  });

  it('should include the function name in the error if no message is available', async () => {
    (supabase.functions.invoke as any).mockResolvedValue({
      data: null,
      error: {
        message: '',
        context: null,
      },
    });

    await expect(invokeEdgeFunction('secure-scan', {}))
      .rejects.toThrow('Error en la función: secure-scan');
  });
});
