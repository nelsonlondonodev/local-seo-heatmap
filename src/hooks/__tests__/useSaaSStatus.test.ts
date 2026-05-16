import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSaaSStatus } from '../useSaaSStatus';
import { useAuth } from '@/features/auth';
import type { AuthContextType, UserProfile } from '@/features/auth/types';
import type { User } from '@supabase/supabase-js';

// Mock useAuth
vi.mock('@/features/auth', () => ({
  useAuth: vi.fn(),
}));

describe('useSaaSStatus Logic Audit', () => {
  const mockedUseAuth = vi.mocked(useAuth);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockProfile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
    id: 'user-123',
    email: 'test@example.com',
    full_name: 'Test User',
    avatar_url: null,
    role: 'owner',
    agency_id: 'agency-123',
    plan: 'pro',
    credits: 0,
    ...overrides,
  });

  const createMockAuthContext = (overrides: Partial<AuthContextType> = {}): AuthContextType => ({
    user: { id: 'user-123' } as User,
    profile: createMockProfile(),
    session: null,
    isLoading: false,
    role: 'owner',
    agencyId: 'agency-123',
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    signInWithGoogle: vi.fn(),
    ...overrides,
  });

  it('should return correct status for a user with sufficient credits', () => {
    mockedUseAuth.mockReturnValue(createMockAuthContext({
      profile: createMockProfile({ credits: 50 })
    }));

    const { result } = renderHook(() => useSaaSStatus());

    expect(result.current.credits).toBe(50);
    expect(result.current.formattedCredits).toBe('50');
    expect(result.current.canAfford(10)).toBe(true);
    expect(result.current.canAfford(50)).toBe(true);
  });

  it('should return correct status for a user with INSUFFICIENT credits', () => {
    mockedUseAuth.mockReturnValue(createMockAuthContext({
      profile: createMockProfile({ credits: 5 })
    }));

    const { result } = renderHook(() => useSaaSStatus());

    expect(result.current.canAfford(10)).toBe(false);
    expect(result.current.canAfford(6)).toBe(false);
  });

  it('should handle missing profile gracefully (0 credits)', () => {
    mockedUseAuth.mockReturnValue(createMockAuthContext({
      profile: null,
      role: null,
      agencyId: null
    }));

    const { result } = renderHook(() => useSaaSStatus());

    expect(result.current.credits).toBe(0);
    expect(result.current.canAfford(1)).toBe(false);
  });

  it('should format large credit numbers correctly', () => {
    mockedUseAuth.mockReturnValue(createMockAuthContext({
      profile: createMockProfile({ credits: 1500 })
    }));

    const { result } = renderHook(() => useSaaSStatus());
    expect(result.current.formattedCredits).toMatch(/1.500|1,500/);
  });

  it('should return false for canAfford when credits are ZERO', () => {
    mockedUseAuth.mockReturnValue(createMockAuthContext({
      profile: createMockProfile({ credits: 0 })
    }));

    const { result } = renderHook(() => useSaaSStatus());
    expect(result.current.canAfford(1)).toBe(false);
    expect(result.current.canAfford(0)).toBe(true);
  });

  it('should access SAAS_CONFIG costs correctly through the hook', () => {
    mockedUseAuth.mockReturnValue(createMockAuthContext({
      profile: createMockProfile({ credits: 10 })
    }));

    const { result } = renderHook(() => useSaaSStatus());
    expect(result.current.config.COSTS.SCAN).toBe(1);
    expect(result.current.config.COSTS.AI_AUDIT).toBe(2);
  });
});
