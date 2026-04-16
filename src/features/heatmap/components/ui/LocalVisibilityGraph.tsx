import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Area, AreaChart 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useRankingHistory } from '../../hooks/useRankingHistory';

interface LocalVisibilityGraphProps {
  placeId: string;
  keyword: string;
}

/**
 * Historical ranking chart component using Recharts.
 */
export function LocalVisibilityGraph({ placeId, keyword }: LocalVisibilityGraphProps) {
  const { data: history = [], isLoading } = useRankingHistory(placeId, keyword);

  if (isLoading || history.length < 2) {
    return null; // Don't show if loading or not enough data for a graph
  }

  // Format date for the X-axis
  const chartData = history.map(h => ({
    ...h,
    formattedDate: new Date(h.date).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short'
    })
  }));

  // Calculate trend
  const first = history[0].avgRank;
  const last = history[history.length - 1].avgRank;
  const improvement = first - last; // Lower is better in ranking

  const TrendIcon = improvement > 0 ? TrendingUp : (improvement < 0 ? TrendingDown : Minus);
  const trendColor = improvement > 0 ? 'text-emerald-500' : (improvement < 0 ? 'text-rose-500' : 'text-muted-foreground');

  return (
    <Card className="border-primary/10 bg-background/50 shadow-sm overflow-hidden h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
            Evolución de Visibilidad Local
          </CardTitle>
          <div className={`flex items-center gap-1.5 text-xs font-bold ${trendColor}`}>
            <TrendIcon className="h-4 w-4" />
            {improvement !== 0 ? `${Math.abs(improvement).toFixed(1)} pts de cambio` : 'Sin cambios'}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 pr-0">
        <div style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
            <XAxis 
              dataKey="formattedDate" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
              dy={10}
            />
            <YAxis 
              hide 
              domain={['dataMin - 1', 'dataMax + 1']} 
              reversed // Ranking #1 is better than #10
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: 'hsl(var(--primary))' }}
            />
            <Area 
              type="monotone" 
              dataKey="avgRank" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAvg)" 
              animationDuration={1500}
            />
          </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
