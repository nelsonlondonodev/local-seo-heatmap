import { useRef, useState, useCallback } from 'react';

/**
 * Custom hook to manage key-level concurrent locking.
 * Allows concurrent execution for different keys, but blocks concurrent
 * executions for the exact same key synchronously.
 */
export function useKeyedAsyncLock() {
  const activeKeys = useRef<Record<string, boolean>>({});
  const [, forceUpdate] = useState({});

  const executeKeyed = useCallback(async <T>(key: string, asyncCallback: () => Promise<T>): Promise<T | null> => {
    if (activeKeys.current[key]) {
      console.warn(`[useKeyedAsyncLock] Key "${key}" is currently locked.`);
      return null;
    }

    activeKeys.current[key] = true;
    forceUpdate({}); // Force React update to synchronize UI state

    try {
      return await asyncCallback();
    } finally {
      activeKeys.current[key] = false;
      forceUpdate({}); // Clear UI lock state
    }
  }, []);

  const isKeyLocked = useCallback((key: string): boolean => {
    return !!activeKeys.current[key];
  }, []);

  return {
    executeKeyed,
    isKeyLocked
  };
}
