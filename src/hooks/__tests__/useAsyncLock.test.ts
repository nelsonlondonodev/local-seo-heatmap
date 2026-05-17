import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAsyncLock } from '../useAsyncLock';

describe('useAsyncLock', () => {
  it('should start with isLoading false and isLocked current false', () => {
    const { result } = renderHook(() => useAsyncLock());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLocked.current).toBe(false);
  });

  it('should lock execution during an async operation and release it afterwards', async () => {
    const { result } = renderHook(() => useAsyncLock());
    
    let resolvePromise!: (value: string) => void;
    const asyncPromise = new Promise<string>((resolve) => {
      resolvePromise = resolve;
    });

    let executionResult: Promise<string | null>;

    act(() => {
      executionResult = result.current.execute(() => asyncPromise);
    });

    // During execution, it should be locked and loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isLocked.current).toBe(true);

    // Any concurrent trigger should be rejected immediately and return null
    let concurrentResult: string | null = "not_null";
    await act(async () => {
      concurrentResult = await result.current.execute(async () => "concurrent_should_not_run");
    });
    expect(concurrentResult).toBe(null);

    // Resolve the original promise
    await act(async () => {
      resolvePromise("success");
    });

    // Wait for the original call to resolve
    const finalVal = await executionResult!;
    expect(finalVal).toBe("success");

    // After resolution, it should be unlocked and not loading
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLocked.current).toBe(false);
  });

  it('should unlock and set isLoading false even if the callback throws an error', async () => {
    const { result } = renderHook(() => useAsyncLock());

    const failingCallback = () => Promise.reject(new Error('Async error'));

    let threwError = false;
    await act(async () => {
      try {
        await result.current.execute(failingCallback);
      } catch {
        threwError = true;
      }
    });

    expect(threwError).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLocked.current).toBe(false);
  });
});
