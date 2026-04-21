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
      return data; // Return data for immediate use in auto-update logic
    } catch (error) {
      logger.error('[USE_TRACKED_KEYWORDS] Error fetching:', error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const updateRank = useCallback(async (keywordId: string, keyword: string, locationCode: number, targetUrl: string, silent = false) => {
    if (!targetUrl) {
      if (!silent) toast.warning('El proyecto no tiene una URL configurada para rastrear.');
      return;
    }

    setIsUpdating(keywordId);
    try {
      const serpItems = await dataForSeoService.getSerpResults(keyword, locationCode);
      const cleanTarget = targetUrl.toLowerCase().replace('https://', '').replace('http://', '').replace('www.', '');
      const match = serpItems.find((item: SerpItem) => 
        item.url?.toLowerCase().includes(cleanTarget) || 
        item.domain?.toLowerCase().includes(cleanTarget)
      );

      const rank = match ? match.rank_absolute : null;
      await keywordPersistenceService.saveRankEntry(keywordId, rank);
      
      if (!silent) toast.success(`Ranking actualizado para "${keyword}": ${rank || 'No encontrado'}`);
      
      await fetchKeywords();
    } catch (error) {
      logger.error('[USE_TRACKED_KEYWORDS] Error updating rank:', error);
      if (!silent) toast.error('Error al actualizar el ranking.');
    } finally {
      setIsUpdating(null);
    }
  }, [fetchKeywords]);

  /**
   * Automatically updates rankings that are older than 3 days or haven't been tracked yet.
   */
  const autoUpdateIfStale = useCallback(async (data: TrackedKeyword[], locationCode: number, targetUrl: string) => {
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const staleKeywords = data.filter(kw => {
      const lastUpdate = kw.latest_history ? new Date(kw.latest_history.created_at).getTime() : 0;
      return (now - lastUpdate) > THREE_DAYS_MS;
    });

    if (staleKeywords.length > 0) {
      toast.info(`Detectadas ${staleKeywords.length} keywords para actualización automática...`);
      
      // Update sequentially to manage API load
      for (const kw of staleKeywords) {
        await updateRank(kw.id, kw.keyword, locationCode, targetUrl, true);
      }
      
      toast.success('Actualización automática completada.');
    }
  }, [updateRank]);

  return {
    keywords,
    isLoading,
    isUpdating,
    fetchKeywords,
    updateRank,
    autoUpdateIfStale
  };
}
