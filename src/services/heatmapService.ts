import { supabase } from '@/lib/supabase';
import type { HeatmapResult, GridPoint } from '@/types';
import type { Database } from '@/types/database';

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
      points: result.points as unknown as Database['public']['Tables']['heatmaps']['Row']['points'],
      results_summary: summary as unknown as Database['public']['Tables']['heatmaps']['Row']['results_summary'],
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
   * Retrieves all heatmaps for a specific user, ordered by creation date.
   */
  async getUserHeatmaps(userId: string) {
    const { data, error } = await supabase
      .from('heatmaps')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

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
