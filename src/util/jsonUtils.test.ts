import { describe, it, expect, vi } from 'vitest';
import { safeJsonParse } from './jsonUtils';

describe('jsonUtils - safeJsonParse', () => {
  // Silence console.error for clean test output
  vi.spyOn(console, 'error').mockImplementation(() => {});

  const fallback = { content: 'default fallback' };

  it('should parse valid JSON correctly', () => {
    const validJson = '{"content": "success data", "usedKeywords": ["seo"]}';
    const result = safeJsonParse(validJson, fallback);
    expect(result).toEqual({ content: 'success data', usedKeywords: ['seo'] });
  });

  it('should return fallback when input is null or undefined', () => {
    expect(safeJsonParse(null, fallback)).toBe(fallback);
    expect(safeJsonParse(undefined, fallback)).toBe(fallback);
    expect(safeJsonParse('', fallback)).toBe(fallback);
  });

  it('should return fallback when JSON is malformed (invalid syntax)', () => {
    const invalidJson = '{"content": "missing quote}';
    expect(safeJsonParse(invalidJson, fallback)).toBe(fallback);
  });

  it('should return fallback when parsed result is null', () => {
    const nullJson = 'null';
    expect(safeJsonParse(nullJson, fallback)).toBe(fallback);
  });

  it('should return fallback when parsed result is a primitive (not an object)', () => {
    const stringJson = '"just a string"';
    const numberJson = '42';
    
    expect(safeJsonParse(stringJson, fallback)).toBe(fallback);
    expect(safeJsonParse(numberJson, fallback)).toBe(fallback);
  });
  
  it('should successfully parse an array', () => {
    const arrayJson = '["apple", "banana"]';
    const arrayFallback: string[] = [];
    
    expect(safeJsonParse(arrayJson, arrayFallback)).toEqual(['apple', 'banana']);
  });
});
