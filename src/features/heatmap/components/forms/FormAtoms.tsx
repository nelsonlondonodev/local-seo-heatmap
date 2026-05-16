import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Atomic Section Label for form sections
 */
export const SectionLabel = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Label className={cn("text-xs font-semibold uppercase text-zinc-500 tracking-widest", className)}>
    {children}
  </Label>
);
