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

    const rawSuggestions = response?.tasks?.[0]?.result || [];

    // Si es una ubicación específica (ciudad) obtenemos el volumen LOCAL preciso
    if (rawSuggestions.length > 0 && locationCode > 3000) {
      try {
        const keywordList = rawSuggestions.map((s: any) => s.keyword);
        const preciseData = await fetchDataForSeo<DataForSeoResponse<any>>('/keywords_data/google_ads/search_volume/live', {
          method: 'POST',
          body: JSON.stringify([{
            keywords: keywordList,
            location_code: locationCode,
            language_code: languageCode,
            include_unlimited_suggestions: false
          }])
        });

        const volumes = preciseData?.tasks?.[0]?.result || [];
        
        return rawSuggestions.map((s: any) => {
          const match = volumes.find((v: any) => v.keyword === s.keyword);
          const localVolume = match?.search_info?.search_volume ?? s.search_info?.search_volume ?? s.search_volume;
          
          return {
            ...s,
            search_volume: localVolume,
            search_info: s.search_info ? { ...s.search_info, search_volume: localVolume } : undefined
          };
        }) as KeywordSuggestion[];
      } catch (err) {
        logger.warn('[DATAFORSEO] Error al obtener volúmenes precisos:', err);
      }
    }

    return rawSuggestions as KeywordSuggestion[];
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
