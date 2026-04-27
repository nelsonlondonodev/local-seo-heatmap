import { logger } from '@/lib/logger';
import { invokeEdgeFunction } from '@/lib/edgeFunctions';
import type { 
  KeywordSuggestion, 
  DataForSeoResponse, 
  SerpResult, 
  SerpItem,
  DataForSeoLocation,
  DomainRankOverview,
  RankedKeywordItem
} from '../types/dataForSeo';

/**
 * Generic helper for DataForSEO API requests via Edge Function proxy.
 */
async function fetchDataForSeo<T>(endpoint: string, payload?: unknown, method?: 'GET' | 'POST'): Promise<T | null> {
  try {
    return await invokeEdgeFunction<T>('proxy-dataforseo', {
      endpoint,
      payload,
      method,
    });
  } catch (error) {
    logger.error(`[DATAFORSEO] Request failed (${endpoint}):`, error);
    return null;
  }
}

interface KeywordVolumeResult {
  keyword: string;
  search_info?: {
    search_volume: number | null;
  };
}

// Threshold for location codes that usually represent specific cities/narrow areas
const CITY_LOCATION_THRESHOLD = 3000;

/**
 * Internal helper to fetch precise search volumes for a list of keywords.
 */
async function fetchPreciseVolumes(
  keywords: string[], 
  locationCode: number, 
  languageCode: string
): Promise<Record<string, number | null>> {
  const response = await fetchDataForSeo<DataForSeoResponse<KeywordVolumeResult>>(
    '/keywords_data/google_ads/search_volume/live',
    [{
      keywords,
      location_code: locationCode,
      language_code: languageCode,
      include_unlimited_suggestions: false
    }],
    'POST'
  );

  const result: Record<string, number | null> = {};
  const volumes = response?.tasks?.[0]?.result || [];
  
  volumes.forEach((item) => {
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
    const response = await fetchDataForSeo<DataForSeoResponse<KeywordSuggestion>>(
      '/keywords_data/google_ads/keywords_for_keywords/live',
      [{
        keywords: [keyword],
        location_code: locationCode,
        language_code: languageCode,
        include_seed_keyword: true,
        limit: 20
      }],
      'POST'
    );

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
    const response = await fetchDataForSeo<DataForSeoResponse<SerpResult>>(
      '/serp/google/organic/live/advanced',
      [{
        keyword,
        location_code: locationCode,
        language_code: languageCode,
        device: 'desktop',
        os: 'windows',
        depth: 100
      }],
      'POST'
    );

    return response?.tasks?.[0]?.result?.[0]?.items || [];
  },

  /**
    * Fetches locations supported by Google for a specific country code.
    */
  async getLocationsByCountry(countryIsoCode: string): Promise<DataForSeoLocation[]> {
    const response = await fetchDataForSeo<DataForSeoResponse<DataForSeoLocation>>(
      `/keywords_data/google/locations/${countryIsoCode}`,
      undefined,
      'GET'
    );
    return response?.tasks?.[0]?.result || [];
  },

  /**
   * Fetches domain rank overview (traffic, total keywords, cost)
   */
  async getDomainRankOverview(
    target: string,
    locationCode = 2840,
    languageCode = 'es'
  ): Promise<DomainRankOverview | null> {
    const response = await fetchDataForSeo<DataForSeoResponse<DomainRankOverview>>(
      '/dataforseo_labs/google/domain_rank_overview/live',
      [{
        target,
        location_code: locationCode,
        language_code: languageCode
      }],
      'POST'
    );
    return response?.tasks?.[0]?.result?.[0] || null;
  },

  /**
   * Fetches organic ranked keywords for a specific domain.
   */
  async getDomainRankedKeywords(
    target: string,
    locationCode = 2840,
    languageCode = 'es',
    limit = 100
  ): Promise<RankedKeywordItem[]> {
    const response = await fetchDataForSeo<DataForSeoResponse<{ items: RankedKeywordItem[] }>>(
      '/dataforseo_labs/google/ranked_keywords/live',
      [{
        target,
        location_code: locationCode,
        language_code: languageCode,
        limit
      }],
      'POST'
    );
    return response?.tasks?.[0]?.result?.[0]?.items || [];
  }
};

