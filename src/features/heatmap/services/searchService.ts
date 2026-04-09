import type { HeatmapConfig, HeatmapResult, GridPoint } from '@/types';

const SERPER_API_KEY = import.meta.env.VITE_SERPER_API_KEY;

/** Batch size for throttled API requests */
const BATCH_SIZE = 5;

/** Delay in ms between batches to avoid rate limiting */
const BATCH_DELAY_MS = 400;

/**
 * Normalizes text for fuzzy matching: lowercase, removes accents, trims.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Pauses execution for a given number of milliseconds.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Splits an array into chunks of the specified size.
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Scans a single grid point against the Serper Places API.
 */
async function scanSinglePoint(
  point: GridPoint,
  config: HeatmapConfig
): Promise<GridPoint> {
  try {
    const response = await fetch('https://google.serper.dev/places', {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: config.keyword,
        ll: `@${point.lat},${point.lng},15z`,
        location: 'Chía, Cundinamarca, Colombia',
        gl: 'co',
        hl: 'es',
        autocorrect: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Serper API error (HTTP ${response.status})`);
    }

    const data = await response.json();
    const placesResults = data.places || [];

    const normalizedConfigName = normalize(config.businessName || '');

    const businessIndex = placesResults.findIndex((item: any) => {
      const itemTitle = normalize(item.title || '');
      const cidMatch =
        config.placeId &&
        item.cid &&
        String(config.placeId).includes(String(item.cid));

      return (
        itemTitle.includes(normalizedConfigName) ||
        normalizedConfigName.includes(itemTitle) ||
        cidMatch
      );
    });

    const rank = businessIndex !== -1 ? businessIndex + 1 : null;

    if (rank) {
      console.log(`[SCAN] ✅ "${config.businessName}" → pos #${rank}`);
    } else {
      const topTitles = placesResults
        .slice(0, 3)
        .map((p: any) => p.title)
        .join(', ');
      console.warn(
        `[SCAN] ❌ "${config.businessName}" no encontrado. Top 3: [${topTitles}]`
      );
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
    // Fallback: simulated data when no API key is configured
    if (!SERPER_API_KEY || SERPER_API_KEY === 'your_serper_api_key_here') {
      await delay(2000);
      const results: GridPoint[] = points.map((p) => ({
        ...p,
        rank: Math.random() > 0.1 ? Math.floor(Math.random() * 20) + 1 : null,
        totalResults: Math.floor(Math.random() * 50) + 1,
      }));
      return {
        id: crypto.randomUUID(),
        config,
        points: results,
        createdAt: new Date().toISOString(),
      };
    }

    try {
      const batches = chunkArray(points, BATCH_SIZE);
      const results: GridPoint[] = [];

      console.log(
        `[SCAN] Iniciando análisis: ${points.length} puntos en ${batches.length} lotes`
      );

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(
          `[SCAN] Lote ${i + 1}/${batches.length} (${batch.length} puntos)...`
        );

        const batchResults = await Promise.all(
          batch.map((point) => scanSinglePoint(point, config))
        );
        results.push(...batchResults);

        // Report progress to the UI
        onProgress?.(i + 1, batches.length);

        // Pause between batches to respect rate limits (skip after last batch)
        if (i < batches.length - 1) {
          await delay(BATCH_DELAY_MS);
        }
      }

      console.log(`[SCAN] ✅ Análisis completado: ${results.length} puntos`);

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
