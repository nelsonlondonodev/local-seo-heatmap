import type { Json } from '@/types/database';

/**
 * Types for the Keyword Intelligence persistence layer
 */

export interface KeywordProject {
  id: string;
  name: string;
  target_url: string | null;
  location_code: number | null;
  location_name: string | null;
  country_code: string | null;
  user_id: string;
  agency_id: string | null;
  created_at: string;
}

export interface TrackedKeyword {
  id: string;
  project_id: string;
  keyword: string;
  created_at: string;
  latest_history?: KeywordHistoryEntry | null;
}

export interface KeywordHistoryEntry {
  id: string;
  keyword_id: string;
  rank: number | null;
  rank_change: number;
  search_volume: number | null;
  created_at: string;
  results_json?: Json;
}
