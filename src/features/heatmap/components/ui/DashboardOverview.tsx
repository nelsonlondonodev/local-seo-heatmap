import { useMemo } from 'react';
import { History, TrendingUp, Target, ShieldCheck } from 'lucide-react';
import { useHeatmaps } from '@/hooks';
import { isResultsSummary } from '@/util/mappers';
import { StatCard } from './StatCard';

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
