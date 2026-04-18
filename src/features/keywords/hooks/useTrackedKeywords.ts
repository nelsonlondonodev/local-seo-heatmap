import { useState, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { keywordPersistenceService } from '../services/keywordPersistenceService';
import { dataForSeoService } from '../services/dataForSeoService';
import { toast } from 'sonner';
import type { TrackedKeyword } from '../types/keywords';
import type { SerpItem } from '../types/dataForSeo';

export function useTrackedKeywords(projectId: string) {
  const [keywords, setKeywords] = useState<TrackedKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const fetchKeywords = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const data = await keywordPersistenceService.getProjectKeywords(projectId);
      setKeywords(data);
    } catch (error) {
      logger.error('[USE_TRACKED_KEYWORDS] Error fetching:', error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const updateRank = async (keywordId: string, keyword: string, locationCode: number, targetUrl: string) => {
    if (!targetUrl) {
      toast.warning('El proyecto no tiene una URL configurada para rastrear.');
      return;
    }

    setIsUpdating(keywordId);
    try {
      // 1. Fetch real-time SERP
      const serpItems = await dataForSeoService.getSerpResults(keyword, locationCode);
      
      // 2. Find target URL in results
      // Simple match logic: check if targetUrl is contained in result URL
      const cleanTarget = targetUrl.toLowerCase().replace('https://', '').replace('http://', '').replace('www.', '');
      const match = serpItems.find((item: SerpItem) => 
        item.url?.toLowerCase().includes(cleanTarget) || 
        item.domain?.toLowerCase().includes(cleanTarget)
      );

      const rank = match ? match.rank_absolute : null;

      // 3. Save to history
      await keywordPersistenceService.saveRankEntry(keywordId, rank);
      
      toast.success(`Ranking actualizado para "${keyword}": ${rank || 'No encontrado'}`);
      
      // 4. Refresh list
      await fetchKeywords();
    } catch (error) {
      logger.error('[USE_TRACKED_KEYWORDS] Error updating rank:', error);
      toast.error('Error al actualizar el ranking.');
    } finally {
      setIsUpdating(null);
    }
  };

  return {
    keywords,
    isLoading,
    isUpdating,
    fetchKeywords,
    updateRank
  };
}
