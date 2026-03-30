/** Application-wide configuration constants */

export const APP_CONFIG = {
  name: 'LocalRank Pro',
  description: 'Herramienta SaaS de SEO Local con Mapa de Calor interactivo',
  version: '0.1.0',
} as const;

/** Grid size options and their numeric dimensions */
export const GRID_OPTIONS = [
  { value: '3x3' as const, label: '3×3', points: 9, description: 'Rápido' },
  { value: '5x5' as const, label: '5×5', points: 25, description: 'Balanceado' },
  { value: '7x7' as const, label: '7×7', points: 49, description: 'Detallado' },
] as const;

/** Radius options in kilometers */
export const RADIUS_OPTIONS = [1, 2, 3, 5, 10, 15, 20] as const;

/** Color scale for ranking visualization on the heatmap */
export const RANK_COLORS = [
  { rank: 1, color: '#22c55e', label: '#1 - Excelente' },
  { rank: 2, color: '#4ade80', label: '#2' },
  { rank: 3, color: '#86efac', label: '#3' },
  { rank: 4, color: '#fde047', label: '#4' },
  { rank: 5, color: '#facc15', label: '#5' },
  { rank: 6, color: '#f59e0b', label: '#6' },
  { rank: 7, color: '#fb923c', label: '#7' },
  { rank: 8, color: '#f97316', label: '#8' },
  { rank: 9, color: '#ef4444', label: '#9' },
  { rank: 10, color: '#dc2626', label: '#10' },
  { rank: 11, color: '#b91c1c', label: '#11-15' },
  { rank: 16, color: '#991b1b', label: '#16-20' },
  { rank: 20, color: '#7f1d1d', label: '20+ / No encontrado' },
] as const;

/** Get the appropriate color for a given rank */
export function getRankColor(rank: number | null): string {
  if (rank === null) return '#374151'; // gray-700 for not found
  const colorEntry = [...RANK_COLORS].reverse().find((c) => rank >= c.rank);
  return colorEntry?.color ?? '#7f1d1d';
}

/** Map default center (Madrid, Spain - adjust as needed) */
export const MAP_DEFAULT_CENTER = {
  lat: 40.4168,
  lng: -3.7038,
  zoom: 13,
} as const;

/** Plan limits */
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
