import { Loader2 } from 'lucide-react';

interface ScanProgressProps {
  current: number;
  total: number;
  isLoading: boolean;
}

export function ScanProgress({ current, total, isLoading }: ScanProgressProps) {
  if (!isLoading) return null;

  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="absolute inset-0 z-[1500] flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-background/95 p-8 shadow-2xl">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-foreground">
            Escaneando posiciones...
          </p>
          {total > 0 && (
            <>
              <p className="text-xs text-muted-foreground">
                Lote {current} de {total}
              </p>
              <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
