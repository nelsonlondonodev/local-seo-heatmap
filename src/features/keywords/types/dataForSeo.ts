/**
 * Common structure for any DataForSEO API response
 */
export interface DataForSeoResponse<T> {
  version: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  tasks_count: number;
  tasks_error: number;
  tasks: Array<DataForSeoTask<T>>;
}

export interface DataForSeoTask<T> {
  id: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  result_count: number;
  result: T[] | null;
}

/**
 * DataForSEO Keyword Idea result item
 */
export interface KeywordSuggestion {
  keyword: string;
  search_volume: number | null;
  competition_level: 'HIGH' | 'MEDIUM' | 'LOW' | null;
  cpc: number | null;
  keyword_difficulty: number | null;
  competition_index?: number | null;
}

/**
 * SERP Result structure (container for items)
 */
export interface SerpResult {
  keyword: string;
  type: string;
  device: string;
  os: string;
  location_code: number;
  language_code: string;
  items_count: number;
  items: SerpItem[];
}

/**
 * SERP Item result
 */
export interface SerpItem {
  type: string;
  rank_group: number;
  rank_absolute: number;
  domain: string;
  title: string;
  url: string;
  description?: string;
}

/**
 * DataForSEO Location result
 */
export interface DataForSeoLocation {
  location_code: number;
  location_name: string;
  location_code_parent: number | null;
  country_iso_code: string;
  location_type: string;
}
