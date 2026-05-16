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
    // We create a valid-looking session object to satisfy TypeScript
    const mockSession = { 
      access_token: 'valid-jwt-token',
      user: { id: 'user-123' },
      expires_at: 0,
      expires_in: 0,
      token_type: 'bearer',
      refresh_token: 'refresh'
    } as unknown as Session;

    mockedGetSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    } as AuthSessionResponse);

    // 2. Mock successful function invocation
    mockedInvoke.mockResolvedValue({
      data: { success: true },
      error: null,
    } as FunctionResponse<Record<string, boolean>>);

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
    } as FunctionResponse<Record<string, boolean>>);

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
    // We use @ts-expect-error because Error doesn't natively have 'context'
    // but the Supabase FunctionError does. This is the correct way to handle this.
    mockError.context = new Response(JSON.stringify({ error: 'Créditos insuficientes' }), {
      status: 402,
      headers: { 'Content-Type': 'application/json' }
    });

    mockedInvoke.mockResolvedValue({
      data: null,
      error: mockError as unknown as FunctionResponse<unknown>['error'],
    } as unknown as FunctionResponse<unknown>);

    await expect(invokeEdgeFunction('proxy-serper', { query: 'test' }))
      .rejects.toThrow('Créditos insuficientes');
  });
});
