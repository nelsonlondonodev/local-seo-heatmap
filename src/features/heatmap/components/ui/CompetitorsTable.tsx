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

export function CompetitorsTable({ 
  competitors, 
  targetBusinessName, 
  targetPlaceId,
  keyword 
}: CompetitorsTableProps) {
  return (
    <Card className="overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0 bg-gradient-to-r from-primary/5 to-transparent">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500 animate-pulse" />
            Líderes del Mercado Local
          </CardTitle>
          <CardDescription>Dominancia en el Top 3 (Local Pack) para "{keyword}"</CardDescription>
        </div>
        <div className="hidden sm:block">
          <Badge variant="outline" className="gap-1.5 px-3 py-1 bg-background/50 border-primary/20">
            <Users className="h-3.5 w-3.5 text-primary" />
            {competitors.length} Competidores Analizados
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
                const cleanName = cleanBusinessName(comp.name);
                const isThreat = !isTarget && comp.avgRank < 5 && comp.shareOfLocalPack < 30;

                return (
                  <tr key={idx} className={`transition-all hover:bg-primary/5 ${isTarget ? 'bg-primary/10' : ''}`}>
                    <td className="p-4 align-middle">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                        idx === 0 ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/50' : 
                        idx === 1 ? 'bg-slate-400 text-white' :
                        idx === 2 ? 'bg-amber-700 text-white' :
                        'bg-secondary text-muted-foreground'
                      }`}>
                        {idx + 1}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm tracking-tight ${isTarget ? 'font-bold text-primary' : 'font-medium'}`}>
                            {cleanName}
                          </span>
                          {isTarget && <Badge className="h-4 text-[9px] px-1.5 uppercase bg-primary hover:bg-primary cursor-default">Tu Negocio</Badge>}
                          {isThreat && (
                            <Badge variant="outline" className="h-4 text-[9px] px-1.5 uppercase border-rose-500/50 text-rose-500 gap-1 bg-rose-500/5">
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
                        <div className="w-24 hidden md:block h-1.5 bg-secondary rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${comp.shareOfLocalPack}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full ${idx === 0 ? 'bg-amber-500' : 'bg-primary'}`}
                          />
                        </div>
                        <span className="text-right tabular-nums w-12 font-black text-sm">{comp.shareOfLocalPack}%</span>
                      </div>
                    </td>
                  </tr>
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
          <div className="p-6 bg-primary/5 border-t border-border/50">
            <div className="flex flex-col sm:flex-row gap-5 items-center">
              <div className="h-12 w-12 shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="flex-1 text-center sm:text-left space-y-1">
                <p className="text-sm font-bold text-foreground">Visualización del Market Share</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  El líder del mercado local es <strong className="text-foreground">{cleanBusinessName(competitors[0].name)}</strong>, quien captura el <strong className="text-primary">{competitors[0].shareOfLocalPack}%</strong> de las apariciones en el Top 3 (Local Pack).
                </p>
              </div>
              <div className="shrink-0 flex gap-2">
                <Badge variant="outline" className="text-[10px] font-bold text-primary bg-primary/5 border-primary/20 py-1.5">
                  <TrendingUp className="h-3.5 w-3.5 mr-1.5" /> ALTA DINÁMICA
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
