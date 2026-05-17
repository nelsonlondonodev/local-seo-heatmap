import { useState, useCallback, useRef } from 'react';
import { logger } from '@/lib/logger';
import { keywordPersistenceService } from '../services/keywordPersistenceService';
import { dataForSeoService } from '../services/dataForSeoService';
import { toast } from 'sonner';
import type { TrackedKeyword } from '../types/keywords';
import type { SerpItem } from '../types/dataForSeo';

export function useTrackedKeywords(projectId: string | null) {
  const [keywords, setKeywords] = useState<TrackedKeyword[]>([]);
  const [staleKeywords, setStaleKeywords] = useState<TrackedKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  
  const isUpdatingRef = useRef<Record<string, boolean>>({});
  const isUpdatingStaleRef = useRef(false);

  const fetchKeywords = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const data = await keywordPersistenceService.getProjectKeywords(projectId);
      setKeywords(data);
      
      // Calcular pasivamente cuáles están desactualizadas (ej. > 7 días)
      const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      const stale = data.filter(kw => {
        const lastUpdate = kw.latest_history ? new Date(kw.latest_history.created_at).getTime() : 0;
        return (now - lastUpdate) > SEVEN_DAYS_MS;
      });
      setStaleKeywords(stale);

      return data;
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

    // Synchronously guard individual rank updates
    if (isUpdating === keywordId || isUpdatingRef.current[keywordId]) {
      return;
    }

    isUpdatingRef.current[keywordId] = true;
    setIsUpdating(keywordId);
    try {
      // DataForSEO fails if location_code is 0. Fallback to Spain (2724) if project has no location.
      const finalLocationCode = locationCode || 2724; 
      const serpItems = await dataForSeoService.getSerpResults(keyword, finalLocationCode);
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
      isUpdatingRef.current[keywordId] = false;
    }
  }, [isUpdating, fetchKeywords]);

  /**
   * Actualiza masivamente las keywords desactualizadas, disparado manualmente por el usuario.
   */
  const updateStaleKeywords = useCallback(async (locationCode: number, targetUrl: string) => {
    if (staleKeywords.length === 0 || isUpdatingStaleRef.current) return;

    isUpdatingStaleRef.current = true;
    toast.info(`Iniciando actualización de ${staleKeywords.length} palabras clave...`);
    
    try {
      // Update sequentially to manage API load
      for (const kw of staleKeywords) {
        await updateRank(kw.id, kw.keyword, locationCode, targetUrl, true);
      }
      
      toast.success('Actualización masiva completada.');
    } catch (error) {
      logger.error('[USE_TRACKED_KEYWORDS] Error mass updating stale keywords:', error);
    } finally {
      isUpdatingStaleRef.current = false;
    }
    // staleKeywords will be updated implicitly via the fetchKeywords call inside updateRank
  }, [staleKeywords, updateRank]);

  const deleteKeyword = useCallback(async (keywordId: string) => {
    try {
      await keywordPersistenceService.deleteTrackedKeyword(keywordId);
      toast.success('Palabra clave eliminada del seguimiento');
      await fetchKeywords();
      return true;
    } catch (error) {
      toast.error('No se pudo eliminar la palabra clave');
      return false;
    }
  }, [fetchKeywords]);

  return {
    keywords,
    staleKeywords,
    isLoading,
    isUpdating,
    fetchKeywords,
    updateRank,
    updateStaleKeywords,
    deleteKeyword
  };
}
