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

    return response?.tasks?.[0]?.result || [];
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
