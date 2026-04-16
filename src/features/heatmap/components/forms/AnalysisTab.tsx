import { Search, Loader2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHeatmap } from '../../hooks/useHeatmap';
import { SearchForm } from './SearchForm';
import { ScanConfirmationModal } from '../ui/ScanConfirmationModal';

interface AnalysisTabProps {
  heatmap: ReturnType<typeof useHeatmap>;
}

export function AnalysisTab({ heatmap }: AnalysisTabProps) {
  return (
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
        <SearchForm heatmap={heatmap} />
        <Button 
          className="w-full gap-2 h-11 text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5" 
          disabled={!heatmap.isFormValid || heatmap.isLoading}
          onClick={() => heatmap.setIsConfirmModalOpen(true)}
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

        <ScanConfirmationModal 
          isOpen={heatmap.isConfirmModalOpen}
          onOpenChange={heatmap.setIsConfirmModalOpen}
          onConfirm={heatmap.runAnalysis}
          config={{
            keyword: heatmap.keyword,
            businessName: heatmap.businessName,
            placeId: heatmap.placeId,
            gridSize: heatmap.gridSize,
            radiusKm: heatmap.radiusKm,
            centerLat: heatmap.center[0],
            centerLng: heatmap.center[1]
          }}
          estimatedCost={heatmap.estimatedCost}
          pointsCount={heatmap.points.length}
        />
      </CardContent>
    </Card>
  );
}
