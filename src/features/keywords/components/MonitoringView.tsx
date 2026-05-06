import { useEffect } from 'react';
import { useTrackedKeywords } from '../hooks/useTrackedKeywords';
import { BarChart, RefreshCcw, TrendingUp, AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { DeleteProjectModal } from './DeleteProjectModal';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { KeywordRankRow } from './KeywordRankRow';
import { ProjectSelector } from './ProjectSelector';
import { SiteSettingsCard } from './SiteSettingsCard';

import type { KeywordProject } from '../types/keywords';

interface MonitoringViewProps {
  projectId: string | null;
  onProjectSelect: (id: string | null) => void;
  projects: KeywordProject[];
  onProjectUpdate: (projectId: string, updates: Partial<KeywordProject>) => void;
  onProjectsRefresh: () => Promise<void>;
  onProjectDelete: (projectId: string) => Promise<void>;
}

export function MonitoringView({ 
  projectId, 
  onProjectSelect, 
  projects, 
  onProjectUpdate, 
  onProjectsRefresh,
  onProjectDelete
}: MonitoringViewProps) {
  const { 
    keywords, 
    staleKeywords,
    isLoading, 
    isUpdating, 
    fetchKeywords, 
    updateRank,
    updateStaleKeywords,
    deleteKeyword
  } = useTrackedKeywords(projectId);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [keywordToDelete, setKeywordToDelete] = useState<{ id: string, keyword: string } | null>(null);
  const [isDeletingKeyword, setIsDeletingKeyword] = useState(false);
  
  const currentProject = projects.find(p => p.id === projectId);

  useEffect(() => {
    if (projectId) {
      void fetchKeywords();
    }
  }, [projectId, fetchKeywords]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Project Selector - Always visible */}
      <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-md rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-brand-primary/10">
              <TrendingUp className="h-6 w-6 text-brand-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Seleccionar Proyecto para Monitoreo</h3>
              <ProjectSelector 
                selectedProjectId={projectId}
                onProjectSelect={onProjectSelect}
                projects={projects}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {!projectId ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-brand-primary/10 flex items-center justify-center">
            <BarChart className="h-10 w-10 text-brand-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Sin proyecto seleccionado</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Selecciona un proyecto arriba para ver sus keywords en seguimiento o ve a la pestaña de Descubrimiento para añadir nuevas.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{currentProject?.name}</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Ubicación Base: <span className="text-brand-primary font-medium">{currentProject?.location_name || 'No definida'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => fetchKeywords()} 
            disabled={isLoading}
            className="rounded-xl border-2 hover:bg-brand-primary/10"
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refrescar Rankings
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsDeleting(true)}
            title="Eliminar Proyecto"
            className="rounded-xl border-2 border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DeleteProjectModal 
        isOpen={isDeleting}
        onOpenChange={setIsDeleting}
        projectName={currentProject?.name || ''}
        onConfirm={async () => {
          if (projectId) {
            await onProjectDelete(projectId);
          }
        }}
      />

      <SiteSettingsCard 
        key={projectId}
        projectId={projectId}
        initialUrl={currentProject?.target_url}
        onUpdate={(newUrl) => {
          if (projectId) {
            onProjectUpdate(projectId, { target_url: newUrl });
          }
          void fetchKeywords();
          void onProjectsRefresh();
        }}
      />

      {/* Smart Banner for Stale Keywords */}
      {staleKeywords.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-full shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-amber-700 dark:text-amber-500 text-sm">Datos Desactualizados</h4>
              <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                Tienes {staleKeywords.length} palabra(s) clave que no se escanean desde hace más de 7 días.
              </p>
            </div>
          </div>
          <Button 
            onClick={() => updateStaleKeywords(currentProject?.location_code || 0, currentProject?.target_url || '')}
            disabled={isUpdating !== null}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 shrink-0 font-bold"
          >
            {isUpdating ? 'Actualizando...' : 'Actualizar Ahora'}
          </Button>
        </div>
      )}

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
                      onDelete={() => setKeywordToDelete({ id: kw.id, keyword: kw.keyword })}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
        </>
      )}

      {/* Delete Keyword Confirmation Modal */}
      <Dialog open={!!keywordToDelete} onOpenChange={(open) => !open && setKeywordToDelete(null)}>
        <DialogContent className="sm:max-w-[400px] border-none shadow-2xl p-0 overflow-hidden rounded-[2rem]">
          <div className="bg-destructive/5 p-8 pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive animate-in zoom-in duration-300">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-center text-foreground tracking-tight">¿Dejar de rastrear?</DialogTitle>
              <DialogDescription className="text-center text-muted-foreground pt-3 font-medium leading-relaxed px-2">
                ¿Estás seguro de eliminar <span className="text-foreground font-bold">"{keywordToDelete?.keyword}"</span>? Se borrará todo el historial de posiciones de esta palabra clave.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <DialogFooter className="p-8 pt-4 flex flex-col gap-3 sm:flex-col sm:space-x-0">
            <Button
              className="w-full rounded-2xl h-14 font-black text-base bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={async () => {
                if (keywordToDelete) {
                  setIsDeletingKeyword(true);
                  try {
                    await deleteKeyword(keywordToDelete.id);
                    setKeywordToDelete(null);
                  } finally {
                    setIsDeletingKeyword(false);
                  }
                }
              }}
              disabled={isDeletingKeyword}
            >
              {isDeletingKeyword ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Sí, eliminar palabra clave'
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setKeywordToDelete(null)}
              className="w-full rounded-2xl h-14 font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
              disabled={isDeletingKeyword}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
