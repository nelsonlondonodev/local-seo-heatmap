import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSaaSStatus } from '../useSaaSStatus';
import { useAuth } from '@/features/auth';

// Mock useAuth
vi.mock('@/features/auth', () => ({
  useAuth: vi.fn(),
}));

describe('useSaaSStatus Logic Audit', () => {
  const mockedUseAuth = vi.mocked(useAuth);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseMockAuth = {
    role: 'user',
    isLoading: false,
    signOut: vi.fn(),
    agencyId: null,
  };

  it('should return correct status for a user with sufficient credits', () => {
    mockedUseAuth.mockReturnValue({
      ...baseMockAuth,
      profile: { credits: 50 },
      user: { id: 'user-1' },
    } as any);

    const { result } = renderHook(() => useSaaSStatus());

    expect(result.current.credits).toBe(50);
    expect(result.current.formattedCredits).toBe('50');
    expect(result.current.canAfford(10)).toBe(true);
    expect(result.current.canAfford(50)).toBe(true);
  });

  it('should return correct status for a user with INSUFFICIENT credits', () => {
    mockedUseAuth.mockReturnValue({
      ...baseMockAuth,
      profile: { credits: 5 },
      user: { id: 'user-2' },
    } as any);

    const { result } = renderHook(() => useSaaSStatus());

    expect(result.current.canAfford(10)).toBe(false);
    expect(result.current.canAfford(6)).toBe(false);
  });

  it('should handle missing profile gracefully (0 credits)', () => {
    mockedUseAuth.mockReturnValue({
      ...baseMockAuth,
      profile: null,
      user: { id: 'user-3' },
    } as any);

    const { result } = renderHook(() => useSaaSStatus());

    expect(result.current.credits).toBe(0);
    expect(result.current.canAfford(1)).toBe(false);
  });

  it('should format large credit numbers correctly', () => {
    mockedUseAuth.mockReturnValue({
      ...baseMockAuth,
      profile: { credits: 1500 },
      user: { id: 'user-4' },
    } as any);

    const { result } = renderHook(() => useSaaSStatus());
    expect(result.current.formattedCredits).toMatch(/1.500|1,500/);
  });

  it('should return false for canAfford when credits are ZERO', () => {
    mockedUseAuth.mockReturnValue({
      ...baseMockAuth,
      profile: { credits: 0 },
      user: { id: 'user-5' }
    } as any);

    const { result } = renderHook(() => useSaaSStatus());
    expect(result.current.canAfford(1)).toBe(false);
    expect(result.current.canAfford(0)).toBe(true);
  });

  it('should access SAAS_CONFIG costs correctly through the hook', () => {
    mockedUseAuth.mockReturnValue({
      ...baseMockAuth,
      profile: { credits: 10 },
      user: { id: 'user-6' }
    } as any);

    const { result } = renderHook(() => useSaaSStatus());
    expect(result.current.config.COSTS.SCAN).toBe(1);
    expect(result.current.config.COSTS.AI_AUDIT).toBe(2);
  });
});
