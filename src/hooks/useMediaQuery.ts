import { useState, useEffect } from 'react';

/**
 * Hook to detect media query matches.
 * Useful for responsive logic that cannot be handled by CSS alone.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

/**
 * Specifically detects if the screen is in mobile/tablet mode (below lg breakpoint).
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 1023px)');
}
