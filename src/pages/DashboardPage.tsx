import { motion } from 'framer-motion';
import { Map as MapIcon, Search, Crosshair, Loader2, Target, TrendingUp, Mail, User } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GRID_OPTIONS, RADIUS_OPTIONS } from '@/config/constants';
import { HeatmapMap, useHeatmap, BusinessSearch, ScanProgress, HeatmapLegend, CostIndicator, type PlaceSuggestion } from '@/features/heatmap';
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
      <motion.div variants={itemVariants} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Panel de Control
          </h1>
          <p className="text-muted-foreground">
            Analiza el mercado local o genera nuevas ventas
          </p>
        </div>
      </motion.div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="analysis" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Análisis Técnico
          </TabsTrigger>
          <TabsTrigger value="prospecting" className="gap-2">
            <Target className="h-4 w-4" />
            Ventas / Prospección
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Configuration Forms */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <TabsContent value="analysis" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Search className="h-4 w-4" />
                    Configuración de Análisis
                  </CardTitle>
                  <CardDescription>
                    Define los parámetros para tu auditoría técnica
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <CommonSearchParams heatmap={heatmap} />
                  <Button 
                    className="w-full gap-2 h-11 text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5" 
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
                        <TrendingUp className="h-4 w-4" />
                        Ejecutar Análisis
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prospecting" className="mt-0">
              <Card className="border-primary/20 shadow-xl shadow-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-primary">
                    <Target className="h-4 w-4" />
                    Generador de Leads
                  </CardTitle>
                  <CardDescription>
                    Prepara una propuesta irresistible para un cliente potencial
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Prospect Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="prospect-name">Nombre del Prospecto</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          id="prospect-name" 
                          placeholder="Nelson L." 
                          className="pl-8 text-xs" 
                          value={heatmap.prospectName}
                          onChange={(e) => heatmap.setProspectName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prospect-email">Email (Opcional)</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          id="prospect-email" 
                          placeholder="ejemplo@web.com" 
                          className="pl-8 text-xs"
                          value={heatmap.prospectEmail}
                          onChange={(e) => heatmap.setProspectEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <CommonSearchParams heatmap={heatmap} />
                  
                  <div className="rounded-lg bg-primary/5 p-3 border border-primary/10">
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-1">
                      <TrendingUp className="h-4 w-4" />
                      Oportunidad Detectada
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Este análisis se marcará como <strong>Prospección Premium</strong> en tu historial para seguimiento de ventas.
                    </p>
                  </div>

                  <Button 
                    className="w-full gap-2 h-11 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5" 
                    disabled={!heatmap.isFormValid || heatmap.isLoading}
                    onClick={heatmap.runAnalysis}
                  >
                    {heatmap.isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Auditando Lead...
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4" />
                        Generar Auditoría de Venta
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>

          {/* Map Preview (Common for both tabs) */}
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
                  businessName={heatmap.businessName}
                  onMapClick={heatmap.handleMapClick}
                />

                {/* Scan Progress Overlay */}
                <ScanProgress 
                  isLoading={heatmap.isLoading}
                  current={heatmap.scanProgress?.current || 0}
                  total={heatmap.scanProgress?.total || 0}
                />

                {/* Color Legend Overlay */}
                <HeatmapLegend />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Tabs>
    </motion.div>
  );
}

/**
 * Extracted small component for common search inputs
 */
function CommonSearchParams({ heatmap }: { heatmap: ReturnType<typeof useHeatmap> }) {
  return (
    <div className="space-y-5">
      {/* 1. Who: Business Search */}
      <BusinessSearch 
        initialValue={heatmap.businessName}
        selectedPlaceId={heatmap.placeId}
        onSelect={(place: PlaceSuggestion) => {
          heatmap.setBusinessName(place.name);
          heatmap.setPlaceId(place.placeId);
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

      <div className="grid grid-cols-2 gap-4">
        {/* 3. Where: Radius */}
        <div className="space-y-2">
          <Label>Radio (km)</Label>
          <Select
            value={String(heatmap.radiusKm)}
            onValueChange={(v) => heatmap.setRadiusKm(Number(v))}
          >
            <SelectTrigger className="hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Radio" />
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
          <Label>Grid</Label>
          <Select
            value={heatmap.gridSize}
            onValueChange={(v) => heatmap.setGridSize(v as any)}
          >
            <SelectTrigger className="hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Grid" />
            </SelectTrigger>
            <SelectContent>
              {GRID_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 5. Location Reference */}
      <div className="space-y-2 pt-2 border-t border-border/50">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Coordenadas Centro</Label>
          <button 
            onClick={heatmap.handleResetCenter}
            className="text-[10px] text-primary hover:underline flex items-center gap-1"
          >
            <Crosshair className="h-3 w-3" /> Resetear
          </button>
        </div>
        <div className="rounded-lg bg-secondary/30 p-2 text-center">
          <p className="text-[11px] font-medium font-mono text-muted-foreground">
            {heatmap.center[0].toFixed(6)}, {heatmap.center[1].toFixed(6)}
          </p>
        </div>
      </div>

      <CostIndicator pointsCount={heatmap.estimatedCost} />
    </div>
  );
}
