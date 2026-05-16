import { Target, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHeatmap } from '../../hooks/useHeatmap';
import { SearchForm } from './SearchForm';
import { ScanConfirmationModal } from '../ui/ScanConfirmationModal';
import { useAuth } from '@/features/auth';

// Refactored Atoms & Molecules
import { ProspectFields } from './prospecting/ProspectFields';
import { OpportunityBanner } from '../ui/OpportunityBanner';

interface ProspectingTabProps {
  heatmap: ReturnType<typeof useHeatmap>;
}

/**
 * Molecule: ProspectingTab
 * Orchestrates the prospecting lead generation flow with a monochrome premium aesthetic.
 */
export function ProspectingTab({ heatmap }: ProspectingTabProps) {
  const { profile } = useAuth();
  const { 
    prospectName, setProspectName, 
    prospectEmail, setProspectEmail,
    isFormValid, isLoading,
    setIsConfirmModalOpen, isConfirmModalOpen,
    runAnalysis, currentConfig, estimatedCost, points
  } = heatmap;

  const hasEnoughCredits = (profile?.credits ?? 0) >= estimatedCost;

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 shadow-none overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
          <Target className="h-4 w-4" />
          Generador de Leads
        </CardTitle>
        <CardDescription className="text-xs">
          Prepara una propuesta irresistible para un cliente potencial
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <ProspectFields 
          name={prospectName}
          email={prospectEmail}
          onNameChange={setProspectName}
          onEmailChange={setProspectEmail}
        />

        <SearchForm heatmap={heatmap} />
        
        <OpportunityBanner />

        <Button 
          className="w-full gap-2 h-12 text-sm font-bold bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-none transition-all rounded-xl" 
          disabled={!isFormValid || isLoading || !hasEnoughCredits}
          onClick={() => setIsConfirmModalOpen(true)}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Auditando Lead...
            </>
          ) : !hasEnoughCredits ? (
            <>
              <AlertCircle className="h-4 w-4" />
              Créditos Insuficientes
            </>
          ) : (
            <>
              <Target className="h-4 w-4" />
              Generar Auditoría de Venta
            </>
          )}
        </Button>

        <ScanConfirmationModal 
          isOpen={isConfirmModalOpen}
          onOpenChange={setIsConfirmModalOpen}
          onConfirm={runAnalysis}
          config={currentConfig}
          estimatedCost={estimatedCost}
          pointsCount={points.length}
        />
      </CardContent>
    </Card>
  );
}
