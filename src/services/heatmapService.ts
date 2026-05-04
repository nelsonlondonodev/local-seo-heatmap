import { supabase } from '@/lib/supabase';
import type { HeatmapResult, GridPoint, ResultsSummary } from '@/types';
import type { Database, Json } from '@/types/database';
import { isResultsSummary } from '@/util/mappers';

/**
 * Service to handle persistence of heatmap data in Supabase Cloud.
 */
export const heatmapService = {
  /**
   * Persists a heatmap result to the database.
   */
  async saveHeatmap(result: HeatmapResult, userId: string, agencyId?: string | null) {
    const summary = calculateResultsSummary(result.points);

    const heatmapInsert: Database['public']['Tables']['heatmaps']['Insert'] = {
      id: result.id,
      user_id: userId,
      agency_id: agencyId || null,
      keyword: result.config.keyword,
      business_name: result.config.businessName,
      place_id: result.config.placeId,
      grid_size: result.config.gridSize,
      radius_km: result.config.radiusKm,
      center_lat: result.config.centerLat,
      center_lng: result.config.centerLng,
      points: result.points as unknown as Json,
      results_summary: summary as unknown as Json,
      prospect_name: result.config.prospectName || null,
      prospect_email: result.config.prospectEmail || null,
      advertisers: (result.advertisers || []) as unknown as Json,
      competitors: (result.competitors || []) as unknown as Json,
    };

    const { data, error } = await supabase
      .from('heatmaps')
      .insert(heatmapInsert)
      .select()
      .single();

    if (error) {
      console.error('[HEATMAP_SERVICE] Error saving heatmap:', error.message);
      throw error;
    }

    return data;
  },

  /**
   * Retrieves heatmaps based on role. Staff/Admins see all agency heatmaps, clients see their own.
   */
  async getUserHeatmaps(userId: string, role?: string, agencyId?: string | null) {
    let query = supabase.from('heatmaps').select('*');

    if (agencyId && ['owner', 'super-admin', 'admin', 'staff'].includes(role || '')) {
      query = query.eq('agency_id', agencyId);
    } else {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('[HEATMAP_SERVICE] Error fetching heatmaps:', error.message);
      throw error;
    }

    return data;
  },

  /**
   * Deletes a specific heatmap scan.
   */
  async deleteHeatmap(id: string) {
    const { error } = await supabase
      .from('heatmaps')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[HEATMAP_SERVICE] Error deleting heatmap:', error.message);
      throw error;
    }
    
    return true;
  },

  /**
   * Retrieves historical ranking data for a specific business and keyword.
   */
  async getRankingHistory(placeId: string, keyword: string) {
    const { data, error } = await supabase
      .from('heatmaps')
      .select('created_at, results_summary')
      .eq('place_id', placeId)
      .eq('keyword', keyword)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[HEATMAP_SERVICE] Error fetching history:', error.message);
      throw error;
    }

    return (data || []).map(row => {
      const summary = isResultsSummary(row.results_summary) ? row.results_summary : null;
      return {
        date: row.created_at,
        avgRank: summary?.avgRank || 0,
        bestRank: summary?.bestRank || 0,
      };
    });
  },
};

/**
 * Private helper to calculate stats summary from grid points.
 */
function calculateResultsSummary(points: GridPoint[]) {
  const rankedPoints = points.filter((p) => p.rank !== null && p.rank! > 0);
  const total = points.length;
  const found = rankedPoints.length;

  if (found === 0) {
    return {
      avgRank: 0,
      bestRank: null,
      foundCount: 0,
      totalCount: total,
    };
  }

  const avg = rankedPoints.reduce((acc, p) => acc + (p.rank || 0), 0) / found;
  const best = Math.min(...rankedPoints.map((p) => p.rank || 21));

  return {
    avgRank: Number(avg.toFixed(1)),
    bestRank: best,
    foundCount: found,
    totalCount: total,
  };
}
