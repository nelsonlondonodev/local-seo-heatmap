import { useQuery } from '@tanstack/react-query';
import { heatmapService } from '@/services/heatmapService';

/**
 * Hook to fetch historical ranking data for a business and keyword.
 */
export function useRankingHistory(placeId?: string, keyword?: string) {
  return useQuery({
    queryKey: ['ranking-history', placeId, keyword],
    queryFn: async () => {
      if (!placeId || !keyword) return [];
      return heatmapService.getRankingHistory(placeId, keyword);
    },
    enabled: !!placeId && !!keyword,
  });
}
