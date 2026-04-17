import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { dataForSeoService } from '../services/dataForSeoService';
// Removed external useDebounce import - using local setTimeout instead

interface Location {
  location_code: number;
  location_name: string;
  location_type: string;
  country_iso_code: string;
}

interface LocationSelectorProps {
  onLocationSelect: (loc: Location) => void;
  selectedLocation?: Location;
}

export function LocationSelector({ onLocationSelect, selectedLocation }: LocationSelectorProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simple debounce logic if useDebounce doesn't exist
  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await dataForSeoService.getLocations(query);
        setResults(data.slice(0, 10)); // Limit to 10
        setShowResults(true);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm relative" ref={containerRef}>
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
        Ubicación (País, Ciudad...)
      </label>
      
      <div className="relative group">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-primary group-focus-within:scale-110 transition-transform" />
        <Input 
          placeholder="Ej: Chía, Colombia..." 
          value={selectedLocation ? selectedLocation.location_name : query}
          onChange={(e) => {
            if (selectedLocation) onLocationSelect(undefined as any); // Clear if starts typing
            setQuery(e.target.value);
            setShowResults(true);
          }}
          className="pl-10 h-10 rounded-xl bg-card border-2 transition-all hover:border-brand-primary/50"
        />
        {(query || selectedLocation) && (
          <button 
            onClick={() => {
              setQuery('');
              setResults([]);
              onLocationSelect(undefined as any);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showResults && (results.length > 0 || isLoading) && (
        <div className="absolute top-20 left-0 w-full bg-card border-2 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoading ? (
            <div className="p-4 flex items-center justify-center text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Buscando ubicaciones...
            </div>
          ) : (
            <ul className="max-h-60 overflow-y-auto divide-y divide-border/50">
              {results.map((loc) => (
                <li 
                  key={loc.location_code}
                  onClick={() => {
                    onLocationSelect(loc);
                    setShowResults(false);
                    setQuery('');
                  }}
                  className="px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors group flex flex-col"
                >
                  <span className="font-bold text-sm group-hover:text-brand-primary transition-colors">
                    {loc.location_name}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                    <span>{loc.location_type}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/30"></span>
                    <span>{loc.country_iso_code}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
