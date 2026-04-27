import { useState, type FormEvent } from 'react';
import { Search, Loader2, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface DiscoverySearchFormProps {
  query: string;
  setQuery: (val: string) => void;
  isLoading: boolean;
  onSearch: (e: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  hasResults: boolean;
}

export function DiscoverySearchForm({ 
  query, 
  setQuery, 
  isLoading, 
  onSearch, 
  onClear,
  hasResults 
}: DiscoverySearchFormProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<FormEvent<HTMLFormElement> | null>(null);

  const handleSubmitRequest = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPendingEvent(e);
    setShowConfirm(true);
  };

  const confirmSearch = () => {
    if (pendingEvent) {
      onSearch(pendingEvent);
    }
    setShowConfirm(false);
    setPendingEvent(null);
  };

  return (
    <div className="w-full lg:max-w-xl">
      <form onSubmit={handleSubmitRequest} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/20 to-primary/20 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Busca ideas de palabras clave..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 h-12 rounded-2xl border-2 bg-card/80 backdrop-blur-sm focus-visible:ring-brand-primary/20"
            />
          </div>
          <div className="flex gap-2">
            {(hasResults || query) && !isLoading && (
              <Button 
                type="button" 
                variant="ghost"
                onClick={onClear}
                className="h-12 px-4 rounded-xl text-muted-foreground hover:text-destructive transition-all font-medium border-2 border-transparent hover:border-destructive/10"
              >
                Limpiar
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isLoading || !query.trim()}
              className="h-12 px-6 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-primary-foreground font-bold transition-all active:scale-95 shadow-lg shadow-brand-primary/20 shrink-0"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (hasResults ? 'Actualizar' : 'Analizar')}
            </Button>
          </div>
        </div>
      </form>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-amber-500">
              <AlertTriangle className="h-6 w-6" />
              Confirmar Análisis
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              Vas a realizar un análisis en vivo para el término <strong className="text-foreground">"{query}"</strong>. 
              Verifica que esté bien escrito.
              <br /><br />
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-500/80">
                Nota: Esta acción consumirá créditos de la API (DataForSEO).
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2 justify-end bg-transparent border-t-0 pb-0">
            <Button variant="ghost" onClick={() => setShowConfirm(false)} className="rounded-xl">
              Revisar palabra
            </Button>
            <Button onClick={confirmSearch} className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold">
              Sí, analizar ahora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
