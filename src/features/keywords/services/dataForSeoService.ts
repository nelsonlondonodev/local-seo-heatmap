import { logger } from '@/lib/logger';
import type { 
  KeywordSuggestion, 
  DataForSeoResponse, 
  SerpResult, 
  SerpItem,
  DataForSeoLocation 
} from '../types/dataForSeo';

const AUTH_USER = import.meta.env.VITE_DATAFORSEO_LOGIN;
const AUTH_PASS = import.meta.env.VITE_DATAFORSEO_PASSWORD;
const BASE_URL = 'https://api.dataforseo.com/v3';

// Threshold for location codes that usually represent specific cities/narrow areas
const CITY_LOCATION_THRESHOLD = 3000;

/**
 * Encodes credentials for Basic Auth.
 */
const getAuthHeader = () => {
  if (!AUTH_USER || !AUTH_PASS) return '';
  return `Basic ${btoa(`${AUTH_USER}:${AUTH_PASS}`)}`;
};

/**
 * Generic helper for DataForSEO API requests.
 */
async function fetchDataForSeo<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  if (!AUTH_USER || !AUTH_PASS) {
    logger.warn(`[DATAFORSEO] No credentials for ${endpoint}`);
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
        ...options.headers,
      }
    });

    if (!response.ok) {
      throw new Error(`DataForSEO API error (${endpoint}): ${response.status}`);
    }

    return await response.json() as T;
  } catch (error) {
    logger.error(`[DATAFORSEO] Request failed (${endpoint}):`, error);
    return null;
  }
}

/**
 * Internal helper to fetch precise search volumes for a list of keywords.
 */
async function fetchPreciseVolumes(
  keywords: string[], 
  locationCode: number, 
  languageCode: string
): Promise<Record<string, number | null>> {
  const response = await fetchDataForSeo<DataForSeoResponse<any>>('/keywords_data/google_ads/search_volume/live', {
    method: 'POST',
    body: JSON.stringify([{
      keywords,
      location_code: locationCode,
      language_code: languageCode,
      include_unlimited_suggestions: false
    }])
  });

  const result: Record<string, number | null> = {};
  const volumes = response?.tasks?.[0]?.result || [];
  
  volumes.forEach((item: any) => {
    result[item.keyword] = item.search_info?.search_volume ?? null;
  });

  return result;
}

/**
 * Service to interact with DataForSEO APIs.
 */
export const dataForSeoService = {
  /**
    * Fetches keyword suggestions based on a seed keyword.
    */
  async getKeywordSuggestions(
    keyword: string, 
    locationCode = 2840, 
    languageCode = 'es'
  ): Promise<KeywordSuggestion[]> {
    const response = await fetchDataForSeo<DataForSeoResponse<KeywordSuggestion>>('/keywords_data/google_ads/keywords_for_keywords/live', {
      method: 'POST',
      body: JSON.stringify([{
        keywords: [keyword],
        location_code: locationCode,
        language_code: languageCode,
        include_seed_keyword: true,
        limit: 20
      }])
    });

    const suggestions = response?.tasks?.[0]?.result || [];

    // If it's a specific city location, we fetch HIGHER precision local volumes
    if (suggestions.length > 0 && locationCode > CITY_LOCATION_THRESHOLD) {
      try {
        const keywordList = suggestions.map(s => s.keyword);
        const preciseVolumes = await fetchPreciseVolumes(keywordList, locationCode, languageCode);
        
        return suggestions.map(suggestion => ({
          ...suggestion,
          search_volume: preciseVolumes[suggestion.keyword] ?? suggestion.search_volume
        }));
      } catch (err) {
        logger.warn('[DATAFORSEO] Error al obtener volúmenes precisos, usando base:', err);
      }
    }

    return suggestions;
  },

  /**
    * Fetches real-time SERP results (Advanced) for a keyword and location.
    */
  async getSerpResults(
    keyword: string, 
    locationCode: number, 
    languageCode = 'es'
  ): Promise<SerpItem[]> {
    const response = await fetchDataForSeo<DataForSeoResponse<SerpResult>>('/serp/google/organic/live/advanced', {
      method: 'POST',
      body: JSON.stringify([{
        keyword,
        location_code: locationCode,
        language_code: languageCode,
        device: 'desktop',
        os: 'windows',
        depth: 100
      }])
    });

    return response?.tasks?.[0]?.result?.[0]?.items || [];
  },

  /**
    * Fetches locations supported by Google for a specific country code.
    */
  async getLocationsByCountry(countryIsoCode: string): Promise<DataForSeoLocation[]> {
    const response = await fetchDataForSeo<DataForSeoResponse<DataForSeoLocation>>(`/keywords_data/google/locations/${countryIsoCode}`);
    return response?.tasks?.[0]?.result || [];
  }
};

