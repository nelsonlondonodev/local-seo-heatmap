import type { HeatmapConfig, HeatmapResult, GridPoint } from '@/types';

const STORAGE_KEY = 'mapranker_history';

/**
 * Service to handle heatmap search logic.
 * Currently uses simulated data and localStorage for persistence.
 */
export const searchService = {
  /**
   * Simulates a grid search for ranking data.
   * In the future, this will call Google Places API or an Edge Function.
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

    // 3. Save to local storage
    this.saveToHistory(result);

    return result;
  },

  /**
   * Persists a search result to the local history.
   */
  saveToHistory(result: HeatmapResult): void {
    const history = this.getHistory();
    history.unshift(result); // Add to the beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50))); // Keep last 50
  },

  /**
   * Retrieves the full search history from localStorage.
   */
  getHistory(): HeatmapResult[] {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse history', e);
      return [];
    }
  },

  /**
   * Clears the entire search history.
   */
  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};
