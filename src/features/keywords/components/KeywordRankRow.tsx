import { RefreshCcw, TrendingUp, TrendingDown, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import type { TrackedKeyword } from '../types/keywords';

interface KeywordRankRowProps {
  kw: TrackedKeyword;
  isUpdating: boolean;
  onUpdate: (id: string, keyword: string) => void;
  onDelete: () => void;
}

export function KeywordRankRow({ kw, isUpdating, onUpdate, onDelete }: KeywordRankRowProps) {
  const getRankChange = (change: number | null | undefined) => {
    if (!change || change === 0) return <Minus className="h-3 w-3 text-muted-foreground" />;
    if (change > 0) return (
      <div className="flex items-center gap-1 text-emerald-500 font-bold">
        <TrendingUp className="h-3 w-3" />
        <span>+{change}</span>
      </div>
    );
    return (
      <div className="flex items-center gap-1 text-rose-500 font-bold">
        <TrendingDown className="h-3 w-3" />
        <span>{change}</span>
      </div>
    );
  };

  return (
    <tr className="hover:bg-muted/20 transition-colors group">
      <td className="px-6 py-5">
        <span className="font-bold text-foreground">{kw.keyword}</span>
      </td>
      <td className="px-6 py-5 text-center">
        {kw.latest_history?.rank ? (
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-brand-primary">
              #{kw.latest_history.rank}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Top 100
            </span>
          </div>
        ) : (
          <Badge variant="secondary" className="bg-muted text-muted-foreground border-none font-bold">
            N/A
          </Badge>
        )}
      </td>
      <td className="px-6 py-5 text-center">
        {getRankChange(kw.latest_history?.rank_change)}
      </td>
      <td className="px-6 py-5">
        <span className="text-sm text-muted-foreground">
          {kw.latest_history?.created_at 
            ? new Date(kw.latest_history.created_at).toLocaleDateString() 
            : 'Nunca'}
        </span>
      </td>
      <td className="px-6 py-5 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="rounded-xl hover:bg-brand-primary hover:text-primary-foreground transition-all"
            disabled={isUpdating}
            onClick={() => onUpdate(kw.id, kw.keyword)}
          >
            <RefreshCcw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
