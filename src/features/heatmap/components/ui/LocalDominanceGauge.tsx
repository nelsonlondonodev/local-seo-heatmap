import { motion } from 'framer-motion';
import { Trophy, Target, Eye, AlertCircle } from 'lucide-react';
import type { GridPoint } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LocalDominanceGaugeProps {
  points: GridPoint[];
}

/**
 * Premium Gauge Component to visualize Local Dominance (SoLV)
 */
export function LocalDominanceGauge({ points }: LocalDominanceGaugeProps) {
  const totalPoints = points.length || 1;
  
  const top3 = points.filter(p => p.rank !== null && p.rank >= 1 && p.rank <= 3).length;
  const top10 = points.filter(p => p.rank !== null && p.rank >= 4 && p.rank <= 10).length;
  const visible = points.filter(p => p.rank !== null && p.rank >= 11 && p.rank <= 20).length;
  const nonVisible = points.filter(p => p.rank === null || p.rank > 20).length;

  const score = ((top3 * 1.0 + top10 * 0.5 + visible * 0.2) / totalPoints) * 100;
  
  const getStatus = (val: number) => {
    if (val >= 70) return { label: 'Dominante', color: '#10b981', tailwind: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    if (val >= 30) return { label: 'Competitivo', color: '#f59e0b', tailwind: 'text-amber-500', bg: 'bg-amber-500/10' };
    return { label: 'Crítico', color: '#ef4444', tailwind: 'text-rose-500', bg: 'bg-rose-500/10' };
  };

  const status = getStatus(score);

  // SVG Gauge constants
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const arcLength = circumference * 0.75; // 75% circle for the gauge
  const offset = circumference - arcLength;
  const fillAmount = (score / 100) * arcLength;

  return (
    <Card className="overflow-hidden border-primary/20 bg-zinc-950/40 backdrop-blur-xl shadow-2xl relative">
      {/* Background Glow */}
      <div 
        className="absolute -top-10 -right-10 w-32 h-32 blur-[80px] rounded-full opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: status.color }}
      />

      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          {/* Header Label */}
          <div className="flex items-center gap-2 mb-6">
            <Trophy className={cn("h-4 w-4", status.tailwind)} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Dominancia Local: <span className={status.tailwind}>{status.label}</span>
            </span>
          </div>

          {/* SVG Gauge */}
          <div className="relative mb-6">
            <svg width={size} height={size} className="transform -rotate-[225deg]">
              {/* Background Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeLinecap="round"
                className="text-zinc-800"
              />
              {/* Progress Fill */}
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={status.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={arcLength}
                strokeLinecap="round"
                initial={{ strokeDashoffset: arcLength }}
                animate={{ strokeDashoffset: arcLength - fillAmount }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
              />
            </svg>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-black tracking-tighter text-white"
              >
                {Math.round(score)}%
              </motion.span>
              <span className="text-[9px] font-bold uppercase text-zinc-500 tracking-widest mt-[-4px]">SoLV Score</span>
            </div>
          </div>

          {/* Metrics Breakdown */}
          <div className="grid grid-cols-2 gap-6 w-full border-t border-zinc-800/50 pt-6">
            <div className="space-y-1 text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-500">
                <Target className="h-3 w-3" />
                <span className="text-[9px] font-black uppercase">Top 3</span>
              </div>
              <div className="text-xl font-black text-white">{top3}</div>
              <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">Máxima Tracción</div>
            </div>
            
            <div className="space-y-1 text-center">
              <div className="flex items-center justify-center gap-1.5 text-amber-500">
                <Eye className="h-3 w-3" />
                <span className="text-[9px] font-black uppercase">Top 10</span>
              </div>
              <div className="text-xl font-black text-white">{top10}</div>
              <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">Visibilidad Media</div>
            </div>
          </div>

          {/* Critical Warning if applicable */}
          {score < 30 && (
            <div className="mt-6 w-full p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-rose-200/70 leading-tight font-medium">
                <strong>Riesgo Crítico:</strong> Estás perdiendo más del 70% de las oportunidades de negocio locales en esta zona.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
