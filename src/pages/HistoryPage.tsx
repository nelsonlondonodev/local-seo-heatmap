import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { History, Search, Calendar, Grid3X3, MapPin, Trash2, ExternalLink, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useHeatmaps } from '@/hooks';

import type { Database } from '@/types/database';

type HeatmapRecord = Database['public']['Tables']['heatmaps']['Row'];

const containerVariants = { 
  hidden: { opacity: 0 }, 
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } } 
};

const itemVariants = { 
  hidden: { opacity: 0, y: 12 }, 
  visible: { opacity: 1, y: 0 } 
};

function getRankVariant(rank: number | null): 'default' | 'secondary' | 'destructive' {
  if (rank === null) return 'secondary';
  if (rank <= 3) return 'default';
  if (rank <= 7) return 'secondary';
  return 'destructive';
}

export function HistoryPage() {
  const navigate = useNavigate();
  const { history, isLoading, deleteHeatmap, isDeleting } = useHeatmaps();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setIdToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;
    try {
      await deleteHeatmap(idToDelete);
      setDeleteConfirmOpen(false);
      setIdToDelete(null);
    } catch (error) {
      console.error('Error deleting heatmap:', error);
    }
  };

  const handleViewDetails = (entry: HeatmapRecord) => {
    // Navigate to dashboard passing the heatmap data in the state
    navigate('/dashboard', { state: { heatmap: entry } });
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Historial de Búsquedas</h1>
          <p className="text-muted-foreground">Revisa y compara tus análisis guardados en la nube</p>
        </div>
        <Badge variant="outline" className="w-fit gap-1">
          <History className="h-3 w-3" />
          {history.length} {history.length === 1 ? 'búsqueda' : 'búsquedas'}
        </Badge>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
          <History className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <h3 className="text-lg font-semibold">No hay búsquedas aún</h3>
          <p className="mb-6 text-sm text-muted-foreground">Realiza tu primer análisis desde el panel principal.</p>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Ir al Dashboard
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => {
            const summary = (entry.results_summary as unknown as { avgRank: number; bestRank: number | null }) || { avgRank: 0, bestRank: null };
            
            return (
              <motion.div key={entry.id} variants={itemVariants}>
                <Card className="transition-all hover:border-primary/30 hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{entry.keyword}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {entry.business_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Grid3X3 className="h-3 w-3" />
                            {entry.grid_size} • {entry.radius_km} km
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(entry.created_at).toLocaleDateString('es-ES', { 
                              day: '2-digit', 
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 border-r pr-4">
                          <div className="text-center sm:text-right">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Mejor</p>
                            <Badge variant={getRankVariant(summary.bestRank)}>
                              #{summary.bestRank || 'N/A'}
                            </Badge>
                          </div>
                          <div className="text-center sm:text-right">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Promedio</p>
                            <Badge variant={getRankVariant(Math.round(summary.avgRank || 0))}>
                              #{summary.avgRank?.toFixed(1) || '0.0'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => handleViewDetails(entry)}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Ver en Mapa</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            disabled={isDeleting}
                            onClick={() => handleDelete(entry.id)}
                            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[400px] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-destructive/5 p-6 pb-0">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive animate-in zoom-in duration-300">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-primary">Confirmar eliminación</DialogTitle>
              <DialogDescription className="text-center text-muted-foreground pt-2">
                ¿Estás seguro de que quieres eliminar este análisis? Esta acción es <span className="text-destructive font-bold">irreversible</span> y los datos se perderán de tu historial.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <DialogFooter className="p-6 pt-8 flex sm:flex-col gap-3">
            <Button
              className="w-full rounded-xl h-12 font-bold text-base bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all active:scale-[0.98]"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Sí, eliminar permanentemente'
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmOpen(false)}
              className="w-full rounded-xl h-12 font-semibold text-muted-foreground hover:bg-secondary transition-all"
              disabled={isDeleting}
            >
              No, mantener análisis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
