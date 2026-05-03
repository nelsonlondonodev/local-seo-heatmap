import type { 
  GridPoint, 
  ResultsSummary, 
  CompetitorStat, 
  HeatmapResult, 
  GridSize 
} from '@/types';
import type { Database } from '@/types/database';

type HeatmapRow = Database['public']['Tables']['heatmaps']['Row'];

/**
 * Type Guard to safely check if unknown data is a valid ResultsSummary.
 */
export function isResultsSummary(data: unknown): data is ResultsSummary {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.avgRank === 'number' &&
    typeof d.foundCount === 'number' &&
    typeof d.totalCount === 'number'
  );
}

/**
 * Safely casts a JSON column to an array of T.
 * Centralizes the 'as unknown as' pattern into a single controlled point.
 */
export function safeCastArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }
  return [];
}

/**
 * Mapper to convert a Database Row into a clean Frontend HeatmapResult.
 * This is the ONLY place where we deal with the impedance mismatch between 
 * the database JSON storage and our strict frontend interfaces.
 */
export function mapHeatmapToResult(row: HeatmapRow): HeatmapResult {
  // Results summary is deliberately ignored here since HeatmapResult 
  // interface does not use it. If needed, it would be added to the interface first.

  return {
    id: row.id,
    config: {
      keyword: row.keyword,
      businessName: row.business_name,
      placeId: row.place_id,
      gridSize: row.grid_size as GridSize,
      radiusKm: row.radius_km,
      centerLat: row.center_lat,
      centerLng: row.center_lng,
      prospectName: row.prospect_name || undefined,
      prospectEmail: row.prospect_email || undefined,
    },
    points: safeCastArray<GridPoint>(row.points),
    advertisers: safeCastArray<string>(row.advertisers),
    competitors: safeCastArray<CompetitorStat>(row.competitors),
    createdAt: row.created_at,
  };
}
