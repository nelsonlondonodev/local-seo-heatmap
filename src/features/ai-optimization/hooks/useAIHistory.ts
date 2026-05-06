import { useEffect, useState } from 'react';
import { aiService } from '@/services/aiService';
import type { StoredAIContent } from '../types';
import { toast } from 'sonner';

/**
 * Hook to manage AI history fetching and filtering logic.
 */
export function useAIHistory(userId?: string) {
  const [history, setHistory] = useState<StoredAIContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadHistory = async () => {
    if (!userId) return;
    setIsLoading(true);
    const response = await aiService.getUserContentHistory(userId);
    if (response.data) {
      setHistory(response.data);
    } else {
      toast.error(response.error || 'Error al cargar el historial');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, [userId]);

  const filteredHistory = history.filter(item => 
    item.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteContent = async (contentId: string) => {
    const response = await aiService.deleteGeneratedContent(contentId);
    if (!response.error) {
      toast.success('Contenido eliminado');
      await loadHistory();
      return true;
    } else {
      toast.error(response.error);
      return false;
    }
  };

  return {
    filteredHistory,
    isLoading,
    searchTerm,
    setSearchTerm,
    refreshHistory: loadHistory,
    deleteContent
  };
}
