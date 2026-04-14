import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  colorClass: string;
  className?: string;
}

export function StatRow({ 
  icon: Icon, 
  label, 
  value, 
  colorClass,
  className 
}: StatRowProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      <div className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
        colorClass
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">
          {label}
        </p>
        <p className="font-semibold line-clamp-2 leading-snug">
          {value}
        </p>
      </div>
    </div>
  );
}
