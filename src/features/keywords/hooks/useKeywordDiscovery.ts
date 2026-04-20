import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { dataForSeoService } from '../services/dataForSeoService';
import { keywordPersistenceService } from '../services/keywordPersistenceService';
import type { KeywordSuggestion } from '../types/dataForSeo';

const CACHE_KEY_PREFIX = 'kw_discovery_cache_';

export function useKeywordDiscovery(selectedProjectId: string) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<KeywordSuggestion[]>([]);
  const [savedKeywords, setSavedKeywords] = useState<Set<string>>(new Set());

  // Local state persistence & DB sync
  useEffect(() => {
    if (!selectedProjectId) {
      setQuery('');
      setResults([]);
      setSavedKeywords(new Set());
      return;
    }

    // 1. Sync saved keywords from DB
    const syncSavedKeywords = async () => {
      try {
        const tracked = await keywordPersistenceService.getProjectKeywords(selectedProjectId);
        const mapped = new Set(tracked.map(t => t.keyword.toLowerCase()));
        setSavedKeywords(mapped);
      } catch (err) {
        logger.error('[KW_DISCOVERY] Error syncing tracked keywords:', err);
      }
    };
    syncSavedKeywords();

    // 2. Load cached search results
    const cacheKey = `${CACHE_KEY_PREFIX}${selectedProjectId}`;
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (parsed.query && parsed.results) {
          setQuery(parsed.query);
          setResults(parsed.results);
        }
      } catch (err) {
        logger.error('[KW_DISCOVERY] Error parsing cache:', err);
      }
    } else {
      setQuery('');
      setResults([]);
    }
  }, [selectedProjectId]);

  const searchKeywords = async (locationCode?: number) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setResults([]);
    try {
      const data = await dataForSeoService.getKeywordSuggestions(query, locationCode);
      setResults(data);
      if (data.length === 0) {
        toast.info('No se encontraron sugerencias.');
      } else if (selectedProjectId) {
        // Save to cache
        const cacheKey = `${CACHE_KEY_PREFIX}${selectedProjectId}`;
        sessionStorage.setItem(cacheKey, JSON.stringify({ query, results: data }));
      }
    } catch (error) {
      logger.error('[KW_DISCOVERY] Error searching:', error);
      toast.error('Error al realizar la búsqueda.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveKeyword = async (keyword: string) => {
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
  };

  return {
    query,
    setQuery,
    results,
    isLoading,
    savedKeywords,
    searchKeywords,
    saveKeyword
  };
}
