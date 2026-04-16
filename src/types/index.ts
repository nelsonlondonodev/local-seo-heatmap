/** Grid size options for the heatmap */
export type GridSize = '3x3' | '5x5' | '7x7';

/** A single grid point with its ranking data */
export interface GridPoint {
  lat: number;
  lng: number;
  rank: number | null;
  totalResults: number;
  topCompetitors?: string[]; // Store top 5 names for this point
}

/** Configuration for a heatmap search */
export interface HeatmapConfig {
  keyword: string;
  businessName: string;
  placeId: string;
  gridSize: GridSize;
  radiusKm: number;
  centerLat: number;
  centerLng: number;
  prospectName?: string;
  prospectEmail?: string;
}

/** Full heatmap result including all grid points */
export interface HeatmapResult {
  id: string;
  config: HeatmapConfig;
  points: GridPoint[];
  advertisers?: string[];
  competitors?: CompetitorStat[];
  createdAt: string;
}

/** Competition metrics per business */
export interface CompetitorStat {
  name: string;
  avgRank: number;
  top3Count: number;
  presenceCount: number;
  shareOfLocalPack: number;
}

/** Color scale for ranking visualization */
export interface RankColor {
  rank: number;
  color: string;
  label: string;
}

/** Summary of heatmap results stored in DB */
export interface ResultsSummary {
  avgRank: number;
  bestRank: number | null;
  foundCount: number;
  totalCount: number;
}

/** Search history entry */
export interface SearchHistoryEntry {
  id: string;
  keyword: string;
  businessName: string;
  gridSize: GridSize;
  radiusKm: number;
  createdAt: string;
  resultsSummary: ResultsSummary;
  prospectName?: string | null;
  prospectEmail?: string | null;
}
