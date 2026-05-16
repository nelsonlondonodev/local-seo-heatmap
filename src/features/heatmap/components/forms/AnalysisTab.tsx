import { Search, Loader2, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHeatmap } from '../../hooks/useHeatmap';
import { SearchForm } from './SearchForm';
import { ScanConfirmationModal } from '../ui/ScanConfirmationModal';
import { useAuth } from '@/features/auth';

interface AnalysisTabProps {
  heatmap: ReturnType<typeof useHeatmap>;
}

export function AnalysisTab({ heatmap }: AnalysisTabProps) {
  const { profile } = useAuth();
  const hasEnoughCredits = (profile?.credits ?? 0) >= heatmap.estimatedCost;

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
          className="w-full gap-2 h-11 text-sm font-semibold shadow-none bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors rounded-md" 
          disabled={!heatmap.isFormValid || heatmap.isLoading || !hasEnoughCredits}
          onClick={() => heatmap.setIsConfirmModalOpen(true)}
        >
          {heatmap.isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analizando...
            </>
          ) : !hasEnoughCredits ? (
            <>
              <AlertCircle className="h-4 w-4" />
              Créditos Insuficientes
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
          config={heatmap.currentConfig}
          estimatedCost={heatmap.estimatedCost}
          pointsCount={heatmap.points.length}
        />
      </CardContent>
    </Card>
  );
}
