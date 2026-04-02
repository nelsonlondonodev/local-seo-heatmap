import type { HeatmapConfig, HeatmapResult, GridPoint } from '@/types';

/**
 * Service to handle heatmap search logic.
 * Currently uses simulated data for analysis.
 * Google Places API or Edge Functions will be integrated here in the future.
 */
export const searchService = {
  /**
   * Simulates a grid search for ranking data.
   */
  async executeSearch(config: HeatmapConfig, points: GridPoint[]): Promise<HeatmapResult> {
    // 1. Simulate a delay (UX: "doing something")
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 2. Generate random rankings for each point (Simulated results)
    const results: GridPoint[] = points.map((p) => {
      // Chance of not finding the business (e.g., lower rank or null)
      const rank = Math.random() > 0.1 ? Math.floor(Math.random() * 20) + 1 : null;
      return {
        ...p,
        rank,
        totalResults: rank ? rank + Math.floor(Math.random() * 50) : 0,
      };
    });

    const result: HeatmapResult = {
      id: crypto.randomUUID(),
      config,
      points: results,
      createdAt: new Date().toISOString(),
    };

    return result;
  },
};
