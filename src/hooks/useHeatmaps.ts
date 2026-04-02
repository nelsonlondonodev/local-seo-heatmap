import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { heatmapService } from '@/services/heatmapService';
import { useAuth } from '@/features/auth';
import type { HeatmapResult } from '@/types';
import { toast } from 'sonner';

/**
 * Custom hook to manage heatmap history using TanStack Query.
 * Handles fetching, saving, and deleting heatmaps from Supabase.
 */
export function useHeatmaps() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  // 1. Query to fetch the full history from the cloud
  const historyQuery = useQuery({
    queryKey: ['heatmaps', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return heatmapService.getUserHeatmaps(user.id);
    },
    enabled: !!user?.id,
    placeholderData: (previousData) => previousData, // Smooth transitions
  });

  // 2. Mutation to persist a new scan result
  const saveMutation = useMutation({
    mutationFn: async (result: HeatmapResult) => {
      if (!user?.id) throw new Error('User not authenticated');
      return heatmapService.saveHeatmap(result, user.id, profile?.agency_id);
    },
    onSuccess: () => {
      // Refresh the list immediately
      queryClient.invalidateQueries({ queryKey: ['heatmaps', user?.id] });
      toast.success('Escaneo guardado en tu historial');
    },
    onError: (error: any) => {
      console.error('[USE_HEATMAPS] Save Error:', error);
      toast.error(`Error al guardar: ${error.message || 'Error desconocido'}`);
    },
  });

  // 3. Mutation to delete a scan
  const deleteMutation = useMutation({
    mutationFn: (id: string) => heatmapService.deleteHeatmap(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heatmaps', user?.id] });
      toast.success('Escaneo eliminado permanentemente');
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar: ${error.message}`);
    },
  });

  return {
    history: historyQuery.data || [],
    isLoading: historyQuery.isLoading,
    isRefetching: historyQuery.isRefetching,
    error: historyQuery.error,
    
    // Mutations
    saveHeatmap: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    
    deleteHeatmap: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    
    // Actions
    refreshHistory: historyQuery.refetch,
  };
}
