import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatNumber, formatCurrency } from '@/lib/utils';
import type { RankedKeywordItem } from '../../types/dataForSeo';

interface RankedKeywordsTableProps {
  keywords: RankedKeywordItem[];
}

export function RankedKeywordsTable({ keywords }: RankedKeywordsTableProps) {
  if (keywords.length === 0) return null;

  return (
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
  );
}
