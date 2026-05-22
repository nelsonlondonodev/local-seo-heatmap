import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isSpanishBrowser,
  getDefaultCountryCode,
  getDefaultLocationCode,
  getGeoPlaceholders
} from './geoUtils';

describe('geoUtils', () => {
  let languageGetter: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Interceptamos navigator.language de manera limpia y tipada sin modificar el objeto global directamente
    languageGetter = vi.spyOn(window.navigator, 'language', 'get');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isSpanishBrowser', () => {
    it('should return true when browser language starts with es', () => {
      languageGetter.mockReturnValue('es-ES');
      expect(isSpanishBrowser()).toBe(true);
    });

    it('should return true when browser language starts with es (case insensitive)', () => {
      languageGetter.mockReturnValue('ES-mx');
      expect(isSpanishBrowser()).toBe(true);
    });

    it('should return false when browser language does not start with es', () => {
      languageGetter.mockReturnValue('en-US');
      expect(isSpanishBrowser()).toBe(false);
    });

    it('should return false when browser language is empty', () => {
      languageGetter.mockReturnValue('');
      expect(isSpanishBrowser()).toBe(false);
    });
  });

  describe('getDefaultCountryCode', () => {
    it('should return "es" for Spanish browser', () => {
      languageGetter.mockReturnValue('es');
      expect(getDefaultCountryCode()).toBe('es');
    });

    it('should return "us" for non-Spanish browser', () => {
      languageGetter.mockReturnValue('en');
      expect(getDefaultCountryCode()).toBe('us');
    });
  });

  describe('getDefaultLocationCode', () => {
    it('should return 2724 for Spanish browser', () => {
      languageGetter.mockReturnValue('es-AR');
      expect(getDefaultLocationCode()).toBe(2724);
    });

    it('should return 2840 for non-Spanish browser', () => {
      languageGetter.mockReturnValue('fr-FR');
      expect(getDefaultLocationCode()).toBe(2840);
    });
  });

  describe('getGeoPlaceholders', () => {
    it('should return Spanish placeholders when browser language is Spanish', () => {
      languageGetter.mockReturnValue('es');
      const placeholders = getGeoPlaceholders();
      expect(placeholders.city).toBe('Madrid');
      expect(placeholders.domain).toContain('tudominio.es');
      expect(placeholders.project).toBe('Peluquería Gran Vía');
      expect(placeholders.addressCity).toBe('Madrid, España');
    });

    it('should return US placeholders when browser language is not Spanish', () => {
      languageGetter.mockReturnValue('de');
      const placeholders = getGeoPlaceholders();
      expect(placeholders.city).toBe('New York');
      expect(placeholders.domain).toContain('yourdomain.com');
      expect(placeholders.project).toBe('Central Park Barber Shop');
      expect(placeholders.addressCity).toBe('New York, NY, USA');
    });
  });
});
