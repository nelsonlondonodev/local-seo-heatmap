import { motion } from 'framer-motion';
import { History, Search, Calendar, Grid3X3, MapPin, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const mockHistory = [
  { id: '1', keyword: 'peluquería cerca de mí', businessName: 'Salón Narbo', gridSize: '5x5', radiusKm: 3, createdAt: '2026-03-29T10:30:00Z', avgRank: 3.2, bestRank: 1 },
  { id: '2', keyword: 'barbería premium', businessName: 'Blond Bros Barber', gridSize: '3x3', radiusKm: 2, createdAt: '2026-03-28T15:45:00Z', avgRank: 5.8, bestRank: 2 },
  { id: '3', keyword: 'spa uñas Sabana', businessName: 'Narbo Spa', gridSize: '7x7', radiusKm: 5, createdAt: '2026-03-27T09:15:00Z', avgRank: 7.1, bestRank: 3 },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

function getRankVariant(rank: number): 'default' | 'secondary' | 'destructive' {
  if (rank <= 3) return 'default';
  if (rank <= 7) return 'secondary';
  return 'destructive';
}

export function HistoryPage() {
  const isLoading = false;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Historial de Búsquedas</h1>
          <p className="text-muted-foreground">Revisa y compara tus análisis anteriores</p>
        </div>
        <Badge variant="outline" className="gap-1"><History className="h-3 w-3" />{mockHistory.length} búsquedas</Badge>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}</div>
      ) : (
        <div className="space-y-4">
          {mockHistory.map((entry) => (
            <motion.div key={entry.id} variants={itemVariants}>
              <Card className="transition-all hover:border-primary/30 hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{entry.keyword}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{entry.businessName}</span>
                        <span className="flex items-center gap-1"><Grid3X3 className="h-3 w-3" />{entry.gridSize} • {entry.radiusKm} km</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(entry.createdAt).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right"><p className="text-xs text-muted-foreground">Mejor</p><Badge variant={getRankVariant(entry.bestRank)}>#{entry.bestRank}</Badge></div>
                      <div className="text-right"><p className="text-xs text-muted-foreground">Promedio</p><Badge variant={getRankVariant(Math.round(entry.avgRank))}>#{entry.avgRank.toFixed(1)}</Badge></div>
                      <Button variant="outline" size="sm">Ver</Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
