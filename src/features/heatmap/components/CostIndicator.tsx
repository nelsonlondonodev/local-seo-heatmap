import { Coins, AlertCircle } from 'lucide-react';
import { useSaaSStatus } from '@/hooks/useSaaSStatus';
import { cn } from '@/lib/utils';

interface CostIndicatorProps {
  estimatedCost: number;
}

export function CostIndicator({ estimatedCost }: CostIndicatorProps) {
  const { canAfford } = useSaaSStatus();
  const hasEnoughCredits = canAfford(estimatedCost);

  if (estimatedCost === 0) return null;

  return (
    <div className="flex items-center justify-between px-1 py-1">
      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 uppercase tracking-[0.1em]">
        <div className={cn(
          "h-1.5 w-1.5 rounded-full animate-pulse",
          hasEnoughCredits ? "bg-zinc-300 dark:bg-zinc-700" : "bg-amber-500"
        )} />
        Inversión de Créditos
      </span>
      <div className={cn(
        "flex items-center gap-1.5 px-3 py-1 rounded-lg border shadow-sm animate-in fade-in slide-in-from-right-2 duration-500 transition-colors",
        hasEnoughCredits 
          ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white border-zinc-200 dark:border-zinc-800"
          : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30"
      )}>
        {hasEnoughCredits ? (
          <Coins className="h-3.5 w-3.5 text-zinc-500" strokeWidth={2.5} />
        ) : (
          <AlertCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
        )}
        <span className="text-xs font-black tracking-tight">{estimatedCost}</span>
        <span className="text-[9px] uppercase font-bold opacity-60 ml-0.5 tracking-wider">pts</span>
      </div>
    </div>
  );
}
