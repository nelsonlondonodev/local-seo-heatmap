import { Plus, BarChart, DollarSign, CheckCircle2, Download, Copy, FileSpreadsheet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { exportToCsv, copyToClipboardAsTsv } from '@/util/exportUtils';
import type { KeywordSuggestion } from '../types/dataForSeo';

interface DiscoveryResultsTableProps {
  results: KeywordSuggestion[];
  savedKeywords: Set<string>;
  onAddKeyword: (keyword: string) => void;
  onViewMonitoring?: () => void;
}

export function DiscoveryResultsTable({ results, savedKeywords, onAddKeyword, onViewMonitoring }: DiscoveryResultsTableProps) {
  const getDifficultyColor = (difficulty: number | null) => {
    if (difficulty === null) return 'bg-slate-500/10 text-slate-500';
    if (difficulty < 30) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (difficulty < 70) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
  };

  const handleExportCsv = () => {
    const exportData = results.map(item => ({
      Palabra: item.keyword,
      Volumen: item.search_volume || 0,
      Dificultad: item.keyword_difficulty ?? item.competition_index ?? 'N/A',
      CPC: item.cpc || 0,
      Fuente: 'DataForSEO'
    }));
    exportToCsv(exportData, `investigacion_keywords_${new Date().toISOString().split('T')[0]}`);
  };

  const handleCopy = () => {
    const exportData = results.map(item => ({
      Palabra: item.keyword,
      Volumen: item.search_volume || 0,
      Dificultad: item.keyword_difficulty ?? item.competition_index ?? 'N/A',
      CPC: item.cpc || 0
    }));
    void copyToClipboardAsTsv(exportData);
  };

  return (
    <div className="space-y-4">
      {/* Table Actions Header */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-brand-primary" />
          <h3 className="font-bold text-lg">Resultados del Análisis</h3>
          <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[10px]">
            {results.length} sugerencias
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy}
            className="rounded-xl border-2 hover:bg-brand-primary/10 transition-all h-9"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar tabla
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCsv}
            className="rounded-xl border-2 hover:bg-brand-primary/10 transition-all h-9"
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar CSV
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border/50 bg-card/30 backdrop-blur-md shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-6 py-4 font-semibold text-sm">Palabra Clave</th>
              <th className="px-6 py-4 font-semibold text-sm">Volumen</th>
              <th className="px-6 py-4 font-semibold text-sm">Dificultad</th>
              <th className="px-6 py-4 font-semibold text-sm">CPC (Est.)</th>
              <th className="px-6 py-4 font-semibold text-sm text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {results.map((item, idx) => (
              <tr key={idx} className="hover:bg-muted/30 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">{item.keyword}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Google Organic</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-brand-primary/70" />
                    <span className="font-medium">{(item.search_volume || 0).toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <Badge variant="outline" className={`rounded-lg px-2 py-1 font-bold border-2 ${getDifficultyColor(item.keyword_difficulty ?? item.competition_index ?? null)}`}>
                    {item.keyword_difficulty ?? item.competition_index ?? 'N/A'}
                  </Badge>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    <span>{item.cpc?.toFixed(2) || '0.00'}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  {savedKeywords.has(item.keyword.toLowerCase()) ? (
                    <div className="flex items-center justify-end gap-3 pr-2 animate-in zoom-in-50 duration-300">
                      <div className="flex items-center text-emerald-500 gap-2 font-semibold">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="text-sm">Guardada</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={onViewMonitoring}
                        className="text-xs h-8 rounded-lg border border-border/50 hover:bg-brand-primary/10 hover:text-brand-primary"
                      >
                        Ver seguimiento
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="rounded-xl hover:bg-brand-primary hover:text-primary-foreground group-hover:scale-105 transition-all h-10 w-10 p-0"
                      onClick={() => onAddKeyword(item.keyword)}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}
