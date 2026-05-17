import { useRef, useState, useCallback } from 'react';

/**
 * Custom hook to encapsulate synchronous lock guards and loading states
 * for expensive asynchronous operations.
 */
export function useAsyncLock() {
  const [isLoading, setIsLoading] = useState(false);
  const isLocked = useRef(false);

  const execute = useCallback(async <T>(asyncCallback: () => Promise<T>): Promise<T | null> => {
    if (isLocked.current) {
      console.warn('[useAsyncLock] Action blocked due to concurrent execution.');
      return null;
    }

    isLocked.current = true;
    setIsLoading(true);

    try {
      return await asyncCallback();
    } finally {
      setIsLoading(false);
      isLocked.current = false;
    }
  }, []);

  return {
    execute,
    isLoading,
    isLocked: isLocked as { readonly current: boolean }
  };
}
