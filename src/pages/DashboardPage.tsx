import { motion } from 'framer-motion';
import { Map as MapIcon, Search, Crosshair, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GRID_OPTIONS, RADIUS_OPTIONS } from '@/config/constants';
import { HeatmapMap, useHeatmap, BusinessSearch, type PlaceSuggestion } from '@/features/heatmap';
import { cn } from '@/lib/utils';

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

export function DashboardPage() {
  const heatmap = useHeatmap();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Mapa de Calor
        </h1>
        <p className="text-muted-foreground">
          Configura y ejecuta un análisis de posicionamiento local
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Search Configuration */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-4 w-4" />
                Configuración
              </CardTitle>
              <CardDescription>
                Define los parámetros de tu búsqueda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* 1. Who: Business Search */}
              <BusinessSearch 
                initialValue={heatmap.businessName}
                selectedPlaceId={heatmap.placeId}
                onSelect={(place: PlaceSuggestion) => {
                  heatmap.setBusinessName(place.name);
                  heatmap.setPlaceId(place.placeId);
                  // MAGIC: Center map on the business
                  heatmap.handleMapClick(place.lat, place.lng);
                }}
                onClear={() => {
                  heatmap.setBusinessName('');
                  heatmap.setPlaceId('');
                }}
              />

              {/* 2. What: Keyword */}
              <div className="space-y-2">
                <Label htmlFor="keyword">Palabra clave de búsqueda</Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Search className="h-4 w-4" />
                  </div>
                  <Input
                    id="keyword"
                    placeholder="ej: peluquería cerca de mí"
                    className="pl-9 transition-all focus:ring-primary/20"
                    value={heatmap.keyword}
                    onChange={(e) => heatmap.setKeyword(e.target.value)}
                  />
                </div>
              </div>

              {/* 3. Where: Radius */}
              <div className="space-y-2">
                <Label>Radio de análisis (km)</Label>
                <Select
                  value={String(heatmap.radiusKm)}
                  onValueChange={(v) => heatmap.setRadiusKm(Number(v))}
                >
                  <SelectTrigger className="hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Seleccionar radio" />
                  </SelectTrigger>
                  <SelectContent>
                    {RADIUS_OPTIONS.map((radius) => (
                      <SelectItem key={radius} value={String(radius)}>
                        {radius} km
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 4. Density: Grid Size */}
              <div className="space-y-2">
                <Label>Puntos del Mapa (Grid)</Label>
                <div className="grid grid-cols-3 gap-2">
                  {GRID_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => heatmap.setGridSize(option.value)}
                      className={cn(
                        'group relative flex flex-col items-center rounded-lg border border-border p-3 text-center transition-all hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/50',
                        heatmap.gridSize === option.value && 'border-primary bg-primary/5 ring-2 ring-primary/50'
                      )}
                    >
                      <span className="text-sm font-semibold">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.points} puntos
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Location Reference */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Centro del análisis</Label>
                  <button 
                    onClick={heatmap.handleResetCenter}
                    className="text-[10px] text-primary hover:underline flex items-center gap-1"
                  >
                    <Crosshair className="h-3 w-3" /> Resetear
                  </button>
                </div>
                <div className="rounded-lg bg-secondary/30 p-2 text-center">
                  <p className="text-[11px] font-medium font-mono text-muted-foreground">
                    LAT: {heatmap.center[0].toFixed(6)} | LNG: {heatmap.center[1].toFixed(6)}
                  </p>
                </div>
              </div>

              <Button 
                className="w-full gap-2 h-11 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" 
                disabled={!heatmap.isFormValid || heatmap.isLoading}
                onClick={heatmap.runAnalysis}
              >

                {heatmap.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Ejecutar Análisis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Map Preview */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="flex h-full min-h-[600px] flex-col overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapIcon className="h-4 w-4" />
                Vista del Mapa
              </CardTitle>
              <CardDescription>
                Haz clic en el mapa para seleccionar el punto central del análisis
              </CardDescription>
            </CardHeader>
            <CardContent className="relative flex-1 p-0">
              <HeatmapMap
                center={heatmap.center}
                zoom={13}
                points={heatmap.points}
                onMapClick={heatmap.handleMapClick}
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
                      { color: '#7f1d1d', label: '16+' },
                      { color: '#374151', label: 'N/A' },
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
