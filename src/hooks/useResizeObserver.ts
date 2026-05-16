import { useEffect, useRef, useState } from 'react';

interface Size {
  width: number;
  height: number;
}

/**
 * Hook to observe the size of an element using the native ResizeObserver API.
 * Extremely robust for syncing third-party libraries (like Leaflet) with layout changes.
 */
export function useResizeObserver<T extends HTMLElement>() {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, size };
}
