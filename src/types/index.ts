/** Grid size options for the heatmap */
export type GridSize = '3x3' | '5x5' | '7x7';

/** A single grid point with its ranking data */
export interface GridPoint {
  lat: number;
  lng: number;
  rank: number | null;
  totalResults: number;
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
}

/** Full heatmap result including all grid points */
export interface HeatmapResult {
  id: string;
  config: HeatmapConfig;
  points: GridPoint[];
  createdAt: string;
}

/** Color scale for ranking visualization */
export interface RankColor {
  rank: number;
  color: string;
  label: string;
}

/** User profile in the application */
export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
}

/** Search history entry */
export interface SearchHistoryEntry {
  id: string;
  keyword: string;
  businessName: string;
  gridSize: GridSize;
  radiusKm: number;
  createdAt: string;
  resultsSummary: {
    avgRank: number;
    bestRank: number;
    worstRank: number;
    pointsFound: number;
    totalPoints: number;
  };
}
