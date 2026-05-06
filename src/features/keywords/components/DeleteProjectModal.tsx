import { AlertTriangle, Trash2, XCircle } from 'lucide-react';
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

interface DeleteProjectModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  projectName: string;
}

/**
 * Modal de confirmación para eliminar un proyecto de rastreo.
 */
export function DeleteProjectModal({
  isOpen,
  onOpenChange,
  onConfirm,
  projectName,
}: DeleteProjectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 bg-gradient-to-br from-destructive/10 to-transparent pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-destructive/5 text-destructive border-destructive/20 font-bold uppercase tracking-wider text-[10px] px-2 py-0.5">
              Acción Irreversible
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
            ¿Eliminar proyecto?
          </DialogTitle>
          <DialogDescription className="text-sm font-medium pt-1">
            Estás a punto de eliminar el proyecto <span className="text-foreground font-bold underline decoration-destructive/30 underline-offset-4">"{projectName}"</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-destructive/5 border border-destructive/10 text-destructive">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">Consecuencias del borrado:</p>
              <ul className="text-xs space-y-1 font-medium opacity-80 list-disc list-inside">
                <li>Se eliminarán todas las palabras clave rastreadas.</li>
                <li>Se perderá todo el historial de posiciones acumulado.</li>
                <li>No se podrán recuperar los datos una vez eliminados.</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border text-muted-foreground">
            <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-tight font-medium italic">
              Esta acción no liberará créditos ya consumidos por escaneos previos, pero detendrá futuros consumos automáticos para este proyecto.
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-secondary/10 gap-3 sm:gap-0">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="font-semibold text-muted-foreground hover:bg-background"
          >
            Cancelar, mantener proyecto
          </Button>
          <Button 
            variant="destructive"
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
            className="gap-2 font-bold px-8 shadow-lg shadow-destructive/20"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar Definitivamente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
