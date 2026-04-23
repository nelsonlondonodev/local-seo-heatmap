import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { Database, Json } from '@/types/database';
import type { KeywordProject, TrackedKeyword, KeywordHistoryEntry } from '../types/keywords';

// Exact type definitions derived from Database schema
type DBProject = Database['public']['Tables']['keyword_projects']['Row'];
type DBTrackedKeyword = Database['public']['Tables']['tracked_keywords']['Row'];
type DBHistoryEntry = Database['public']['Tables']['keyword_history']['Row'];

/**
 * Calculates the change in rank between the current and previous entry.
 * Positive value indicates improvement (e.g., moving from 10 to 8 = +2).
 */
const calculateRankChange = (currentRank: number | null, previousRank: number | null): number => {
  if (currentRank === null || previousRank === null) return 0;
  return previousRank - currentRank;
};

/**
 * Service to handle Supabase persistence for Keyword Intelligence module.
 */
export const keywordPersistenceService = {
  /**
   * Creates a new keyword monitoring project.
   */
  async createProject(
    userId: string, 
    name: string, 
    targetUrl?: string, 
    locationCode?: number, 
    locationName?: string,
    countryCode?: string,
    agencyId?: string | null
  ): Promise<KeywordProject> {

    const { data, error } = await supabase
      .from('keyword_projects')
      .insert({
        user_id: userId,
        agency_id: agencyId || null,
        name,
        target_url: targetUrl || null,
        location_code: locationCode || null,
        location_name: locationName || null,
        country_code: countryCode || null,
      })
      .select()
      .single();

    if (error || !data) {
      logger.error('[KW_PERSISTENCE] Error creating project:', error?.message);
      throw error || new Error('No se pudo crear el proyecto');
    }
    
    // Explicit return to match KeywordProject interface
    return {
      id: data.id,
      name: data.name,
      target_url: data.target_url,
      location_code: data.location_code,
      location_name: data.location_name,
      country_code: data.country_code,
      user_id: data.user_id,
      agency_id: data.agency_id,
      created_at: data.created_at
    };
  },

  /**
   * Adds a keyword to a project for tracking.
   */
  async addKeyword(projectId: string, keyword: string): Promise<TrackedKeyword> {
    const { data, error } = await supabase
      .from('tracked_keywords')
      .insert({
        project_id: projectId,
        keyword: keyword.trim().toLowerCase(),
      })
      .select()
      .single();

    if (error || !data) {
      logger.error('[KW_PERSISTENCE] Error adding keyword:', error?.message);
      throw error || new Error('No se pudo añadir la palabra clave');
    }
    
    return {
      id: data.id,
      project_id: data.project_id,
      keyword: data.keyword,
      created_at: data.created_at
    };
  },

  /**
   * Records a new rank entry for a keyword. 
   */
  async saveRankEntry(
    keywordId: string, 
    rank: number | null, 
    searchVolume?: number, 
    resultsJson?: Json
  ): Promise<KeywordHistoryEntry> {
    const { data: previousEntries } = await supabase
      .from('keyword_history')
      .select('rank')
      .eq('keyword_id', keywordId)
      .order('created_at', { ascending: false })
      .limit(1);

    const lastRank = previousEntries?.[0]?.rank || null;
    const rankChange = calculateRankChange(rank, lastRank);

    const { data, error } = await supabase
      .from('keyword_history')
      .insert({
        keyword_id: keywordId,
        rank,
        rank_change: rankChange,
        search_volume: searchVolume || null,
        results_json: resultsJson || null,
      })
      .select()
      .single();

    if (error || !data) {
      logger.error('[KW_PERSISTENCE] Error saving rank entry:', error?.message);
      throw error || new Error('No se pudo guardar la posición');
    }

    return {
      id: data.id,
      keyword_id: data.keyword_id,
      rank: data.rank,
      rank_change: data.rank_change,
      search_volume: data.search_volume,
      created_at: data.created_at,
      results_json: data.results_json ?? undefined
    };
  },

  /**
   * Gets all keywords for a project with their latest ranking.
   */
  async getProjectKeywords(projectId: string): Promise<TrackedKeyword[]> {
    const { data, error } = await supabase
      .from('tracked_keywords')
      .select(`
        *,
        keyword_history (
          id,
          keyword_id,
          rank,
          rank_change,
          search_volume,
          results_json,
          created_at
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('[KW_PERSISTENCE] Error fetching project keywords:', error.message);
      throw error;
    }

    // Explicit transformation to ensure TrackedKeyword[] compliance
    const keywords = (data || []) as (DBTrackedKeyword & { keyword_history: DBHistoryEntry[] })[];

    return keywords.map(row => {
      const historyArr = row.keyword_history || [];
      const latest = historyArr.length > 0 ? historyArr[0] : null;

      const latest_history: KeywordHistoryEntry | null = latest ? {
        id: latest.id,
        keyword_id: latest.keyword_id,
        rank: latest.rank,
        rank_change: latest.rank_change,
        search_volume: latest.search_volume,
        created_at: latest.created_at,
        results_json: latest.results_json ?? undefined
      } : null;

      return {
        id: row.id,
        project_id: row.project_id,
        keyword: row.keyword,
        created_at: row.created_at,
        latest_history
      };
    });
  }
};
