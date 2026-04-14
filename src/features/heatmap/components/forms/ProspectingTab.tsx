import { Target, TrendingUp, Mail, User, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHeatmap } from '../../hooks/useHeatmap';
import { SearchForm } from './SearchForm';

interface ProspectingTabProps {
  heatmap: ReturnType<typeof useHeatmap>;
}

export function ProspectingTab({ heatmap }: ProspectingTabProps) {
  return (
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
                className="pl-8 text-xs focus-visible:ring-primary/20" 
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
                className="pl-8 text-xs focus-visible:ring-primary/20"
                value={heatmap.prospectEmail}
                onChange={(e) => heatmap.setProspectEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        <SearchForm heatmap={heatmap} />
        
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
  );
}
