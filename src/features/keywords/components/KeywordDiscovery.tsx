import { useState } from 'react';
import { Search, Plus, Loader2, Info, TrendingUp, DollarSign, BarChart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { dataForSeoService } from '../services/dataForSeoService';
import type { KeywordSuggestion } from '../types/dataForSeo';

export function KeywordDiscovery() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<KeywordSuggestion[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const data = await dataForSeoService.getKeywordSuggestions(query);
      setResults(data);
      if (data.length === 0) {
        toast.info('No se encontraron sugerencias para esta palabra clave.');
      }
    } catch (error) {
      toast.error('Error al obtener sugerencias. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: number | null) => {
    if (difficulty === null) return 'bg-slate-500/10 text-slate-500';
    if (difficulty < 30) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (difficulty < 70) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search Bar Section */}
      <div className="relative max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/20 to-primary/20 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Ej. 'uñas acrílicas', 'fontanero urgente'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 h-14 rounded-2xl text-lg border-2 bg-card/80 backdrop-blur-sm focus-visible:ring-brand-primary/20"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-14 px-8 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-primary-foreground font-bold transition-all active:scale-95 flex gap-2"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Analizar'}
            </Button>
          </div>
        </form>
      </div>

      {/* Results Table Section */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-border/50 bg-card/30 backdrop-blur-md shadow-2xl">
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
                    <Badge variant="outline" className={`rounded-lg px-2 py-1 font-bold border-2 ${getDifficultyColor(item.keyword_difficulty)}`}>
                      {item.keyword_difficulty ?? 'N/A'}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      <span>{item.cpc?.toFixed(2) || '0.00'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="rounded-xl hover:bg-brand-primary hover:text-primary-foreground group-hover:scale-105 transition-all"
                      onClick={() => toast.success(`"${item.keyword}" añadida al seguimiento (Simulado)`)}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !isLoading && query && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-6 rounded-full bg-muted/20">
            <Info className="h-12 w-12 text-muted-foreground/30" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Sin resultados</h3>
            <p className="text-muted-foreground">Intenta con otra búsqueda o parámetros.</p>
          </div>
        </div>
      )}
    </div>
  );
}
