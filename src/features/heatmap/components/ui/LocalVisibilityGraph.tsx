import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Area, AreaChart 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Calendar, Trophy } from 'lucide-react';
import { useRankingHistory } from '../../hooks/useRankingHistory';
import { useState, useEffect } from 'react';

interface LocalVisibilityGraphProps {
  placeId: string;
  keyword: string;
}

/**
 * Historical ranking chart component using Recharts.
 * Redesigned for premium aesthetics and robust UX.
 */
export function LocalVisibilityGraph({ placeId, keyword }: LocalVisibilityGraphProps) {
  const { data: history = [], isLoading } = useRankingHistory(placeId, keyword);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading || history.length < 2) {
    return null;
  }

  // Format date for the X-axis and Tooltip
  const chartData = history.map(h => ({
    ...h,
    fullDate: new Date(h.date).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'long', year: 'numeric'
    }),
    formattedDate: new Date(h.date).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short'
    })
  }));

  // Calculate trend
  const first = history[0].avgRank;
  const last = history[history.length - 1].avgRank;
  const improvement = first - last; // Higher rank (lower number) means improvement

  const TrendIcon = improvement > 0 ? TrendingUp : (improvement < 0 ? TrendingDown : Minus);
  const trendColor = improvement > 0 ? 'text-emerald-500' : (improvement < 0 ? 'text-rose-500' : 'text-muted-foreground');
  const trendBg = improvement > 0 ? 'bg-emerald-500/10' : (improvement < 0 ? 'bg-rose-500/10' : 'bg-muted/10');

  // Custom Hub Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-md border border-primary/20 p-3 rounded-xl shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center gap-2 mb-2 border-b border-primary/10 pb-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
              {data.fullDate}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
              <span className="text-xs font-bold text-foreground">Ranking Local:</span>
            </div>
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
              <Trophy className="h-3 w-3 text-primary" />
              <span className="text-sm font-black text-primary">#{data.avgRank.toFixed(1)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-primary/10 bg-background/40 backdrop-blur-sm shadow-xl overflow-hidden h-full group transition-all duration-300 hover:border-primary/20">
      <CardHeader className="pb-2 space-y-0">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Histórico de Visibilidad
            </CardTitle>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-foreground truncate max-w-[150px]">
                {keyword}
              </span>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${trendColor} ${trendBg} border border-current/10 shadow-sm transition-transform group-hover:scale-105`}>
            <TrendIcon className="h-3.5 w-3.5" />
            {improvement !== 0 ? `${Math.abs(improvement).toFixed(1)} pts de evolución` : 'Sin cambios'}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pr-0">
        {/* We use isMounted to ensure Recharts measures a stable DOM */}
        <div className="w-full h-[180px] min-w-0 relative" style={{ opacity: isMounted ? 1 : 0, transition: 'opacity 0.5s ease-in' }}>
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                    <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="4 4" 
                  vertical={false} 
                  stroke="hsl(var(--primary))" 
                  opacity={0.08} 
                />
                <XAxis 
                  dataKey="formattedDate" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 800, fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <YAxis 
                  hide 
                  domain={['dataMin - 1', 'dataMax + 1']} 
                  reversed // In local SEO, Rank 1 is at the top
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="avgRank" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorPrimary)" 
                  animationDuration={2000}
                  animationEasing="ease-in-out"
                  activeDot={{ 
                    r: 6, 
                    fill: 'hsl(var(--background))', 
                    stroke: 'hsl(var(--primary))', 
                    strokeWidth: 3,
                    className: "shadow-lg shadow-primary/20"
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
