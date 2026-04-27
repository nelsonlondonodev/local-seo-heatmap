import { Globe, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NATIONAL_LOCATIONS } from '../../config/siteAnalyzer';

interface DomainSearchFormProps {
  targetUrl: string;
  setTargetUrl: (url: string) => void;
  locationCode: number;
  setLocationCode: (code: number) => void;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

export function DomainSearchForm({
  targetUrl,
  setTargetUrl,
  locationCode,
  setLocationCode,
  isAnalyzing,
  onAnalyze
}: DomainSearchFormProps) {
  return (
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
                onKeyDown={(e) => e.key === 'Enter' && onAnalyze()}
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
            onClick={onAnalyze} 
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
  );
}
