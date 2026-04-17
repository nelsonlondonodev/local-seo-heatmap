import { useState } from 'react';
import { toast } from 'sonner';
import { dataForSeoService } from '../services/dataForSeoService';
import { keywordPersistenceService } from '../services/keywordPersistenceService';
import type { KeywordSuggestion } from '../types/dataForSeo';

export function useKeywordDiscovery(selectedProjectId: string) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<KeywordSuggestion[]>([]);
  const [savedKeywords, setSavedKeywords] = useState<Set<string>>(new Set());

  const searchKeywords = async (locationCode?: number) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setResults([]);
    try {
      const data = await dataForSeoService.getKeywordSuggestions(query, locationCode);
      setResults(data);
      if (data.length === 0) {
        toast.info('No se encontraron sugerencias.');
      }
    } catch (error) {
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
      setSavedKeywords(prev => new Set(prev).add(keyword));
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
