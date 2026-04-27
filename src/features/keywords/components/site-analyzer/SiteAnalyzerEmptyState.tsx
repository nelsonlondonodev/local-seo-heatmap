import { Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function SiteAnalyzerEmptyState() {
  return (
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
  );
}
