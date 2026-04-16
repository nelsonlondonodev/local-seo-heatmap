import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Search, Calendar, Grid3X3, ArrowLeft, Plus, 
  Printer, Target, Mail, Megaphone, CheckCircle2, 
  AlertCircle, Trophy 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HeatmapMap, HeatmapLegend } from '@/features/heatmap';
import { StatRow } from '@/features/heatmap/components/ui/StatRow';
import { SalesStrategyHub } from '@/features/heatmap/components/ui/SalesStrategyHub';
import { LocalVisibilityGraph } from '@/features/heatmap/components/ui/LocalVisibilityGraph';
import { getRankColor } from '@/config/constants';
import { isAdvertiser } from '../features/heatmap/utils/textUtils';
import type { Database } from '@/types/database';
import type { GridPoint, ResultsSummary, CompetitorStat } from '@/types';

type HeatmapRecord = Database['public']['Tables']['heatmaps']['Row'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export function HeatmapResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { heatmap?: HeatmapRecord } | null;
  const heatmap = state?.heatmap;

  if (!heatmap) {
    return <Navigate to="/history" replace />;
  }

  const center: [number, number] = [Number(heatmap.center_lat), Number(heatmap.center_lng)];
  const points = (heatmap.points as unknown as GridPoint[]) || [];
  const summary = (heatmap.results_summary as unknown as ResultsSummary) || { avgRank: 0, bestRank: null, foundCount: 0, totalCount: 0 };
  const advertisers = (heatmap.advertisers as string[]) || [];
  const competitors = (heatmap.competitors as unknown as CompetitorStat[]) || [];
  const isTargetInAds = isAdvertiser(heatmap.business_name, advertisers);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Print-only Header */}
      <div className="print-only mb-10 border-b-4 border-primary pb-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-primary tracking-tighter">ESTUDIO DE VISIBILIDAD LOCAL</h1>
            <Badge variant="outline" className="text-primary border-primary/30 font-bold px-3">MAPRANKER PRO v0.6.3</Badge>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Informe Confidencial</p>
            <p className="text-xs font-bold text-primary">{formatDate(heatmap.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Header UI */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
          <Button variant="secondary" onClick={() => window.print()} className="gap-2 font-semibold">
            <Printer className="h-4 w-4" />
            Imprimir Reporte
          </Button>
          <Button onClick={() => navigate('/dashboard')} className="gap-2 focus:ring-primary/20 transition-all font-bold">
            <Plus className="h-4 w-4" />
            Nuevo Análisis
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Info Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
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
                  value={heatmap.keyword} 
                  colorClass="bg-primary/10 text-primary" 
                />
                <StatRow 
                  icon={MapPin} 
                  label="Negocio Objetivo" 
                  value={heatmap.business_name} 
                  colorClass="bg-emerald-500/10 text-emerald-500" 
                />
                <StatRow 
                  icon={Grid3X3} 
                  label="Parámetros de Grid" 
                  value={`${heatmap.grid_size} Puntos • Radio: ${heatmap.radius_km} km`} 
                  colorClass="bg-blue-500/10 text-blue-500" 
                />
                <StatRow 
                  icon={Calendar} 
                  label="Fecha del Análisis" 
                  value={formatDate(heatmap.created_at)} 
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
          <Card className={`${isTargetInAds ? 'border-amber-500/30 bg-amber-500/5' : 'border-border'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-md">
                <Megaphone className={`h-4 w-4 ${isTargetInAds ? 'text-amber-500' : 'text-muted-foreground'}`} />
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

              {advertisers.length > 0 && (
                <div className="pt-3 border-t border-border/50">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">Competencia con Ads ({advertisers.length})</p>
                  <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                    {advertisers.map((ad, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] font-medium bg-secondary/20 p-1.5 rounded border border-transparent hover:border-amber-500/20 transition-colors">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        <span className="truncate">{ad}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <LocalVisibilityGraph 
              placeId={heatmap.place_id}
              keyword={heatmap.keyword}
            />

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-primary/5 border-primary/20 shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Mejor Rango</p>
                  <div className="text-3xl font-extrabold text-foreground" style={{ color: getRankColor(summary.bestRank) }}>
                    #{summary.bestRank || '-'}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20 shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Promedio</p>
                  <div className="text-3xl font-extrabold text-foreground" style={{ color: getRankColor(Math.round(summary.avgRank)) }}>
                    #{summary.avgRank ? summary.avgRank.toFixed(1) : '-'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>

        {/* Map Preview */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="flex h-full min-h-[600px] flex-col overflow-hidden">
            <CardContent className="relative flex-1 p-0">
              <HeatmapMap
                center={center}
                zoom={13}
                points={points}
                businessName={heatmap.business_name}
                // View-only mode implies no click handler needed
              />

              {/* Color Legend Overlay */}
              <HeatmapLegend />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <SalesStrategyHub 
        heatmap={heatmap}
        competitors={competitors}
        itemVariants={itemVariants}
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
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Consultor SEO</p>
              <p className="text-lg font-bold">Nelson Londoño</p>
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Contacto</p>
              <p className="text-lg font-bold">nelson@agencia.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="print-footer">
        MapRanker Pro — Reporte de Inteligencia Local generado el {formatDate(heatmap.created_at)}
      </div>
    </motion.div>
  );
}
