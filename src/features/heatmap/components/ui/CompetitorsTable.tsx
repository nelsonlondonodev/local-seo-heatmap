import { motion } from 'framer-motion';
import { Trophy, Users, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { isBusinessMatch, cleanBusinessName } from '../../utils/textUtils';
import type { CompetitorStat } from '@/types';

interface CompetitorsTableProps {
  competitors: CompetitorStat[];
  targetBusinessName: string;
  targetPlaceId?: string;
  keyword: string;
}

/**
 * Sub-component for a single competitor row
 */
function CompetitorRow({ 
  comp, 
  idx, 
  isTarget, 
  isThreat 
}: { 
  comp: CompetitorStat; 
  idx: number; 
  isTarget: boolean; 
  isThreat: boolean;
}) {
  const cleanName = cleanBusinessName(comp.name);
  
  const medalStyles = [
    'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-none', // 1st
    'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200',      // 2nd
    'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',      // 3rd
  ];

  return (
    <tr className={`transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 ${isTarget ? 'bg-zinc-100 dark:bg-zinc-800/50' : ''}`}>
      <td className="p-4 align-middle">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold border border-transparent ${
          idx < 3 ? medalStyles[idx] : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400'
        }`}>
          {idx + 1}
        </div>
      </td>
      <td className="p-4 align-middle">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className={`text-sm tracking-tight ${isTarget ? 'font-semibold text-zinc-950 dark:text-white' : 'font-medium text-zinc-800 dark:text-zinc-200'}`}>
              {cleanName}
            </span>
            {isTarget && <Badge className="h-4 text-[9px] px-1.5 uppercase bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-none cursor-default">Tu Negocio</Badge>}
            {isThreat && (
              <Badge variant="outline" className="h-4 text-[9px] px-1.5 uppercase border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-500 gap-1 bg-rose-50 dark:bg-rose-950/30">
                <AlertCircle className="h-2.5 w-2.5" /> Amenaza
              </Badge>
            )}
          </div>
          {cleanName !== comp.name && (
            <span className="text-[10px] text-muted-foreground italic truncate max-w-[180px]">
              {comp.name}
            </span>
          )}
        </div>
      </td>
      <td className="p-4 align-middle text-center">
        <Badge variant="secondary" className="font-mono font-bold text-xs bg-muted/50">
          #{comp.avgRank.toFixed(1)}
        </Badge>
      </td>
      <td className="p-4 align-middle text-center">
        <div className="flex flex-col">
          <span className="text-sm font-bold tabular-nums">{comp.top3Count}</span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Puntos</span>
        </div>
      </td>
      <td className="p-4 align-middle">
        <div className="flex items-center justify-end gap-3">
          <div className="w-24 hidden md:block h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${comp.shareOfLocalPack}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full ${idx === 0 ? 'bg-zinc-950 dark:bg-white' : 'bg-zinc-400 dark:bg-zinc-600'}`}
            />
          </div>
          <span className="text-right tabular-nums w-12 font-black text-sm">{comp.shareOfLocalPack}%</span>
        </div>
      </td>
    </tr>
  );
}

/**
 * Sub-component for the footer insight
 */
function DominanceInsight({ leaderName, marketShare }: { leaderName: string; marketShare: number }) {
  return (
    <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-col sm:flex-row gap-5 items-center">
        <div className="h-12 w-12 shrink-0 bg-white dark:bg-zinc-950 rounded-xl flex items-center justify-center text-zinc-950 dark:text-white border border-zinc-200 dark:border-zinc-800 shadow-none">
          <BarChart3 className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <p className="text-sm font-semibold text-zinc-950 dark:text-white">Visualización del Market Share</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            El líder del mercado local es <strong className="text-zinc-950 dark:text-white">{cleanBusinessName(leaderName)}</strong>, quien captura el <strong className="text-zinc-950 dark:text-white">{marketShare}%</strong> de las apariciones en el Top 3 (Local Pack).
          </p>
        </div>
        <div className="shrink-0 flex gap-2">
          <Badge variant="outline" className="text-[10px] font-semibold text-zinc-950 dark:text-white bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 py-1.5 shadow-none">
            <TrendingUp className="h-3 w-3 mr-1.5" strokeWidth={2} /> ALTA DINÁMICA
          </Badge>
        </div>
      </div>
    </div>
  );
}

/**
 * Main CompetitorsTable Component
 */
export function CompetitorsTable({ 
  competitors, 
  targetBusinessName, 
  targetPlaceId,
  keyword 
}: CompetitorsTableProps) {
  return (
    <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-none bg-white dark:bg-zinc-950 rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4 text-zinc-950 dark:text-white" strokeWidth={2} />
            Líderes del Mercado Local
          </CardTitle>
          <CardDescription className="text-zinc-500 mt-1">Dominancia en el Top 3 (Local Pack) para "{keyword}"</CardDescription>
        </div>
        <div className="hidden sm:block">
          <Badge variant="outline" className="gap-1.5 px-3 py-1 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
            <Users className="h-3 w-3" strokeWidth={2} />
            {competitors.length} Competidores
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="h-10 px-4 text-left align-middle font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Pos</th>
                <th className="h-10 px-4 text-left align-middle font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Negocio</th>
                <th className="h-10 px-4 text-center align-middle font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Avg Rank</th>
                <th className="h-10 px-4 text-center align-middle font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Top 3</th>
                <th className="h-10 px-4 text-right align-middle font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Market Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {competitors.map((comp, idx) => {
                const isTarget = isBusinessMatch(targetBusinessName, comp.name, targetPlaceId || '', '');
                const isThreat = !isTarget && comp.avgRank < 5 && comp.shareOfLocalPack < 30;
                
                return (
                  <CompetitorRow 
                    key={idx} 
                    comp={comp} 
                    idx={idx} 
                    isTarget={isTarget} 
                    isThreat={isThreat} 
                  />
                );
              })}
              
              {competitors.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 opacity-20" />
                      <p>No hay suficientes datos de competencia en este área.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {competitors.length > 0 && (
          <DominanceInsight 
            leaderName={competitors[0].name} 
            marketShare={competitors[0].shareOfLocalPack} 
          />
        )}
      </CardContent>
    </Card>
  );
}
