import { useEffect } from 'react';
import { useTrackedKeywords } from '../hooks/useTrackedKeywords';
import { useProjects } from '../hooks/useProjects';
import { BarChart, RefreshCcw, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface MonitoringViewProps {
  projectId: string;
}

export function MonitoringView({ projectId }: MonitoringViewProps) {
  const { keywords, isLoading, isUpdating, fetchKeywords, updateRank } = useTrackedKeywords(projectId);
  const { projects } = useProjects();
  
  const currentProject = projects.find(p => p.id === projectId);

  useEffect(() => {
    if (projectId) {
      fetchKeywords();
    }
  }, [projectId, fetchKeywords]);

  const getRankChange = (change: number | null) => {
    if (!change || change === 0) return <Minus className="h-3 w-3 text-muted-foreground" />;
    if (change > 0) return (
      <div className="flex items-center gap-1 text-emerald-500 font-bold">
        <TrendingUp className="h-3 w-3" />
        <span>+{change}</span>
      </div>
    );
    return (
      <div className="flex items-center gap-1 text-rose-500 font-bold">
        <TrendingDown className="h-3 w-3" />
        <span>{change}</span>
      </div>
    );
  };

  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="h-20 w-20 rounded-full bg-brand-primary/10 flex items-center justify-center">
          <BarChart className="h-10 w-10 text-brand-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Sin proyecto seleccionado</h3>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Selecciona un proyecto en la pestaña de Descubrimiento para ver sus keywords en seguimiento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{currentProject?.name}</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Rastreando en: <span className="text-brand-primary font-medium">{currentProject?.location_name || 'Ubicación no definida'}</span>
            {currentProject?.target_url && (
              <>
                <span className="h-1 w-1 rounded-full bg-muted-foreground/30"></span>
                <span className="flex items-center gap-1">
                  {currentProject.target_url}
                  <ExternalLink className="h-3 w-3" />
                </span>
              </>
            )}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => fetchKeywords()} 
          disabled={isLoading}
          className="rounded-xl border-2 hover:bg-brand-primary/10"
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refrescar Lista
        </Button>
      </div>

      <Card className="border-none shadow-2xl bg-card/30 backdrop-blur-md rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-6 py-4 font-semibold text-sm">Palabra Clave</th>
                  <th className="px-6 py-4 font-semibold text-sm text-center">Posición Actual</th>
                  <th className="px-6 py-4 font-semibold text-sm text-center">Cambio</th>
                  <th className="px-6 py-4 font-semibold text-sm">Último Análisis</th>
                  <th className="px-6 py-4 font-semibold text-sm text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i}>
                      <td colSpan={5} className="px-6 py-4">
                        <Skeleton className="h-10 w-full rounded-xl" />
                      </td>
                    </tr>
                  ))
                ) : keywords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-20 text-center text-muted-foreground">
                      No hay palabras clave guardadas en este proyecto. 
                      Ve a la pestaña de "Descubrimiento" para añadir algunas.
                    </td>
                  </tr>
                ) : (
                  keywords.map((kw) => (
                    <tr key={kw.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-5">
                        <span className="font-bold text-foreground">{kw.keyword}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        {kw.latest_history?.rank ? (
                          <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-brand-primary">
                              #{kw.latest_history.rank}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                              Top 100
                            </span>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground border-none font-bold">
                            N/A
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {getRankChange(kw.latest_history?.rank_change)}
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm text-muted-foreground">
                          {kw.latest_history?.created_at 
                            ? new Date(kw.latest_history.created_at).toLocaleDateString() 
                            : 'Nunca'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-xl hover:bg-brand-primary hover:text-primary-foreground transition-all"
                          disabled={isUpdating === kw.id}
                          onClick={() => updateRank(
                            kw.id, 
                            kw.keyword, 
                            currentProject?.location_code || 0, 
                            currentProject?.target_url || ''
                          )}
                        >
                          <RefreshCcw className={`h-4 w-4 ${isUpdating === kw.id ? 'animate-spin' : ''}`} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
