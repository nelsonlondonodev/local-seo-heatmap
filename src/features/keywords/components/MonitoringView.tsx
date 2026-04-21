import { useEffect } from 'react';
import { useTrackedKeywords } from '../hooks/useTrackedKeywords';
import { useProjects } from '../hooks/useProjects';
import { BarChart, RefreshCcw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { KeywordRankRow } from './KeywordRankRow';
import { SiteSettingsCard } from './SiteSettingsCard';

interface MonitoringViewProps {
  projectId: string;
}

export function MonitoringView({ projectId }: MonitoringViewProps) {
  const { 
    keywords, 
    isLoading, 
    isUpdating, 
    fetchKeywords, 
    updateRank,
    autoUpdateIfStale 
  } = useTrackedKeywords(projectId);
  const { projects } = useProjects();
  
  const currentProject = projects.find(p => p.id === projectId);

  useEffect(() => {
    if (projectId) {
      fetchKeywords().then(data => {
        if (data && currentProject) {
          autoUpdateIfStale(
            data, 
            currentProject.location_code || 0, 
            currentProject.target_url || ''
          );
        }
      });
    }
  }, [projectId, fetchKeywords, autoUpdateIfStale, currentProject]);

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
            Ubicación Base: <span className="text-brand-primary font-medium">{currentProject?.location_name || 'No definida'}</span>
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => fetchKeywords()} 
          disabled={isLoading}
          className="rounded-xl border-2 hover:bg-brand-primary/10"
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refrescar Rankings
        </Button>
      </div>

      <SiteSettingsCard 
        projectId={projectId}
        projectName={currentProject?.name || ''}
        initialUrl={currentProject?.target_url}
        onUpdate={() => {
          // Re-fetch keywords and project data if needed
          fetchKeywords();
        }}
      />

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
                    <KeywordRankRow 
                      key={kw.id}
                      kw={kw}
                      isUpdating={isUpdating === kw.id}
                      onUpdate={() => updateRank(
                        kw.id, 
                        kw.keyword, 
                        currentProject?.location_code || 0, 
                        currentProject?.target_url || ''
                      )}
                    />
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
