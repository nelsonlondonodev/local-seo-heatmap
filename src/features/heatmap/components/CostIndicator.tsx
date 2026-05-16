import { Coins } from 'lucide-react';

interface CostIndicatorProps {
  estimatedCost: number;
}

export function CostIndicator({ estimatedCost }: CostIndicatorProps) {
  if (estimatedCost === 0) return null;

  return (
    <div className="flex items-center justify-between px-1 py-1">
      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 uppercase tracking-[0.1em]">
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 animate-pulse" />
        Inversión de Créditos
      </span>
      <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm animate-in fade-in slide-in-from-right-2 duration-500">
        <Coins className="h-3.5 w-3.5 text-zinc-500" strokeWidth={2.5} />
        <span className="text-xs font-black tracking-tight">{estimatedCost}</span>
        <span className="text-[9px] uppercase font-bold opacity-60 ml-0.5 tracking-wider">pts</span>
      </div>
    </div>
  );
  );
}
