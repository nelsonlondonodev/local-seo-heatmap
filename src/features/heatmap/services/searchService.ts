import type { HeatmapConfig, HeatmapResult, GridPoint } from '@/types';
import { delay, chunkArray } from '@/lib/utils';
import { isBusinessMatch } from '../utils/textUtils';
import type { SerperMapsResponse, SerperPlace } from '../types/serper';

const SERPER_API_KEY = import.meta.env.VITE_SERPER_API_KEY;

// Constants for API configuration
const CONFIG = {
  BATCH_SIZE: 5,
  BATCH_DELAY_MS: 400,
  SERPER_URL: 'https://google.serper.dev/maps',
  DEFAULT_GL: 'co', // Colombia
  DEFAULT_HL: 'es', // Spanish
  ZOOM_LEVEL: '15z'
} as const;

/**
 * Scans a single grid point against the Serper Places API.
 */
async function scanSinglePoint(
  point: GridPoint,
  config: HeatmapConfig
): Promise<GridPoint> {
  const { businessName, placeId, keyword } = config;

  try {
    const response = await fetch(CONFIG.SERPER_URL, {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: keyword,
        ll: `@${point.lat},${point.lng},${CONFIG.ZOOM_LEVEL}`,
        gl: CONFIG.DEFAULT_GL,
        hl: CONFIG.DEFAULT_HL,
        autocorrect: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Serper API error (HTTP ${response.status})`);
    }

    const data: SerperMapsResponse = await response.json();
    const placesResults = data.places || [];

    const businessIndex = placesResults.findIndex((item: SerperPlace) => 
      isBusinessMatch(businessName || '', item.title, placeId, item.cid)
    );

    const rank = businessIndex !== -1 ? businessIndex + 1 : null;

    if (rank) {
      console.log(`[SCAN] ✅ "${businessName}" → pos #${rank}`);
    } else {
      const top3 = placesResults.slice(0, 3).map(p => p.title).join(', ');
      console.warn(`[SCAN] ❌ "${businessName}" no encontrado. Top 3: [${top3}]`);
    }

    return { ...point, rank, totalResults: placesResults.length };
  } catch (err) {
    console.error(`[SCAN] Error at (${point.lat}, ${point.lng}):`, err);
    return { ...point, rank: null, totalResults: 0 };
  }
}

/**
 * Service to handle heatmap search logic using Serper.dev.
 */
export const searchService = {
  /**
   * Executes ranking search for each grid point using throttled batches.
   * Accepts an optional onProgress callback to report batch-level progress.
   */
  async executeSearch(
    config: HeatmapConfig,
    points: GridPoint[],
    onProgress?: (current: number, total: number) => void
  ): Promise<HeatmapResult> {
    
    // Simulation mode fallback
    if (!SERPER_API_KEY || SERPER_API_KEY === 'your_serper_api_key_here') {
      await delay(2000);
      return {
        id: crypto.randomUUID(),
        config,
        points: points.map(p => ({
          ...p,
          rank: Math.random() > 0.1 ? Math.floor(Math.random() * 20) + 1 : null,
          totalResults: Math.floor(Math.random() * 50) + 1,
        })),
        createdAt: new Date().toISOString(),
      };
    }

    try {
      const batches = chunkArray(points, CONFIG.BATCH_SIZE);
      const results: GridPoint[] = [];

      console.log(`[SCAN] Iniciando análisis: ${points.length} puntos en ${batches.length} lotes`);

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        
        const batchResults = await Promise.all(
          batch.map(point => scanSinglePoint(point, config))
        );
        
        results.push(...batchResults);
        onProgress?.(i + 1, batches.length);

        if (i < batches.length - 1) {
          await delay(CONFIG.BATCH_DELAY_MS);
        }
      }

      return {
        id: crypto.randomUUID(),
        config,
        points: results,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('SEARCH_SERVICE_ERROR:', error);
      throw error;
    }
  },
};
