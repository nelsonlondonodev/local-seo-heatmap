import { motion } from 'framer-motion';
import { fadeInUp } from '@/config/animations';
import { Card, CardContent } from '@/components/ui/card';
import { History, TrendingUp, Target, ShieldCheck } from 'lucide-react';
import { useHeatmaps } from '@/hooks';
import { useMemo } from 'react';
import { isResultsSummary } from '@/util/mappers';

export function DashboardOverview() {
  const { history } = useHeatmaps();

  const stats = useMemo(() => {
    const total = history.length;
    const prospecting = history.filter(h => h.prospect_name).length;
    
    let sumRank = 0;
    let countRank = 0;

    history.forEach(h => {
      const summary = isResultsSummary(h.results_summary) ? h.results_summary : null;
      if (summary && summary.avgRank > 0) {
        sumRank += summary.avgRank;
        countRank++;
      }
    });

    const avgRank = countRank > 0 ? (sumRank / countRank).toFixed(1) : '-';

    return [
      {
        label: 'Análisis Realizados',
        value: total,
        icon: History,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
      },
      {
        label: 'Ranking Promedio',
        value: `#${avgRank}`,
        icon: TrendingUp,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
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
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
      }
    ];
  }, [history]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          variants={fadeInUp}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-none bg-white/5 backdrop-blur-sm shadow-xl hover:bg-white/10 transition-colors group cursor-default">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-zinc-300 transition-colors">{stat.label}</p>
                  <h3 className="text-2xl font-black mt-1 group-hover:scale-105 origin-left transition-transform duration-300">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-black/20`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
