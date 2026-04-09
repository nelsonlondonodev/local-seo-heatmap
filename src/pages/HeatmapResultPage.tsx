import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, Calendar, Grid3X3, ArrowLeft, Plus, Printer, FileDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeatmapMap, HeatmapLegend } from '@/features/heatmap';
import { getRankColor } from '@/config/constants';
import type { Database } from '@/types/database';
import type { GridPoint } from '@/types';

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

function StatRow({ icon: Icon, label, value, colorClass }: { icon: React.ElementType, label: string, value: string, colorClass: string }) {
  return (
    <div className="flex gap-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">{label}</p>
        <p className="font-semibold line-clamp-2">{value}</p>
      </div>
    </div>
  );
}

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
  const summary = (heatmap.results_summary as unknown as { avgRank: number; bestRank: number | null }) || { avgRank: 0, bestRank: null };

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
                // View-only mode implies no click handler needed
              />

              {/* Color Legend Overlay */}
              <HeatmapLegend />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
