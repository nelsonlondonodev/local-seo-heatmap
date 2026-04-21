import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { Json } from '@/types/database';
import type { KeywordProject, TrackedKeyword, KeywordHistoryEntry } from '../types/keywords';

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
    return data as KeywordProject;
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
    return data as TrackedKeyword;
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
    // 1. Get previous rank to calculate change
    const { data: previousEntries } = await supabase
      .from('keyword_history')
      .select('rank')
      .eq('keyword_id', keywordId)
      .order('created_at', { ascending: false })
      .limit(1);

    const lastRank = previousEntries?.[0]?.rank || null;
    const rankChange = calculateRankChange(rank, lastRank);

    // 2. Insert new entry
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
    return data as KeywordHistoryEntry;
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
          rank,
          rank_change,
          created_at
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('[KW_PERSISTENCE] Error fetching project keywords:', error.message);
      throw error;
    }

    return (data || []).map(kw => {
      // History is already ordered descending by created_at from the subquery logic or explicit order
      const history = (kw.keyword_history as any[]) || [];
      const latest_history = history.length > 0 ? history[0] : null;
      
      return {
        ...kw,
        latest_history
      };
    }) as TrackedKeyword[];
  }
};

