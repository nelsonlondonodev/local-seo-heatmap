/** Application-wide configuration and Brand Defaults */

export const DEFAULT_BRANDING = {
  name: 'MapRanker Pro',
  description: 'Herramienta SaaS de SEO Local con Mapa de Calor interactivo',
  logoUrl: null,
  primaryColor: '#0f172a', // Slate 900
  secondaryColor: '#3b82f6', // Blue 500
  accentColor: '#10b981', // Emerald 500
} as const;

/** 
 * Static configuration that shouldn't change between domains 
 * but might be used as fallbacks.
 */
export const APP_CONFIG = {
  ...DEFAULT_BRANDING,
  version: '0.8.0',
} as const;

/** Grid size options and their numeric dimensions */
export const GRID_OPTIONS = [
  { value: '3x3' as const, label: '3×3', points: 9, description: 'Rápido' },
  { value: '5x5' as const, label: '5×5', points: 25, description: 'Balanceado' },
  { value: '7x7' as const, label: '7×7', points: 49, description: 'Detallado' },
] as const;

/** Cost in credits per analysis point (Serper /maps endpoint costs 1 credit) */
export const COST_PER_POINT = 1;

/** Radius options in kilometers */
export const RADIUS_OPTIONS = [1, 2, 3, 5, 10, 15, 20] as const;

/** Color scale for ranking visualization on the heatmap (Commercial Impact Edition) */
export const RANK_COLORS = [
  { rank: 1, color: '#22c55e', label: '1 - Excelente' },
  { rank: 2, color: '#16a34a', label: '2' },
  { rank: 3, color: '#15803d', label: '3' },
  { rank: 4, color: '#eab308', label: '4-5 (Alarma)' },
  { rank: 6, color: '#ea580c', label: '6-9 (Urgente)' },
  { rank: 10, color: '#dc2626', label: '10-14 (Crítico)' },
  { rank: 15, color: '#991b1b', label: '15-19 (Invisibilidad)' },
  { rank: 20, color: '#450a0a', label: '20+ / No Encontrado' },
] as const;

/** Get the appropriate color for a given rank */
export function getRankColor(rank: number | null): string {
  if (rank === null || rank === 0) return '#450a0a'; // Deep red / Out of results
  const colorEntry = [...RANK_COLORS].reverse().find((c) => rank >= c.rank);
  return colorEntry?.color ?? '#450a0a';
}

/** Map default center - uses env vars or fallback to NYC for global neutrality */
export const MAP_DEFAULT_CENTER = {
  lat: Number(import.meta.env.VITE_DEFAULT_LAT) || 40.7128,
  lng: Number(import.meta.env.VITE_DEFAULT_LNG) || -74.0060,
  zoom: 13,
} as const;

/** Plan limits for SaaS multi-tenancy */
export const PLAN_LIMITS = {
  free: {
    searchesPerDay: 3,
    maxGridSize: '5x5' as const,
    historyDays: 7,
  },
  pro: {
    searchesPerDay: 50,
    maxGridSize: '7x7' as const,
    historyDays: 90,
  },
  enterprise: {
    searchesPerDay: Infinity,
    maxGridSize: '7x7' as const,
    historyDays: 365,
  },
} as const;
