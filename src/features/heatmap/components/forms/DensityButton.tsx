import { Zap, Layers, Grid3X3, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DensityButtonProps {
  label: string;
  description: string;
  value: string;
  isActive: boolean;
  onClick: () => void;
}

export function DensityButton({ 
  label, 
  description, 
  value, 
  isActive, 
  onClick 
}: DensityButtonProps) {
  const IconMap: Record<string, LucideIcon> = { '3x3': Zap, '5x5': Layers, '7x7': Grid3X3 };
  const Icon = IconMap[value] || Grid3X3;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-2 rounded-xl border transition-all active:scale-95 gap-1.5 h-20 w-full",
        isActive
          ? "border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white ring-1 ring-zinc-950 dark:ring-white shadow-none"
          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500"
      )}
    >
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
        isActive ? "text-zinc-950 dark:text-white" : "text-zinc-400"
      )}>
        <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <div className="flex flex-col items-center leading-tight gap-0.5">
        <span className="text-xs font-bold tracking-tight">{label}</span>
        <span className="text-[7px] uppercase tracking-widest opacity-70 font-bold">{description}</span>
      </div>
    </button>
  );
}
