import type { HeatmapConfig, HeatmapResult, GridPoint, CompetitorStat } from '@/types';
import { logger } from '@/lib/logger';
import { delay, chunkArray } from '@/lib/utils';
import { invokeEdgeFunction } from '@/lib/edgeFunctions';
import { isBusinessMatch } from '../utils/textUtils';
import type { SerperMapsResponse, SerperPlace, SerperSearchResponse } from '../types/serper';

// Constants for API configuration
const CONFIG = {
  BATCH_SIZE: 5,
  BATCH_DELAY_MS: 400,
  DEFAULT_GL: import.meta.env.VITE_DEFAULT_COUNTRY || 'us', 
  DEFAULT_HL: 'es', // Spanish
  ZOOM_LEVEL: '15z',
  /** Enable demo mode to bypass API calls with simulated data */
  DEMO_MODE: import.meta.env.VITE_DEMO_MODE === 'true',
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
    const data = await invokeEdgeFunction<SerperMapsResponse>('proxy-serper', {
      endpoint: 'maps',
      payload: {
        q: keyword,
        ll: `@${point.lat},${point.lng},${CONFIG.ZOOM_LEVEL}`,
        gl: CONFIG.DEFAULT_GL,
        hl: CONFIG.DEFAULT_HL,
        autocorrect: false,
      },
    });

    const placesResults = data.places || [];

    const businessIndex = placesResults.findIndex((item: SerperPlace) => 
      isBusinessMatch(businessName || '', item.title, placeId, item.cid)
    );

    const rank = businessIndex !== -1 ? businessIndex + 1 : null;
    const topCompetitors = placesResults.slice(0, 10).map((p: SerperPlace) => p.title);

    if (rank) {
      logger.info(`[SCAN] ✅ "${businessName}" → pos #${rank}`);
    } else {
      const top3 = topCompetitors.slice(0, 3).join(', ');
      logger.warn(`[SCAN] ❌ "${businessName}" no encontrado. Top 3: [${top3}]`);
    }

    return { 
      ...point, 
      rank, 
      totalResults: placesResults.length,
      topCompetitors 
    };
  } catch (err) {
    logger.error(`[SCAN] Error at (${point.lat}, ${point.lng}):`, err);
    return { ...point, rank: null, totalResults: 0 };
  }
}

/**
 * Calculates aggregated competition statistics from all grid points.
 */
function calculateCompetitorStats(points: GridPoint[]): CompetitorStat[] {
  const statsMap = new Map<string, {
    totalRank: number;
    top3Count: number;
    presenceCount: number;
  }>();

  points.forEach(point => {
    (point.topCompetitors || []).forEach((name, idx) => {
      const rank = idx + 1;
      const current = statsMap.get(name) || { totalRank: 0, top3Count: 0, presenceCount: 0 };
      
      current.totalRank += rank;
      current.presenceCount += 1;
      if (rank <= 3) current.top3Count += 1;
      
      statsMap.set(name, current);
    });
  });

  const totalPoints = points.length;

  return Array.from(statsMap.entries())
    .map(([name, data]) => ({
      name,
      avgRank: Number((data.totalRank / data.presenceCount).toFixed(1)),
      top3Count: data.top3Count,
      presenceCount: data.presenceCount,
      shareOfLocalPack: Number(((data.top3Count / totalPoints) * 100).toFixed(1))
    }))
    .sort((a, b) => b.top3Count - a.top3Count || a.avgRank - b.avgRank)
    .slice(0, 12); // Best 12 competitors
}

/**
 * Detects advertisers for a specific keyword using Serper Search endpoint.
 */
async function getAdvertisers(keyword: string): Promise<string[]> {
  if (CONFIG.DEMO_MODE) return [];
  
  try {
    const data = await invokeEdgeFunction<SerperSearchResponse>('proxy-serper', {
      endpoint: 'search',
      payload: {
        q: keyword,
        gl: CONFIG.DEFAULT_GL,
        hl: CONFIG.DEFAULT_HL,
      },
    });

    const advertiserTitles = (data.ads || []).map(ad => ad.title);
    
    if (advertiserTitles.length > 0) {
      logger.info(`[ADS] Detectados ${advertiserTitles.length} anunciantes para "${keyword}"`);
    }
    
    return advertiserTitles;
  } catch (err) {
    logger.error('[ADS] Error detecting advertisers:', err);
    return [];
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
    
    // Simulation mode fallback (no API key needed — it lives in Edge Function)
    if (CONFIG.DEMO_MODE) {
      await delay(2000);
      return {
        id: crypto.randomUUID(),
        config,
        points: points.map(p => ({
          ...p,
          rank: Math.random() > 0.1 ? Math.floor(Math.random() * 20) + 1 : null,
          totalResults: Math.floor(Math.random() * 50) + 1,
        })),
        advertisers: ['Negocio Pro en Ads', 'Competidor Top'],
        createdAt: new Date().toISOString(),
      };
    }

    try {
      // Step 1: Detect Advertisers (Parallel to starting batches)
      const advertisersPromise = getAdvertisers(config.keyword);

      const batches = chunkArray(points, CONFIG.BATCH_SIZE);
      const results: GridPoint[] = [];

      logger.info(`[SCAN] Iniciando análisis: ${points.length} puntos en ${batches.length} lotes`);

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

      const advertisers = await advertisersPromise;
      const competitors = calculateCompetitorStats(results);

      return {
        id: crypto.randomUUID(),
        config,
        points: results,
        advertisers,
        competitors,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('SEARCH_SERVICE_ERROR:', error);
      throw error;
    }
  },
};
