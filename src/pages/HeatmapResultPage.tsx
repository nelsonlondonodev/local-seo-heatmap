import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, Calendar, Grid3X3, ArrowLeft, Plus, Printer, Target, Mail, Megaphone, CheckCircle2, AlertCircle, Trophy, Users, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HeatmapMap, HeatmapLegend } from '@/features/heatmap';
import { StatRow } from '@/features/heatmap/components/ui/StatRow';
import { getRankColor } from '@/config/constants';
import { isAdvertiser, isBusinessMatch } from '@/features/heatmap/utils/textUtils';
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
      <div className="print-only mb-8 border-b pb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-primary">MapRanker Pro</h1>
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Informe de Posicionamiento Local</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Analizado por Nelson Londoño SEO</p>
            <p className="text-xs text-muted-foreground">{formatDate(heatmap.created_at)}</p>
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

      {/* Competition Leaderboard */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Líderes del Mercado Local
              </CardTitle>
              <CardDescription>Comparativa de presencia en el Top 3 (Local Pack) para "{heatmap.keyword}"</CardDescription>
            </div>
            <div className="hidden sm:block">
              <Badge variant="secondary" className="gap-1 px-3 py-1">
                <Users className="h-3.5 w-3.5" />
                {competitors.length} Competidores rastreados
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Rank</th>
                    <th className="h-12 px-4 text-left align-middle font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Competidor</th>
                    <th className="h-12 px-4 text-center align-middle font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Promedio</th>
                    <th className="h-12 px-4 text-center align-middle font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Top 3</th>
                    <th className="h-12 px-4 text-right align-middle font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Share of Local Pack</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {competitors.map((comp, idx) => {
                    const isTarget = isBusinessMatch(heatmap.business_name, comp.name, heatmap.place_id, '');
                    return (
                      <tr key={idx} className={`border-b transition-all hover:bg-muted/50 ${isTarget ? 'bg-primary/5 font-bold' : ''}`}>
                        <td className="p-4 align-middle">
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${idx < 3 ? 'bg-amber-500 text-white font-bold' : 'bg-secondary text-muted-foreground'}`}>
                            {idx + 1}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <span className="truncate max-w-[200px] sm:max-w-none">{comp.name}</span>
                            {isTarget && <Badge className="h-4 text-[9px] px-1.5 uppercase bg-primary text-white">Tu Negocio</Badge>}
                          </div>
                        </td>
                        <td className="p-4 align-middle text-center">
                          <span className="font-medium">#{comp.avgRank.toFixed(1)}</span>
                        </td>
                        <td className="p-4 align-middle text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-sm">{comp.top3Count}</span>
                            <span className="text-[9px] text-muted-foreground leading-none">puntos</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center justify-end gap-3">
                            <div className="w-24 hidden sm:block h-2 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary" 
                                style={{ width: `${comp.shareOfLocalPack}%` }}
                              />
                            </div>
                            <span className="text-right tabular-nums w-12 font-bold">{comp.shareOfLocalPack}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {competitors.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No hay suficientes datos de competencia en este análisis.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10 flex flex-col sm:flex-row gap-4 items-center">
              <div className="h-10 w-10 shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm font-semibold text-primary">Insight de Dominancia Market Share</p>
                <p className="text-xs text-muted-foreground">
                  <strong>{competitors[0]?.name || 'Nadie'}</strong> lidera el mercado local captando el <strong>{competitors[0]?.shareOfLocalPack || 0}%</strong> de las vitrinas de Google (Top 3) en esta área.
                </p>
              </div>
              <div className="shrink-0">
                <Badge variant="outline" className="text-[10px] text-primary bg-primary/5">
                  <TrendingUp className="h-3 w-3 mr-1" /> ALTA DINÁMICA
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
