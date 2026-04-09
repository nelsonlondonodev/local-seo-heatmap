import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, Calendar, Grid3X3, ArrowLeft, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeatmapMap } from '@/features/heatmap';
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

export function HeatmapResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { heatmap?: HeatmapRecord } | null;
  const heatmap = state?.heatmap;

  // If no heatmap is provided in state, redirect to history
  if (!heatmap) {
    return <Navigate to="/history" replace />;
  }

  const center: [number, number] = [Number(heatmap.center_lat), Number(heatmap.center_lng)];
  const points = (heatmap.points as unknown as GridPoint[]) || [];
  const summary = (heatmap.results_summary as unknown as { avgRank: number; bestRank: number | null }) || { avgRank: 0, bestRank: null };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
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
            Volver al Historial
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
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Palabra Clave</p>
                    <p className="font-semibold">{heatmap.keyword}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Negocio Objetivo</p>
                    <p className="font-semibold line-clamp-2">{heatmap.business_name}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                    <Grid3X3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Parámetros de Grid</p>
                    <p className="font-medium text-sm">
                      {heatmap.grid_size} Puntos • Radio: {heatmap.radius_km} km
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Fecha del Análisis</p>
                    <p className="font-medium text-sm text-foreground/80">
                      {formatDate(heatmap.created_at)}
                    </p>
                  </div>
                </div>
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
                // No onMapClick handler to make it strictly view-only
              />

              {/* Color Legend Overlay */}
              <div className="absolute bottom-4 left-4 z-[1000] rounded-md border border-border bg-background/90 p-3 shadow-sm backdrop-blur-sm">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    Leyenda de Posiciones
                  </span>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {[
                      { color: '#22c55e', label: '#1-3' },
                      { color: '#facc15', label: '#4-6' },
                      { color: '#f97316', label: '#7-9' },
                      { color: '#dc2626', label: '#10-15' },
                      { color: '#7f1d1d', label: '16-20' },
                      { color: '#374151', label: '20+' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-1.5">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
