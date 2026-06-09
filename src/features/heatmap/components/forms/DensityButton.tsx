import { Zap, Layers, Grid3X3, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type GridValue = '3x3' | '5x5' | '7x7';

const ICON_MAP: Record<GridValue, LucideIcon> = {
  '3x3': Zap,
  '5x5': Layers,
  '7x7': Grid3X3
};

interface DensityButtonProps {
  label: string;
  description: string;
  value: GridValue;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function DensityButton({ 
  label, 
  description, 
  value, 
  isActive, 
  onClick,
  disabled = false
}: DensityButtonProps) {
  const Icon = disabled ? Lock : (ICON_MAP[value] || Grid3X3);

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center justify-center p-2 rounded-xl border transition-all gap-1.5 h-20 w-full relative",
        disabled
          ? "border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-100/50 dark:bg-zinc-900/30 text-zinc-400 dark:text-zinc-600 cursor-not-allowed opacity-60"
          : isActive
            ? "border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white ring-1 ring-zinc-950 dark:ring-white shadow-none active:scale-[0.97]"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500 active:scale-[0.97]"
      )}
    >
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
        isActive ? "text-zinc-950 dark:text-white" : "text-zinc-400",
        disabled && "text-zinc-400 dark:text-zinc-600"
      )}>
        <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <div className="flex flex-col items-center leading-tight gap-0.5">
        <span className="text-xs font-bold tracking-tight">{label}</span>
        <span className="text-[7px] uppercase tracking-widest opacity-70 font-bold">
          {disabled ? 'Bloqueado' : description}
        </span>
      </div>
    </button>
  );
}
