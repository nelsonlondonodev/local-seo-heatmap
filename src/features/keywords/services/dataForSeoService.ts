import { logger } from '@/lib/logger';

const AUTH_USER = import.meta.env.VITE_DATAFORSEO_LOGIN;
const AUTH_PASS = import.meta.env.VITE_DATAFORSEO_PASSWORD;
const BASE_URL = 'https://api.dataforseo.com/v3';

/**
 * Encodes credentials for Basic Auth.
 */
const getAuthHeader = () => {
  if (!AUTH_USER || !AUTH_PASS) return '';
  return `Basic ${btoa(`${AUTH_USER}:${AUTH_PASS}`)}`;
};

/**
 * Service to interact with DataForSEO APIs.
 */
export const dataForSeoService = {
  /**
   * Fetches keyword suggestions based on a seed keyword.
   */
  async getKeywordSuggestions(keyword: string, locationCode = 2840, languageCode = 'es') {
    if (!AUTH_USER || !AUTH_PASS) {
      logger.warn('[DATAFORSEO] No credentials found. Returning mock data.');
      return this._getMockSuggestions(keyword);
    }

    try {
      const response = await fetch(`${BASE_URL}/keywords_data/google/keyword_ideas/live`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          keywords: [keyword],
          location_code: locationCode,
          language_code: languageCode,
          include_seed_keyword: true,
          limit: 20
        }])
      });

      if (!response.ok) {
        throw new Error(`DataForSEO API error (HTTP ${response.status})`);
      }

      const data = await response.json();
      return data.tasks?.[0]?.result || [];
    } catch (error) {
      logger.error('[DATAFORSEO] Error fetching suggestions:', error);
      throw error;
    }
  },

  /**
   * Fetches the top 100 organic search results for a keyword.
   */
  async getSerpResults(keyword: string, locationCode = 2840, languageCode = 'es') {
    if (!AUTH_USER || !AUTH_PASS) {
      logger.warn('[DATAFORSEO] No credentials found. Returning mock data.');
      return [];
    }

    try {
      const response = await fetch(`${BASE_URL}/serp/google/organic/live/regular`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          keyword,
          location_code: locationCode,
          language_code: languageCode,
          device: 'desktop',
          os: 'windows',
          depth: 100
        }])
      });

      if (!response.ok) {
        throw new Error(`DataForSEO SERP error (HTTP ${response.status})`);
      }

      const data = await response.json();
      return data.tasks?.[0]?.result?.[0]?.items || [];
    } catch (error) {
      logger.error('[DATAFORSEO] Error fetching SERP:', error);
      throw error;
    }
  },

  /**
   * Fetches locations for a specific country code (e.g., 'co', 'es').
   */
  async getLocationsByCountry(countryIsoCode: string) {
    if (!AUTH_USER || !AUTH_PASS) return [];

    try {
      const response = await fetch(`${BASE_URL}/keywords_data/google/locations/${countryIsoCode}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`DataForSEO locations error (HTTP ${response.status})`);
      }

      const data = await response.json();
      return data.tasks?.[0]?.result || [];
    } catch (error) {
      logger.error('[DATAFORSEO] Error fetching locations:', error);
      return [];
    }
  },

  /**
   * Mock data for development when API keys are missing.
   */
  _getMockSuggestions(seed: string) {
    return [
      { keyword: seed, search_volume: 1200, competition_level: 'HIGH', cpc: 2.5 },
      { keyword: `${seed} barato`, search_volume: 450, competition_level: 'LOW', cpc: 1.2 },
      { keyword: `${seed} profesional`, search_volume: 890, competition_level: 'MEDIUM', cpc: 3.8 },
      { keyword: `mejor ${seed}`, search_volume: 2100, competition_level: 'HIGH', cpc: 4.1 },
      { keyword: `${seed} cerca de mi`, search_volume: 5400, competition_level: 'MEDIUM', cpc: 1.5 },
    ];
  }
};
