import { motion } from 'framer-motion';
import { fadeInUp } from '@/config/animations';
import { Card, CardContent } from '@/components/ui/card';
import { History, TrendingUp, Target, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useHeatmaps } from '@/hooks';
import { useMemo } from 'react';
import { isResultsSummary } from '@/util/mappers';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  index: number;
}

function StatCard({ label, value, icon: Icon, index }: StatCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group cursor-default rounded-xl overflow-hidden">
        <CardContent className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{label}</p>
            <div className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
              <Icon className="h-4 w-4" strokeWidth={2} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">{value}</h3>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DashboardOverview() {
  const { history } = useHeatmaps();

  const stats = useMemo(() => {
    const total = history.length;
    const prospecting = history.filter(h => h.prospect_name).length;
    
    const validRanks = history
      .map(h => isResultsSummary(h.results_summary) ? h.results_summary.avgRank : 0)
      .filter(rank => rank > 0);

    const avgRank = validRanks.length > 0 
      ? (validRanks.reduce((a, b) => a + b, 0) / validRanks.length).toFixed(1) 
      : '-';

    return [
      {
        label: 'Análisis Realizados',
        value: total,
        icon: History,
      },
      {
        label: 'Ranking Promedio',
        value: `#${avgRank}`,
        icon: TrendingUp,
      },
      {
        label: 'Leads Generados',
        value: prospecting,
        icon: Target,
      },
      {
        label: 'Estado del Servicio',
        value: 'Activo',
        icon: ShieldCheck,
      }
    ];
  }, [history]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} index={index} />
      ))}
    </div>
  );
}

