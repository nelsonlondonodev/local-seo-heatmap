import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { dataForSeoService } from '../services/dataForSeoService';
import { keywordPersistenceService } from '../services/keywordPersistenceService';
import type { KeywordSuggestion } from '../types/dataForSeo';

const CACHE_KEY_PREFIX = 'kw_discovery_cache_';
const DEFAULT_LOCATION_CODE = 2840; // US

export function useKeywordDiscovery(selectedProjectId: string) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<KeywordSuggestion[]>([]);
  const [savedKeywords, setSavedKeywords] = useState<Set<string>>(new Set());

  /**
   * Synchronizes the set of already tracked keywords from the database.
   */
  const syncTrackedKeywords = useCallback(async () => {
    if (!selectedProjectId) return;
    
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
    if (!selectedProjectId) {
      setQuery('');
      setResults([]);
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

  /**
   * Automatically adds the search term as a tracked keyword for the project.
   */
  const autoSaveSeedKeyword = async (projectId: string, keyword: string) => {
    try {
      await keywordPersistenceService.addKeyword(projectId, keyword);
      setSavedKeywords(prev => new Set(prev).add(keyword.toLowerCase()));
      logger.info('[KW_DISCOVERY] Seed keyword auto-saved');
    } catch (err) {
      // Key already exists or silent failure, no toast for auto-save
    }
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
        await autoSaveSeedKeyword(selectedProjectId, query);
      }
    } catch (error) {
      logger.error('[KW_DISCOVERY] Error searching:', error);
      toast.error('Error al realizar la búsqueda.');
    } finally {
      setIsLoading(false);
    }
  }, [query, selectedProjectId]);

  const saveKeyword = useCallback(async (keyword: string) => {
    if (!selectedProjectId) {
      toast.warning('Selecciona un proyecto primero.');
      return;
    }

    try {
      await keywordPersistenceService.addKeyword(selectedProjectId, keyword);
      setSavedKeywords(prev => new Set(prev).add(keyword.toLowerCase()));
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

