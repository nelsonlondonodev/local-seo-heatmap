import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../supabase';
import { invokeEdgeFunction } from '../edgeFunctions';
import type { AuthSessionResponse, FunctionResponse, Session } from '@supabase/supabase-js';

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

describe('Security Infrastructure: JWT Injection Audit', () => {
  const mockedGetSession = vi.mocked(supabase.auth.getSession);
  const mockedInvoke = vi.mocked(supabase.functions.invoke);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should explicitly inject JWT Bearer token when session exists', async () => {
    // 1. Mock active session
    mockedGetSession.mockResolvedValue({
      data: { session: { access_token: 'valid-jwt-token' } as Session },
      error: null,
    } as AuthSessionResponse);

    // 2. Mock successful function invocation
    mockedInvoke.mockResolvedValue({
      data: { success: true },
      error: null,
    } as FunctionResponse<unknown>);

    await invokeEdgeFunction('proxy-serper', { query: 'test' });

    // 3. Verify header injection
    const lastCall = mockedInvoke.mock.calls[0];
    const options = lastCall[1];
    
    expect(options?.headers?.Authorization).toBe('Bearer valid-jwt-token');
  });

  it('should handle missing session gracefully without crashing', async () => {
    mockedGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    } as AuthSessionResponse);

    mockedInvoke.mockResolvedValue({
      data: { success: true },
      error: null,
    } as FunctionResponse<unknown>);

    await invokeEdgeFunction('proxy-serper', { query: 'test' });

    const lastCall = mockedInvoke.mock.calls[0];
    const options = lastCall[1];
    
    expect(options?.headers?.Authorization).toBeUndefined();
  });

  it('should bubble up 402/429 errors from server-side JSON', async () => {
    mockedGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    } as AuthSessionResponse);

    // Mock a response that looks like a fetch error context
    const mockError = new Error('Initial error');
    // @ts-expect-error - Mocking Supabase function error context
    mockError.context = new Response(JSON.stringify({ error: 'Créditos insuficientes' }), {
      status: 402,
      headers: { 'Content-Type': 'application/json' }
    });

    mockedInvoke.mockResolvedValue({
      data: null,
      error: mockError,
    } as FunctionResponse<unknown>);

    await expect(invokeEdgeFunction('proxy-serper', { query: 'test' }))
      .rejects.toThrow('Créditos insuficientes');
  });
});
