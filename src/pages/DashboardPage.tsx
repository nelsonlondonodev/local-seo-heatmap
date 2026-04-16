import { motion } from 'framer-motion';
import { Map as MapIcon, Target, TrendingUp } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/config/animations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeatmapMap, useHeatmap, ScanProgress, HeatmapLegend } from '@/features/heatmap';
import { AnalysisTab } from '@/features/heatmap/components/forms/AnalysisTab';
import { ProspectingTab } from '@/features/heatmap/components/forms/ProspectingTab';



export function DashboardPage() {
  const heatmap = useHeatmap();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
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
          <motion.div variants={fadeInUp} className="lg:col-span-1">
            <TabsContent value="analysis" className="mt-0">
              <AnalysisTab heatmap={heatmap} />
            </TabsContent>

            <TabsContent value="prospecting" className="mt-0">
              <ProspectingTab heatmap={heatmap} />
            </TabsContent>
          </motion.div>

          {/* Map Preview (Common for both tabs) */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
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
