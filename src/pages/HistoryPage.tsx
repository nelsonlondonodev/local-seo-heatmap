import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerList, fadeInUp } from '@/config/animations';
import { useNavigate } from 'react-router-dom';
import { History, Search, Calendar, MapPin, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { useHeatmaps } from '@/hooks';
import { ConfirmDeleteModal } from '@/components/shared/ConfirmDeleteModal';
import { HeatmapThumbnail } from '@/features/heatmap/components/ui/HeatmapThumbnail';
import { cn } from '@/lib/utils';

import type { Database } from '@/types/database';
import { isResultsSummary, safeCastArray } from '@/util/mappers';

type HeatmapRecord = Database['public']['Tables']['heatmaps']['Row'];

function getRankVariant(rank: number | null): 'default' | 'secondary' | 'destructive' {
  if (rank === null) return 'secondary';
  if (rank <= 3) return 'default';
  if (rank <= 10) return 'secondary';
  return 'destructive';
}

export function HistoryPage() {
  const navigate = useNavigate();
  const { history, isLoading, deleteHeatmap, isDeleting } = useHeatmaps();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
    navigate('/result', { state: { heatmap: entry } });
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCompare = () => {
    if (selectedIds.length !== 2) return;
    const h1 = history.find(h => h.id === selectedIds[0]);
    const h2 = history.find(h => h.id === selectedIds[1]);
    navigate('/result', { state: { heatmap: h1, compareWith: h2 } });
  };

  return (
    <motion.div variants={staggerList} initial="hidden" animate="visible" className="space-y-8 pb-24">
      {/* Header Section */}
      <motion.div variants={fadeInUp} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white italic uppercase">
            Archivo de Inteligencia
          </h1>
          <p className="text-zinc-400 font-medium">
            Historial de auditorías y comparativas estratégicas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-bold">
            {history.length} {history.length === 1 ? 'Análisis' : 'Análisis'}
          </Badge>
        </div>
      </motion.div>

      {/* Main List Section */}
      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl bg-zinc-900" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-800 p-20 text-center bg-zinc-950/50">
          <div className="h-16 w-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6">
            <History className="h-8 w-8 text-zinc-700" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Sin registros activos</h3>
          <p className="mb-8 text-zinc-400 max-w-xs text-sm">Empieza tu primer escaneo desde el dashboard para generar inteligencia local.</p>
          <Button onClick={() => navigate('/dashboard')} className="font-bold">
            Ir al Dashboard
          </Button>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {history.map((entry) => {
            const summary = isResultsSummary(entry.results_summary) ? entry.results_summary : { avgRank: 0, bestRank: null, foundCount: 0, totalCount: 0 };
            const advertisers = safeCastArray<string>(entry.advertisers);
            const points = safeCastArray<any>(entry.points);
            const isSelected = selectedIds.includes(entry.id);
            
            return (
              <motion.div key={entry.id} variants={fadeInUp} className="group">
                <Card className={cn(
                  "relative transition-all duration-300 border-zinc-800 bg-zinc-950/40 backdrop-blur-sm hover:bg-zinc-900/60 hover:border-primary/40 overflow-hidden",
                  isSelected ? "ring-2 ring-primary border-primary bg-primary/5" : ""
                )}>
                  <CardContent className="p-0">
                    <div className="flex items-stretch">
                      {/* Selection Strip */}
                      <div className="flex items-center justify-center px-5 border-r border-zinc-800/50 bg-zinc-950/20">
                        <Checkbox 
                          checked={isSelected} 
                          onCheckedChange={() => toggleSelection(entry.id)}
                          className="h-5 w-5 border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </div>

                      <div className="flex flex-1 flex-col sm:flex-row items-center gap-6 p-5">
                        {/* Thumbnail View */}
                        <div className="shrink-0 cursor-pointer" onClick={() => handleViewDetails(entry)}>
                          <HeatmapThumbnail points={points} gridSize={entry.grid_size} />
                        </div>

                        <div className="flex-1 space-y-3 min-w-0 w-full">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 cursor-pointer group-hover:text-primary transition-colors" onClick={() => handleViewDetails(entry)}>
                              <Search className="h-4 w-4 text-primary" />
                              <span className="font-black text-lg tracking-tight truncate uppercase italic">{entry.keyword}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Badge variant={getRankVariant(summary.bestRank)} className="font-black text-[10px] h-6 px-2 min-w-[3rem] justify-center">
                                #{summary.bestRank || '-'}
                              </Badge>
                              <Badge variant={getRankVariant(Math.round(summary.avgRank || 0))} className="font-black text-[10px] h-6 px-2 min-w-[3.5rem] justify-center">
                                #{summary.avgRank?.toFixed(1) || '-'}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            <span className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-zinc-700" />
                              {entry.business_name}
                            </span>
                            <span className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-zinc-700" />
                              {new Date(entry.created_at).toLocaleDateString('es-ES', { 
                                day: '2-digit', month: 'short', year: 'numeric'
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {entry.prospect_name && (
                              <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase tracking-widest px-2 h-5">
                                Lead: {entry.prospect_name}
                              </Badge>
                            )}
                            {advertisers.length > 0 && (
                              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] font-black uppercase tracking-widest px-2 h-5">
                                {advertisers.length} Ads Detectados
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-zinc-800/50">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="flex-1 sm:flex-none h-10 px-5 font-black text-[10px] uppercase tracking-widest shadow-lg"
                            onClick={() => handleViewDetails(entry)}
                          >
                            Resultados
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            disabled={isDeleting}
                            onClick={() => handleDelete(entry.id)}
                            className="h-10 w-10 text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
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

      {/* Floating Compare Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: 100, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg"
          >
            <div className="bg-zinc-950/90 border border-primary/30 px-6 py-4 rounded-3xl shadow-[0_20px_50px_-15px_rgba(var(--primary-rgb),0.3)] flex items-center justify-between gap-4 backdrop-blur-2xl">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-0.5">Modo Comparativo</span>
                  <span className="text-xs font-bold text-zinc-300">
                    {selectedIds.length === 2 
                      ? "¡Listos para comparar!" 
                      : `Selecciona ${2 - selectedIds.length} más`}
                  </span>
               </div>
               <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white"
                    onClick={() => setSelectedIds([])}
                  >
                    Limpiar
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest h-10 px-6 rounded-xl"
                    disabled={selectedIds.length !== 2}
                    onClick={handleCompare}
                  >
                    Ver Comparativa
                  </Button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDeleteModal 
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
        title="¿Eliminar este análisis?"
        description={
          <>
            ¿Estás seguro de que quieres eliminar este análisis? Esta acción es <span className="text-destructive font-bold">irreversible</span> y los datos se perderán de tu historial.
          </>
        }
        confirmText="Sí, eliminar permanentemente"
        loadingText="Eliminando..."
      />
    </motion.div>
  );
}
