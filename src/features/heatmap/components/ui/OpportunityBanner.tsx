import { TrendingUp } from 'lucide-react';

export function OpportunityBanner() {
  return (
    <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 transition-all">
      <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-xs uppercase tracking-tight mb-1">
        <TrendingUp className="h-3.5 w-3.5" />
        Oportunidad Detectada
      </div>
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
        Este análisis se marcará como <span className="font-bold text-zinc-950 dark:text-white">Prospección Premium</span> en tu historial para un seguimiento estratégico de ventas.
      </p>
    </div>
  );
}
