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
