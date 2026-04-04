import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { History, Search, Calendar, Grid3X3, MapPin, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useHeatmaps } from '@/hooks';

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

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este análisis permanentemente? Esta acción no se puede deshacer.')) {
      try {
        await deleteHeatmap(id);
      } catch (error) {
        console.error('Error deleting heatmap:', error);
      }
    }
  };

  const handleViewDetails = (entry: any) => {
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
            const summary = (entry.results_summary as any) || { avgRank: 0, bestRank: null };
            
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
    </motion.div>
  );
}
