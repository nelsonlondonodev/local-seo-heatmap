import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Star, Building2, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { placesService, type PlaceSuggestion } from '../services/placesService';

interface BusinessSearchProps {
  onSelect: (place: PlaceSuggestion) => void;
  onClear: () => void;
  initialValue?: string;
  selectedPlaceId?: string;
}

export function BusinessSearch({ onSelect, onClear, initialValue = '', selectedPlaceId }: BusinessSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceSuggestion | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update query when initialValue changes (history load)
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Handle Autocomplete
  useEffect(() => {
    if (selectedPlace) return; // Don't search if we already have a selection
    
    const handler = setTimeout(async () => {
      if (query.trim().length >= 3) {
        setIsSearching(true);
        try {
          const results = await placesService.searchPlaces(query);
          setSuggestions(results);
          setIsOpen(results.length > 0);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [query, selectedPlace]);

  const handleSelect = (place: PlaceSuggestion) => {
    setSelectedPlace(place);
    setQuery(place.name);
    setIsOpen(false);
    onSelect(place);
  };

  const handleClear = () => {
    setSelectedPlace(null);
    setQuery('');
    setSuggestions([]);
    onClear();
  };

  // UI Para el ESTADO SELECCIONADO (Business Card)
  if (selectedPlace || selectedPlaceId) {
    const name = selectedPlace?.name || query;
    const address = selectedPlace?.address || "Ubicación cargada del historial";
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium leading-none">Negocio Seleccionado</label>
          <button 
            onClick={handleClear}
            className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
          >
            <X className="h-3 w-3" /> Cambiar
          </button>
        </div>
        
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 group transition-all hover:border-zinc-300 dark:hover:border-zinc-700 overflow-hidden relative shadow-none rounded-xl">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white border border-zinc-100 dark:border-zinc-800 transition-transform group-hover:scale-105">
                <Building2 className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-sm leading-tight">{name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{address}</span>
                </div>
                {selectedPlace?.rating && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center gap-0.5 text-yellow-500">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-[10px] font-bold">{selectedPlace.rating}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">({selectedPlace.userRatingsTotal} reseñas)</span>
                    <Badge variant="outline" className="text-[8px] h-4 py-0 bg-background/50">Google Verified</Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // UI Para el ESTADO DE BÚSQUEDA
  return (
    <div className="relative space-y-2" ref={containerRef}>
      <label className="text-xs font-semibold uppercase text-zinc-500 tracking-widest leading-none">Nombre del negocio</label>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-zinc-950 dark:group-focus-within:text-white">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
        <Input
          placeholder="Escribe el nombre del negocio..."
          className="pl-9 pr-4 h-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 transition-all focus:ring-zinc-950 dark:focus:ring-white rounded-xl focus:border-zinc-950 dark:focus:border-white shadow-none text-zinc-950 dark:text-white placeholder:text-zinc-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 3 && setIsOpen(suggestions.length > 0)}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="absolute left-0 right-0 top-full z-50 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl backdrop-blur-md"
          >
            <div className="max-h-[300px] overflow-auto p-1.5 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
              <div className="px-2 py-1.5 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Resultados Sugeridos
              </div>
              <div className="space-y-1">
                {suggestions.map((place) => (
                  <button
                    key={place.placeId}
                    onClick={() => handleSelect(place)}
                    className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 focus:bg-zinc-50 dark:focus:bg-zinc-900 focus:outline-none"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-500 flex-shrink-0">
                      <Building2 className="h-4 w-4" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm line-clamp-1 text-zinc-950 dark:text-white">{place.name}</div>
                      <div className="text-xs text-zinc-500 line-clamp-1">{place.address}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
