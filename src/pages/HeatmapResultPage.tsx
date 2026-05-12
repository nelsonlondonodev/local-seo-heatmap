import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { staggerContainer, fadeInUp } from '@/config/animations';
import { 
  MapPin, Search, Calendar, Grid3X3, ArrowLeft, Plus, 
  Printer, Target, Mail, Megaphone, CheckCircle2, 
  AlertCircle, Trophy, Trash2 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useHeatmaps } from '@/hooks';
import { ConfirmDeleteModal } from '@/components/shared/ConfirmDeleteModal';
import { HeatmapMap, HeatmapLegend } from '@/features/heatmap';
import { StatRow } from '@/features/heatmap/components/ui/StatRow';
import { SalesStrategyHub } from '@/features/heatmap/components/ui/SalesStrategyHub';
import { LocalDominanceGauge } from '@/features/heatmap/components/ui/LocalDominanceGauge';
import { LocalVisibilityGraph } from '@/features/heatmap/components/ui/LocalVisibilityGraph';
import { getRankColor } from '@/config/constants';
import { isAdvertiser } from '../features/heatmap/utils/textUtils';
import { useBranding } from '@/features/branding';
import { APP_CONFIG } from '@/config/constants';
import type { Database } from '@/types/database';
import { mapHeatmapToResult, isResultsSummary } from '@/util/mappers';

type HeatmapRecord = Database['public']['Tables']['heatmaps']['Row'];



export function HeatmapResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { config: branding } = useBranding();
  const { deleteHeatmap } = useHeatmaps();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const state = location.state as { heatmap?: HeatmapRecord } | null;
  const heatmap = state?.heatmap;

  const result = useMemo(() => heatmap ? mapHeatmapToResult(heatmap) : null, [heatmap]);

  if (!heatmap || !result) {
    return <Navigate to="/history" replace />;
  }

  const { config, points, advertisers, competitors, createdAt } = result;
  const center: [number, number] = [config.centerLat, config.centerLng];
  const summary = isResultsSummary(heatmap.results_summary) ? heatmap.results_summary : { avgRank: 0, bestRank: null, foundCount: 0, totalCount: 0 };
  const isTargetInAds = isAdvertiser(config.businessName, advertisers || []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Print-only Header */}
      <div className="print-only mb-10 border-b-4 border-primary pb-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-primary tracking-tighter">ESTUDIO DE VISIBILIDAD LOCAL</h1>
            <Badge variant="outline" className="text-primary border-primary/30 font-bold px-3">
              {branding.name} v{APP_CONFIG.version}
            </Badge>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Informe Confidencial</p>
            <p className="text-xs font-bold text-primary">{formatDate(heatmap.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Header UI */}
      <motion.div variants={fadeInUp} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8 -ml-2 rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Resultado del Análisis
            </h1>
            {heatmap.prospect_name && (
              <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-3 py-1 text-sm font-bold">
                <Target className="h-4 w-4" />
                AUDITORÍA DE PROSPECCIÓN
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground pl-8">
            Visualización estática de reporte guardado
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/history')}>
            Volver
          </Button>
          {import.meta.env.DEV && (
            <Button 
              variant="outline" 
              className="border-dashed border-primary/40 text-primary"
              onClick={async () => {
                const { supabase } = await import('@/lib/supabase');
                const currentSummary = summary;
                const mock = {
                  ...(heatmap as HeatmapRecord),
                  id: crypto.randomUUID(),
                  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                  results_summary: {
                    foundCount: currentSummary.foundCount,
                    totalCount: currentSummary.totalCount,
                    avgRank: (currentSummary.avgRank || 10) + 5,
                    bestRank: (currentSummary.bestRank || 5) + 2
                  }
                };
                const { error } = await supabase.from('heatmaps').insert(mock);
                if (error) alert('Error: ' + error.message);
                else {
                  alert('¡Dato histórico creado! Recarga la página.');
                  window.location.reload();
                }
              }}
            >
              🧪 Simular Historial
            </Button>
          )}
          <Button variant="secondary" onClick={() => window.print()} className="gap-2 font-semibold">
            <Printer className="h-4 w-4" />
            Imprimir Reporte
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setDeleteConfirmOpen(true)} 
            className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-bold"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
          <Button onClick={() => navigate('/dashboard')} className="gap-2 focus:ring-primary/20 transition-all font-bold">
            <Plus className="h-4 w-4" />
            Nuevo Análisis
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Info Sidebar */}
        <motion.div variants={fadeInUp} className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-lg">Resumen de Búsqueda</CardTitle>
              <CardDescription>Detalles del negocio y configuración</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                {heatmap.prospect_name && (
                  <StatRow 
                    icon={Target} 
                    label="Lead / Prospecto" 
                    value={heatmap.prospect_name} 
                    colorClass="bg-primary/20 text-primary border border-primary/20" 
                  />
                )}
                <StatRow 
                  icon={Search} 
                  label="Palabra Clave" 
                  value={config.keyword} 
                  colorClass="bg-primary/10 text-primary" 
                />
                <StatRow 
                  icon={MapPin} 
                  label="Negocio Objetivo" 
                  value={config.businessName} 
                  colorClass="bg-emerald-500/10 text-emerald-500" 
                />
                <StatRow 
                  icon={Grid3X3} 
                  label="Parámetros de Grid" 
                  value={`${config.gridSize} Puntos • Radio: ${config.radiusKm} km`} 
                  colorClass="bg-blue-500/10 text-blue-500" 
                />
                <StatRow 
                  icon={Calendar} 
                  label="Fecha del Análisis" 
                  value={formatDate(createdAt)} 
                  colorClass="bg-orange-500/10 text-orange-500" 
                />
              </div>

              {heatmap.prospect_email && (
                <div className="pt-4 border-t border-border/50">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">Contacto del Lead</p>
                  <div className="flex items-center gap-2 text-sm font-medium bg-secondary/30 p-2 rounded-md">
                    <Mail className="h-4 w-4 text-primary" />
                    {heatmap.prospect_email}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Google Ads Intelligence */}
          <Card className={`${isTargetInAds ? 'border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-none' : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-md">
                <Megaphone className={`h-4 w-4 ${isTargetInAds ? 'text-zinc-950 dark:text-white' : 'text-zinc-400'}`} />
                Inteligencia Google Ads
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isTargetInAds ? 'bg-amber-100 text-amber-600' : 'bg-secondary text-muted-foreground'}`}>
                  {isTargetInAds ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-sm font-bold">
                    {isTargetInAds ? 'Anunciante Activo' : 'Sin Inversión en Ads'}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    {isTargetInAds 
                      ? 'Este negocio está invirtiendo dinero para aparecer en los primeros resultados.' 
                      : 'No hemos detectado campañas activas para este negocio en esta zona.'}
                  </p>
                </div>
              </div>

              {(advertisers || []).length > 0 && (
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-2">Competencia con Ads ({(advertisers || []).length})</p>
                  <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                    {(advertisers || []).map((ad, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] font-medium bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 rounded-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                        <div className="h-1.5 w-1.5 rounded-full bg-zinc-950 dark:bg-white" />
                        <span className="truncate text-zinc-700 dark:text-zinc-300">{ad}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <LocalDominanceGauge points={points} />
            
            <LocalVisibilityGraph 
              placeId={config.placeId}
              keyword={config.keyword}
            />

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-none overflow-hidden">
                <CardContent className="p-4 flex flex-col items-center justify-center relative">
                  <div className="absolute top-0 right-0 p-2">
                    <Trophy className="h-3 w-3 text-zinc-300 dark:text-zinc-700" />
                  </div>
                  <p className="text-[9px] uppercase font-semibold text-zinc-500 tracking-widest mb-1">Mejor Rango</p>
                  <div className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                    #{summary.bestRank || '-'}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-none overflow-hidden">
                <CardContent className="p-4 flex flex-col items-center justify-center relative">
                  <div className="absolute top-0 right-0 p-2">
                    <Target className="h-3 w-3 text-zinc-300 dark:text-zinc-700" />
                  </div>
                  <p className="text-[9px] uppercase font-semibold text-zinc-500 tracking-widest mb-1">Promedio Gral</p>
                  <div className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                    #{summary.avgRank ? summary.avgRank.toFixed(1) : '-'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>

        {/* Map Preview */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card className="flex h-full min-h-[600px] flex-col overflow-hidden">
            <CardContent className="relative flex-1 p-0">
              <HeatmapMap
                center={center}
                zoom={13}
                points={points}
                businessName={config.businessName}
                // View-only mode implies no click handler needed
              />

              {/* Color Legend Overlay */}
              <HeatmapLegend />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <SalesStrategyHub 
        heatmap={heatmap as HeatmapRecord}
        competitors={competitors || []}
        itemVariants={fadeInUp}
      />

      {/* Print-only conversion footer */}
      <div className="print-only mt-12 bg-primary/5 p-8 rounded-2xl border-2 border-primary/20">
        <div className="flex flex-col items-center text-center space-y-4">
          <Trophy className="h-12 w-12 text-primary" />
          <h2 className="text-2xl font-black">Plan de Acción Estratégico</h2>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Basado en este análisis, el negocio presenta oportunidades críticas de mejora en el posicionamiento local. 
            La optimización del perfil de negocio y la gestión de reseñas podrían incrementar el Share of Local Pack 
            en un 40% en los próximos 90 días.
          </p>
          <div className="pt-4 flex gap-8">
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Consultor / Agencia</p>
              <p className="text-lg font-bold">{branding.name}</p>
            </div>
            {branding.logoUrl && (
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Contacto</p>
                <p className="text-lg font-bold">Iniciado por el Consultor</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="print-footer">
        {branding.name} — Reporte de Inteligencia Local generado el {formatDate(heatmap.created_at)}
      </div>

      <ConfirmDeleteModal 
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={async () => {
          await deleteHeatmap(heatmap.id);
          navigate('/history', { replace: true });
        }}
        title="¿Eliminar este análisis?"
        description={
          <>
            Estás visualizando el análisis de <span className="text-foreground font-bold">"{config.businessName}"</span>. 
            Si lo eliminas, desaparecerá de tu historial permanentemente.
          </>
        }
        confirmText="Sí, eliminar análisis"
        loadingText="Eliminando del historial..."
      />
    </motion.div>
  );
}
