import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}

export function StatRow({ 
  icon: Icon, 
  label, 
  value, 
  className 
}: StatRowProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      <div className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white"
      )}>
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-zinc-950 dark:text-white line-clamp-2 leading-snug">
          {value}
        </p>
      </div>
    </div>
  );
}
