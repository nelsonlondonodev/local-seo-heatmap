import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { Database, Json } from '@/types/database';

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
    agencyId?: string | null
  ) {
    const { data, error } = await supabase
      .from('keyword_projects')
      .insert({
        user_id: userId,
        agency_id: agencyId || null,
        name,
        target_url: targetUrl || null,
        location_code: locationCode || null,
      })
      .select()
      .single();

    if (error) {
      logger.error('[KW_PERSISTENCE] Error creating project:', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Adds a keyword to a project for tracking.
   */
  async addKeyword(projectId: string, keyword: string) {
    const { data, error } = await supabase
      .from('tracked_keywords')
      .insert({
        project_id: projectId,
        keyword: keyword.trim().toLowerCase(),
      })
      .select()
      .single();

    if (error) {
      logger.error('[KW_PERSISTENCE] Error adding keyword:', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Records a new rank entry for a keyword. 
   * Includes logic to compare with previous rank.
   */
  async saveRankEntry(
    keywordId: string, 
    rank: number | null, 
    searchVolume?: number, 
    resultsJson?: Json
  ) {
    // 1. Get previous rank to calculate change
    const { data: previousEntries } = await supabase
      .from('keyword_history')
      .select('rank')
      .eq('keyword_id', keywordId)
      .order('created_at', { ascending: false })
      .limit(1);

    const lastRank = previousEntries?.[0]?.rank || null;
    let rankChange = 0;

    if (rank !== null && lastRank !== null) {
      rankChange = lastRank - rank; // Positive means improved (e.g., from 10 to 8 = +2)
    }

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

    if (error) {
      logger.error('[KW_PERSISTENCE] Error saving rank entry:', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Gets all keywords for a project with their latest ranking.
   */
  async getProjectKeywords(projectId: string) {
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

    // Process to get only the latest history entry for each keyword
    return (data || []).map(kw => ({
      ...kw,
      latest_history: Array.isArray(kw.keyword_history) 
        ? kw.keyword_history.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0] || null
        : null
    }));
  }
};
