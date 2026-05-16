import { Crosshair } from 'lucide-react';
import { SectionLabel } from './FormAtoms';

interface CoordinateBoxProps {
  center: [number, number];
  onReset: () => void;
}

export function CoordinateBox({ center, onReset }: CoordinateBoxProps) {
  return (
    <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
      <SectionLabel className="text-[10px]">Coordenadas del Centro</SectionLabel>
      <div className="relative group overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-3 shadow-none">
        <p className="text-[11px] font-medium font-mono text-zinc-500 dark:text-zinc-400">
          {center[0].toFixed(6)}, {center[1].toFixed(6)}
        </p>
        <button 
          type="button"
          onClick={onReset}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-950 dark:text-white transition-colors border border-zinc-200 dark:border-zinc-800 active:scale-95"
          title="Resetear al centro original"
        >
          <Crosshair className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
