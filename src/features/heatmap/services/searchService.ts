import type { HeatmapConfig, HeatmapResult, GridPoint } from '@/types';

const SERPER_API_KEY = import.meta.env.VITE_SERPER_API_KEY;

/**
 * Service to handle heatmap search logic using Serper.dev.
 */
export const searchService = {
  /**
   * Executes real ranking search for each point in the grid using Serper.dev.
   */
  async executeSearch(config: HeatmapConfig, points: GridPoint[]): Promise<HeatmapResult> {
    // Fallback if no API Key provided
    if (!SERPER_API_KEY || SERPER_API_KEY === 'your_serper_api_key_here') {
      await new Promise((resolve) => setTimeout(resolve, 2000));
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
      // Process all points in parallel for maximum speed
      const searchPromises = points.map(async (point) => {
        try {
          const response = await fetch('https://google.serper.dev/places', {
            method: 'POST',
            headers: {
              'X-API-KEY': SERPER_API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              q: config.keyword,
              location: `${point.lat}, ${point.lng}`,
              // type: "places" is implicit in the endpoint
              gl: 'co', // TODO: Make these dynamic based on user settings
              hl: 'es',
            }),
          });

          if (!response.ok) throw new Error('Serper API error');

          const data = await response.json();
          const placesResults = data.places || [];
          
          // Función para limpiar texto (quitar tildes y caracteres especiales)
          const normalize = (text: string) => 
            text.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Quita acentos
                .replace(/[^a-z0-9]/g, "");    // Deja solo letras y números

          const businessIndex = placesResults.findIndex((item: any) => {
            const itemTitle = normalize(item.title || "");
            const configName = normalize(config.businessName || "");
            
            const isMatch = itemTitle.includes(configName) || 
                            configName.includes(itemTitle) ||
                            (config.placeId && item.cid && config.placeId.includes(item.cid));

            return isMatch;
          });

          const rank = businessIndex !== -1 ? businessIndex + 1 : null;
          if (rank) console.log(`[SCAN] ✅ match! punto (${point.lat}, ${point.lng}) -> Posición: ${rank}`);

          return {
            ...point,
            rank,
            totalResults: placesResults.length,
          };
        } catch (err) {
          console.error(`Error scanning point at ${point.lat}, ${point.lng}:`, err);
          return { ...point, rank: null, totalResults: 0 };
        }
      });

      const results = await Promise.all(searchPromises);

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
