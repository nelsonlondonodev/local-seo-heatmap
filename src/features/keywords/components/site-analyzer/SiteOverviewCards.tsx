import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatCurrency } from '@/lib/utils';
import type { DomainRankOverview } from '../../types/dataForSeo';

interface SiteOverviewCardsProps {
  overview: DomainRankOverview;
}

export function SiteOverviewCards({ overview }: SiteOverviewCardsProps) {
  const organic = overview.metrics?.organic;
  if (!organic) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="bg-gradient-to-br from-card to-brand-primary/5 border-2 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Tráfico Mensual Est.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-brand-primary">
            {formatNumber(organic.etv)}
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
            {formatNumber(organic.count)}
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
            {formatCurrency(organic.cost)}
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
            {formatNumber(organic.pos_1 + organic.pos_2_3 + organic.pos_4_10)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Top 3: {formatNumber(organic.pos_1 + organic.pos_2_3)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
