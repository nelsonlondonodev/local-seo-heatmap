import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSEOSync } from '../useSEOSync';
import { useLocation } from 'react-router-dom';
import { SAAS_CONFIG } from '@/config/saas';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
}));

describe('useSEOSync Visibility & Canonical Audit', () => {
  let robotsMeta: HTMLMetaElement;
  const mockedUseLocation = vi.mocked(useLocation);

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup virtual DOM elements
    document.head.innerHTML = '';
    robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    document.head.appendChild(robotsMeta);
  });

  it('should set index, follow for public landing page', () => {
    mockedUseLocation.mockReturnValue({ pathname: '/' } as any);
    
    renderHook(() => useSEOSync());

    expect(robotsMeta.getAttribute('content')).toBe('index, follow');
    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe(SAAS_CONFIG.SEO.BASE_URL);
  });

  it('should set noindex, nofollow for PROTECTED dashboard routes', () => {
    mockedUseLocation.mockReturnValue({ pathname: '/dashboard/heatmap' } as any);
    
    renderHook(() => useSEOSync());

    expect(robotsMeta.getAttribute('content')).toBe('noindex, nofollow');
    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe(`${SAAS_CONFIG.SEO.BASE_URL}/dashboard/heatmap`);
  });

  it('should set noindex, nofollow for NESTED admin routes (Inheritance check)', () => {
    mockedUseLocation.mockReturnValue({ pathname: '/admin/users/settings' } as any);
    
    renderHook(() => useSEOSync());

    expect(robotsMeta.getAttribute('content')).toBe('noindex, nofollow');
  });

  it('should handle sub-paths correctly', () => {
    mockedUseLocation.mockReturnValue({ pathname: '/settings/billing' } as any);
    
    renderHook(() => useSEOSync());

    expect(robotsMeta.getAttribute('content')).toBe('noindex, nofollow');
  });
});
