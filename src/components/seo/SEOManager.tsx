import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEOManager
 * Dynamically handles robots meta tags and canonical URLs based on the current route.
 * Ensures the landing page is indexed while keeping the dashboard private.
 */
export function SEOManager() {
  const location = useLocation();

  useEffect(() => {
    // 1. Manage Robots Meta Tag
    const robotsMeta = document.querySelector('meta[name="robots"]');
    
    // Protected or Functional routes that should NOT be indexed
    const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                            location.pathname.startsWith('/admin') ||
                            location.pathname.startsWith('/settings') ||
                            location.pathname.startsWith('/auth');

    if (isDashboardRoute) {
      robotsMeta?.setAttribute('content', 'noindex, nofollow');
    } else {
      robotsMeta?.setAttribute('content', 'index, follow');
    }

    // 2. Manage Canonical Tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }

    const baseUrl = 'https://mapranker.pro';
    const currentPath = location.pathname === '/' ? '' : location.pathname;
    canonical.setAttribute('href', `${baseUrl}${currentPath}`);

  }, [location]);

  return null; // This component doesn't render anything
}
