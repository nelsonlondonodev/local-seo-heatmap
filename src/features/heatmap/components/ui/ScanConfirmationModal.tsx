import { AlertTriangle, MapPin, Search, Grid3X3, Zap, ShieldCheck, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { HeatmapConfig } from '@/types';

interface ScanConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  config: HeatmapConfig;
  estimatedCost: number;
  pointsCount: number;
}

/**
 * Professional confirmation modal before starting a heavy heatmap scan.
 * Includes data validation summary and credit cost estimation.
 */
export function ScanConfirmationModal({
  isOpen,
  onOpenChange,
  onConfirm,
  config,
  estimatedCost,
  pointsCount,
}: ScanConfirmationModalProps) {
  
  // Basic validation checks
  const hasPlaceId = !!config.placeId;
  const isKeywordLongEnough = config.keyword.trim().length >= 3;
  
  const canProceed = hasPlaceId && isKeywordLongEnough;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 bg-gradient-to-br from-primary/10 to-transparent pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold uppercase tracking-wider text-[10px] px-2 py-0.5">
              Confirmación de Auditoría
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
            ¿Confirmar nuevo escaneo?
          </DialogTitle>
          <DialogDescription className="text-sm font-medium pt-1">
            Revisa los parámetros antes de consumir tus créditos de búsqueda.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Summary Cards */}
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
              <div className="h-9 w-9 rounded-lg bg-background flex items-center justify-center text-primary shadow-sm">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Negocio</p>
                <p className="text-sm font-bold truncate">{config.businessName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
              <div className="h-9 w-9 rounded-lg bg-background flex items-center justify-center text-primary shadow-sm">
                <Search className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Palabra Clave</p>
                <p className="text-sm font-bold truncate">"{config.keyword}"</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
              <div className="h-9 w-9 rounded-lg bg-background flex items-center justify-center text-primary shadow-sm">
                <Grid3X3 className="h-5 w-5" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Configuración del Mapa</p>
                <p className="text-sm font-bold">{config.gridSize} • {config.radiusKm} km de radio</p>
              </div>
              <Badge variant="secondary" className="font-mono font-bold text-xs">
                {pointsCount} PUNTOS
              </Badge>
            </div>
          </div>

          {/* Validations & Warnings */}
          <div className="space-y-2">
            {!hasPlaceId && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 text-rose-600">
                <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-tight font-medium">
                  <strong>Error de Ubicación:</strong> El negocio no tiene un ID de Google válido. Selecciona el negocio de la lista de sugerencias para mayor precisión.
                </div>
              </div>
            )}
            
            {!isKeywordLongEnough && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 text-amber-600">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-tight font-medium">
                  <strong>Sugerencia:</strong> Una palabra clave tan corta puede dar resultados muy genéricos. Intenta ser más específico.
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-blue-600">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-tight font-medium">
                Este análisis consumirá <strong>{estimatedCost} créditos</strong> de tu saldo actual. Una vez iniciado, el proceso no puede detenerse.
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-secondary/10 gap-3 sm:gap-0">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="font-semibold text-muted-foreground hover:bg-background"
          >
            Cancelar
          </Button>
          <Button 
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
            disabled={!canProceed}
            className="gap-2 font-bold px-8 shadow-lg shadow-primary/20"
          >
            <Zap className="h-4 w-4 fill-current" />
            Empezar Análisis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
