import { Coins } from 'lucide-react';

interface CostIndicatorProps {
  pointsCount: number;
}

export function CostIndicator({ pointsCount }: CostIndicatorProps) {
  // We can add logic here if cost per point varies by grid size in the future
  const cost = pointsCount;

  if (pointsCount === 0) return null;

  return (
    <div className="flex items-center justify-between px-1 py-1">
      <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        Consumo estimado
      </span>
      <div className="flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20 shadow-sm animate-in fade-in slide-in-from-right-2 duration-500">
        <Coins className="h-3 w-3 opacity-70" />
        <span className="text-xs font-bold">{cost}</span>
        <span className="text-[10px] uppercase font-black opacity-80 ml-0.5">créditos</span>
      </div>
    </div>
  );
}
