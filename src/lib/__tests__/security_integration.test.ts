import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../supabase';
import { invokeEdgeFunction } from '../edgeFunctions';

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

// Infer real return types from the mocked methods
type GetSessionReturn = Awaited<ReturnType<typeof supabase.auth.getSession>>;
type InvokeReturn = Awaited<ReturnType<typeof supabase.functions.invoke>>;

describe('Security Infrastructure: JWT Injection Audit', () => {
  const mockedGetSession = vi.mocked(supabase.auth.getSession);
  const mockedInvoke = vi.mocked(supabase.functions.invoke);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should explicitly inject JWT Bearer token when session exists', async () => {
    mockedGetSession.mockResolvedValue({
      data: { session: { access_token: 'valid-jwt-token' } },
      error: null,
    } as unknown as GetSessionReturn);

    mockedInvoke.mockResolvedValue({
      data: { success: true },
      error: null,
    } as unknown as InvokeReturn);

    await invokeEdgeFunction('proxy-serper', { query: 'test' });

    const lastCall = mockedInvoke.mock.calls[0];
    const options = lastCall[1];
    expect(options?.headers?.Authorization).toBe('Bearer valid-jwt-token');
  });

  it('should handle missing session gracefully without crashing', async () => {
    mockedGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    } as unknown as GetSessionReturn);

    mockedInvoke.mockResolvedValue({
      data: { success: true },
      error: null,
    } as unknown as InvokeReturn);

    await invokeEdgeFunction('proxy-serper', { query: 'test' });

    const lastCall = mockedInvoke.mock.calls[0];
    const options = lastCall[1];
    expect(options?.headers?.Authorization).toBeUndefined();
  });

  it('should bubble up 402/429 errors from server-side JSON', async () => {
    mockedGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    } as unknown as GetSessionReturn);

    const mockError = new Error('Initial error');
    Object.assign(mockError, {
      context: new Response(JSON.stringify({ error: 'Créditos insuficientes' }), {
        status: 402,
        headers: { 'Content-Type': 'application/json' },
      }),
    });

    mockedInvoke.mockResolvedValue({
      data: null,
      error: mockError,
    } as unknown as InvokeReturn);

    await expect(invokeEdgeFunction('proxy-serper', { query: 'test' }))
      .rejects.toThrow('Créditos insuficientes');
  });
});
