import { motion } from 'framer-motion';
import { Trophy, Target, Eye } from 'lucide-react';
import type { GridPoint } from '@/types';

interface VisibilityScoreProps {
  points: GridPoint[];
}

export function VisibilityScore({ points }: VisibilityScoreProps) {
  const totalPoints = points.length || 1;
  
  // Calculate counts based on ranks
  const top3 = points.filter(p => p.rank !== null && p.rank >= 1 && p.rank <= 3).length;
  const top10 = points.filter(p => p.rank !== null && p.rank >= 4 && p.rank <= 10).length;
  const visible = points.filter(p => p.rank !== null && p.rank >= 11 && p.rank <= 20).length;
  const nonVisible = points.filter(p => p.rank === null || p.rank > 20).length;

  /**
   * SoLV (Share of Local Vision) Calculation
   * Weights: Top 3 (1.0), Top 10 (0.5), Top 20 (0.2), 20+ (0)
   */
  const score = ((top3 * 1.0 + top10 * 0.5 + visible * 0.2) / totalPoints) * 100;
  
  // Determine color and status
  const getStatus = (val: number) => {
    if (val >= 70) return { label: 'Dominante', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    if (val >= 30) return { label: 'Competitivo', color: 'text-amber-500', bg: 'bg-amber-500/10' };
    return { label: 'Crítico', color: 'text-rose-500', bg: 'bg-rose-500/10' };
  };

  const status = getStatus(score);

  return (
    <Card className="overflow-hidden border-primary/20 bg-background/40 backdrop-blur-md shadow-2xl">
      <div className={`p-4 border-b border-primary/10 flex items-center justify-between ${status.bg}`}>
        <div className="flex items-center gap-2">
          <Trophy className={`h-4 w-4 ${status.color}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${status.color}`}>
            Visibilidad Local: {status.label}
          </span>
        </div>
        <span className={`text-xl font-black ${status.color}`}>{score.toFixed(1)}%</span>
      </div>
      
      <CardContent className="pt-6 px-4 pb-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-500">
              <Target className="h-3 w-3" />
              <span className="text-[10px] font-bold uppercase tracking-tight">Top 3 Pack</span>
            </div>
            <div className="text-2xl font-black">{top3} <span className="text-xs font-medium text-muted-foreground">pts</span></div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-amber-500">
              <Eye className="h-3 w-3" />
              <span className="text-[10px] font-bold uppercase tracking-tight">Top 10</span>
            </div>
            <div className="text-2xl font-black">{top10} <span className="text-xs font-medium text-muted-foreground">pts</span></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden mb-6">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.5, ease: "easeOut" as any }}
            className={`absolute inset-y-0 left-0 rounded-full ${score >= 70 ? 'bg-emerald-500' : score >= 30 ? 'bg-amber-500' : 'bg-rose-500'}`}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-rose-500/50" />
              <span>Fuera de competencia (20+)</span>
            </div>
            <span className="font-bold">{nonVisible} puntos</span>
          </div>
          <p className="text-[10px] italic text-muted-foreground leading-tight pt-2 border-t border-primary/5">
            * El SoLV mide el impacto real en el tráfico local basado en la posición de cada punto en el grid.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent } from '@/components/ui/card';
