import { describe, it, expect } from 'vitest';
import { normalizeText, isBusinessMatch, isAdvertiser, cleanBusinessName } from './textUtils';

describe('textUtils', () => {
  describe('normalizeText', () => {
    it('should lowercase and remove accents', () => {
      expect(normalizeText('Mèlange')).toBe('melange');
      expect(normalizeText('Bogotá')).toBe('bogota');
    });

    it('should trim whitespace', () => {
      expect(normalizeText('  Trim Me  ')).toBe('trim me');
    });
  });

  describe('isBusinessMatch', () => {
    it('should match identical names', () => {
      expect(isBusinessMatch('My Shop', 'My Shop')).toBe(true);
    });

    it('should match case insensitive and accent insensitive', () => {
      expect(isBusinessMatch('Mélange', 'melange')).toBe(true);
    });

    it('should match partial names', () => {
      expect(isBusinessMatch('Starbucks', 'Starbucks Coffee')).toBe(true);
      expect(isBusinessMatch('Starbucks Coffee', 'Starbucks')).toBe(true);
    });
  });

  describe('isAdvertiser', () => {
    it('should return false if no advertisers', () => {
      expect(isAdvertiser('My Shop', [])).toBe(false);
    });

    it('should match business in advertiser list', () => {
      expect(isAdvertiser('My Shop', ['Other', 'MY SHOP INC'])).toBe(true);
    });
  });

  describe('cleanBusinessName', () => {
    it('should remove separators', () => {
      expect(cleanBusinessName('Malanga | Medellín')).toBe('Malanga');
      expect(cleanBusinessName('Shop - City Branch')).toBe('Shop');
    });

    it('should remove SEO suffixes like .mde', () => {
      expect(cleanBusinessName('Malanga.mde')).toBe('Malanga');
    });

    it('should remove location words at the end', () => {
      expect(cleanBusinessName('Pizza Medellín')).toBe('Pizza');
      expect(cleanBusinessName('Barba Bogota')).toBe('Barba');
    });
  });
});
