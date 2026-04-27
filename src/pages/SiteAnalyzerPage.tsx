import { useState } from 'react';
import { Globe, Search, ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dataForSeoService } from '@/features/keywords/services/dataForSeoService';
import type { DomainRankOverview, RankedKeywordItem } from '@/features/keywords/types/dataForSeo';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const NATIONAL_LOCATIONS = [
  { name: 'España', code: 2724 },
  { name: 'Colombia', code: 2170 },
  { name: 'México', code: 2484 },
  { name: 'Estados Unidos', code: 2840 },
  { name: 'Chile', code: 2152 },
  { name: 'Perú', code: 2604 },
  { name: 'Argentina', code: 2032 },
  { name: 'Ecuador', code: 2218 },
];

export function SiteAnalyzerPage() {
  const [targetUrl, setTargetUrl] = useState('');
  const [locationCode, setLocationCode] = useState<number>(2724); // Default Spain
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [overview, setOverview] = useState<DomainRankOverview | null>(null);
  const [keywords, setKeywords] = useState<RankedKeywordItem[]>([]);

  const handleAnalyze = async () => {
    if (!targetUrl) {
      toast.error('Por favor, ingresa una URL válida.');
      return;
    }

    const domain = targetUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];

    const confirmMsg = `¿Confirmas analizar el dominio "${domain}"? Esto consumirá créditos de la API de DataForSEO.`;
    if (!window.confirm(confirmMsg)) {
      return;
    }

    setIsAnalyzing(true);
    setHasSearched(false);
    setOverview(null);
    setKeywords([]);

    try {
      const [overviewData, keywordsData] = await Promise.all([
        dataForSeoService.getDomainRankOverview(domain, locationCode),
        dataForSeoService.getDomainRankedKeywords(domain, locationCode)
      ]);

      setOverview(overviewData);
      setKeywords(keywordsData);
      
      toast.success('Análisis completado con éxito.');
    } catch (error) {
      console.error('Error analyzing domain:', error);
      toast.error('Hubo un error al analizar el dominio. Revisa la consola para más detalles.');
    } finally {
      setIsAnalyzing(false);
      setHasSearched(true);
    }
  };

  const getPositionChangeIcon = (isNew: boolean, isUp: boolean, isDown: boolean, isLost: boolean) => {
    if (isNew || isUp) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (isDown || isLost) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Explorador de Dominios</h1>
        <p className="text-muted-foreground text-lg">
          Analiza cualquier sitio web para ver su tráfico estimado y las palabras clave por las que posiciona.
        </p>
      </div>

      <Card className="border-2 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-brand-primary/10 to-transparent p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Dominio o URL a analizar
              </label>
              <div className="relative group">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-primary group-focus-within:scale-110 transition-transform" />
                <Input 
                  placeholder="ej: amazon.es, mercadolibre.com.co..."
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="pl-11 h-12 rounded-xl bg-background border-2 text-lg transition-all hover:border-brand-primary/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
              </div>
            </div>

            <div className="flex-1 w-full lg:w-48 shrink-0 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                País de Análisis
              </label>
              <Select 
                value={locationCode.toString()} 
                onValueChange={(val) => setLocationCode(Number(val))}
              >
                <SelectTrigger className="h-12 rounded-xl bg-background border-2 text-lg transition-all hover:border-brand-primary/50">
                  <SelectValue placeholder="Selecciona un país" />
                </SelectTrigger>
                <SelectContent>
                  {NATIONAL_LOCATIONS.map((loc) => (
                    <SelectItem key={loc.code} value={loc.code.toString()}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              size="lg"
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="h-12 px-8 w-full lg:w-auto rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              {isAnalyzing ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analizando...</>
              ) : (
                <><Search className="mr-2 h-5 w-5" /> Explorar Sitio</>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {overview && overview.metrics && overview.metrics.organic && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="bg-gradient-to-br from-card to-brand-primary/5 border-2 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Tráfico Mensual Est.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-primary">
                {formatNumber(overview.metrics.organic.etv)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-card to-blue-500/5 border-2 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Total Keywords Orgánicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatNumber(overview.metrics.organic.count)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-emerald-500/5 border-2 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Costo Eqv. en Ads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(overview.metrics.organic.cost)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-purple-500/5 border-2 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Top 10 Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {formatNumber(overview.metrics.organic.pos_1 + overview.metrics.organic.pos_2_3 + overview.metrics.organic.pos_4_10)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Top 3: {formatNumber(overview.metrics.organic.pos_1 + overview.metrics.organic.pos_2_3)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {keywords.length > 0 && (
        <Card className="border-2 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Top Palabras Clave Posicionadas
            </CardTitle>
            <p className="text-sm text-muted-foreground">Mostrando hasta las mejores 100 palabras clave donde este dominio aparece en Google.</p>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold">Palabra Clave</TableHead>
                    <TableHead className="font-semibold text-center w-24">Posición</TableHead>
                    <TableHead className="font-semibold text-right w-32">Volumen</TableHead>
                    <TableHead className="font-semibold text-right w-24">CPC</TableHead>
                    <TableHead className="font-semibold">URL de Destino</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keywords.map((kw, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        {kw.keyword_data?.keyword}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-brand-primary/10 text-brand-primary font-bold text-xs">
                          {kw.ranked_serp_element?.serp_item?.rank_absolute || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatNumber(kw.keyword_data?.keyword_info?.search_volume || 0)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {kw.keyword_data?.keyword_info?.cpc ? formatCurrency(kw.keyword_data.keyword_info.cpc) : '-'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                        <a 
                          href={kw.ranked_serp_element?.serp_item?.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-brand-primary hover:underline"
                        >
                          {kw.ranked_serp_element?.serp_item?.url.replace(/^https?:\/\//, '')}
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {hasSearched && !isAnalyzing && (!overview || !overview.metrics || !overview.metrics.organic) && keywords.length === 0 && (
        <Card className="border-2 shadow-sm border-dashed bg-muted/20 animate-in fade-in duration-500">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Globe className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No se encontraron datos</h3>
            <p className="text-muted-foreground max-w-md">
              Es posible que el dominio ingresado sea muy nuevo o su volumen de tráfico orgánico en el país seleccionado no sea suficiente para aparecer en las bases de datos globales de análisis.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
