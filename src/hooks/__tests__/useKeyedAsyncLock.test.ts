import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyedAsyncLock } from '../useKeyedAsyncLock';

describe('useKeyedAsyncLock', () => {
  it('should lock specifically per key, allowing concurrent execution for different keys', async () => {
    const { result } = renderHook(() => useKeyedAsyncLock());

    expect(result.current.isKeyLocked('key1')).toBe(false);
    expect(result.current.isKeyLocked('key2')).toBe(false);

    let resolveKey1!: (value: string) => void;
    const promiseKey1 = new Promise<string>((resolve) => {
      resolveKey1 = resolve;
    });

    let executionKey1: Promise<string | null>;

    act(() => {
      executionKey1 = result.current.executeKeyed('key1', () => promiseKey1);
    });

    // Key1 should be locked, but Key2 should be free
    expect(result.current.isKeyLocked('key1')).toBe(true);
    expect(result.current.isKeyLocked('key2')).toBe(false);

    // Concurrent trigger on Key1 should fail immediately and return null
    let concurrentKey1Result: string | null = "not_null";
    await act(async () => {
      concurrentKey1Result = await result.current.executeKeyed('key1', async () => "failed");
    });
    expect(concurrentKey1Result).toBe(null);

    // Key2 can run in parallel without interference
    let executionKey2: Promise<string | null>;
    act(() => {
      executionKey2 = result.current.executeKeyed('key2', async () => "success_key2");
    });

    const finalKey2 = await executionKey2!;
    expect(finalKey2).toBe("success_key2");

    // Resolve Key1
    await act(async () => {
      resolveKey1("success_key1");
    });

    const finalKey1 = await executionKey1!;
    expect(finalKey1).toBe("success_key1");

    // Both should be unlocked now
    expect(result.current.isKeyLocked('key1')).toBe(false);
    expect(result.current.isKeyLocked('key2')).toBe(false);
  });

  it('should unlock the key even if the operation throws an error', async () => {
    const { result } = renderHook(() => useKeyedAsyncLock());

    expect(result.current.isKeyLocked('key1')).toBe(false);

    let threwError = false;
    await act(async () => {
      try {
        await result.current.executeKeyed('key1', () => Promise.reject(new Error('error')));
      } catch {
        threwError = true;
      }
    });

    expect(threwError).toBe(true);
    expect(result.current.isKeyLocked('key1')).toBe(false);
  });
});
