import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { dataForSeoService } from '../services/dataForSeoService';
import { keywordPersistenceService } from '../services/keywordPersistenceService';
import type { KeywordSuggestion } from '../types/dataForSeo';

const CACHE_KEY_PREFIX = 'kw_discovery_cache_';
const DEFAULT_LOCATION_CODE = 2840; // US

export function useKeywordDiscovery(selectedProjectId: string | null) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<KeywordSuggestion[]>([]);
  const [savedKeywords, setSavedKeywords] = useState<Set<string>>(new Set());

  /**
   * Synchronizes the set of already tracked keywords from the database.
   */
  const syncTrackedKeywords = useCallback(async () => {
    if (!selectedProjectId) {
      setSavedKeywords(new Set());
      return;
    }
    
    try {
      const tracked = await keywordPersistenceService.getProjectKeywords(selectedProjectId);
      const mapped = new Set(tracked.map(t => t.keyword.toLowerCase()));
      setSavedKeywords(mapped);
    } catch (err) {
      logger.error('[KW_DISCOVERY] Error syncing tracked keywords:', err);
    }
  }, [selectedProjectId]);

  /**
   * Handles UI reset when project changes (Clean Workbench requirement).
   */
  useEffect(() => {
    // If no project is selected, we just clear the saved keywords set
    if (!selectedProjectId) {
      setSavedKeywords(new Set());
      return;
    }

    syncTrackedKeywords();
    
    // Reset query and results for a fresh start on each project change
    setQuery('');
    setResults([]);
  }, [selectedProjectId, syncTrackedKeywords]);

  /**
   * Updates the session storage cache for search results.
   */
  const updateSearchCache = (projectId: string, searchTerm: string, data: KeywordSuggestion[]) => {
    const cacheKey = `${CACHE_KEY_PREFIX}${projectId}`;
    sessionStorage.setItem(cacheKey, JSON.stringify({ query: searchTerm, results: data }));
  };

  const searchKeywords = useCallback(async (locationCode?: number) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setResults([]);
    
    try {
      const data = await dataForSeoService.getKeywordSuggestions(
        query, 
        locationCode || DEFAULT_LOCATION_CODE
      );
      
      setResults(data);
      
      if (data.length === 0) {
        toast.info('No se encontraron sugerencias.');
      } else if (selectedProjectId) {
        updateSearchCache(selectedProjectId, query, data);
        // Removed autoSaveSeedKeyword to favor manual research flow
      }
    } catch (error) {
      logger.error('[KW_DISCOVERY] Error searching:', error);
      toast.error('Error al realizar la búsqueda.');
    } finally {
      setIsLoading(false);
    }
  }, [query, selectedProjectId]);

  const saveKeyword = useCallback(async (keyword: string, targetProjectId?: string) => {
    const projectId = targetProjectId || selectedProjectId;
    
    if (!projectId) {
      toast.warning('Selecciona un proyecto para guardar la palabra clave.');
      return;
    }

    try {
      await keywordPersistenceService.addKeyword(projectId, keyword);
      
      // Only update local set if it matches the current selected project
      if (projectId === selectedProjectId) {
        setSavedKeywords(prev => new Set(prev).add(keyword.toLowerCase()));
      }
      
      toast.success(`"${keyword}" añadida.`);
    } catch (error) {
      toast.error('La palabra clave ya está en seguimiento.');
    }
  }, [selectedProjectId]);

  const clearResults = useCallback(() => {
    setResults([]);
    setQuery('');
    if (selectedProjectId) {
      const cacheKey = `${CACHE_KEY_PREFIX}${selectedProjectId}`;
      sessionStorage.removeItem(cacheKey);
    }
  }, [selectedProjectId]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    savedKeywords,
    searchKeywords,
    saveKeyword,
    clearResults
  };
}

