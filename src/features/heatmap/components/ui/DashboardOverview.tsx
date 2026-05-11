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
  color: string;
  bg: string;
  index: number;
}

function StatCard({ label, value, icon: Icon, color, bg, index }: StatCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="border-none bg-white/5 backdrop-blur-sm shadow-xl hover:bg-white/10 transition-colors group cursor-default overflow-hidden relative">
        <div className={cn("absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity", bg.replace('/10', ''))} />
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground group-hover:text-zinc-300 transition-colors">{label}</p>
              <h3 className="text-2xl font-black mt-1 group-hover:scale-105 origin-left transition-transform duration-300">{value}</h3>
            </div>
            <div className={cn("p-3 rounded-2xl transition-transform duration-300 shadow-lg shadow-black/20 group-hover:rotate-12", bg, color)}>
              <Icon className="h-5 w-5" />
            </div>
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
        color: 'text-blue-400',
        bg: 'bg-blue-400/10'
      },
      {
        label: 'Ranking Promedio',
        value: `#${avgRank}`,
        icon: TrendingUp,
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/10'
      },
      {
        label: 'Leads Generados',
        value: prospecting,
        icon: Target,
        color: 'text-primary',
        bg: 'bg-primary/10'
      },
      {
        label: 'Estado del Servicio',
        value: 'Activo',
        icon: ShieldCheck,
        color: 'text-amber-400',
        bg: 'bg-amber-400/10'
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

