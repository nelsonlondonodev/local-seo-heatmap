import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SAAS_CONFIG } from '@/config/saas';

/**
 * Hook to dynamically synchronize SEO metadata (Robots & Canonical) with the current route.
 */
export function useSEOSync() {
  const location = useLocation();

  useEffect(() => {
    // 1. Robots Management
    const robotsMeta = document.querySelector('meta[name="robots"]');
    const isProtected = SAAS_CONFIG.SEO.PROTECTED_PATHS.some(path => 
      location.pathname.startsWith(path)
    );

    if (isProtected) {
      robotsMeta?.setAttribute('content', 'noindex, nofollow');
    } else {
      robotsMeta?.setAttribute('content', 'index, follow');
    }

    // 2. Canonical Management
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }

    const currentPath = location.pathname === '/' ? '' : location.pathname;
    canonical.setAttribute('href', `${SAAS_CONFIG.SEO.BASE_URL}${currentPath}`);

  }, [location]);
}
