import { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Loader2, X, Flag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dataForSeoService } from '../services/dataForSeoService';

import type { DataForSeoLocation } from '../types/dataForSeo';

interface LocationSelectorProps {
  onLocationSelect: (loc: DataForSeoLocation | null) => void;
  selectedLocation?: DataForSeoLocation | null;
  initialCountryCode?: string;
}

const COMMON_COUNTRIES = [
  { name: 'Colombia', code: 'co' },
  { name: 'España', code: 'es' },
  { name: 'México', code: 'mx' },
  { name: 'Chile', code: 'cl' },
  { name: 'Perú', code: 'pe' },
  { name: 'Argentina', code: 'ar' },
  { name: 'Estados Unidos', code: 'us' },
  { name: 'Ecuador', code: 'ec' },
];

export function LocationSelector({ onLocationSelect, selectedLocation, initialCountryCode }: LocationSelectorProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountryCode || 'co'); 
  const [cityQuery, setCityQuery] = useState('');
  const [allLocations, setAllLocations] = useState<DataForSeoLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update selected country if initialCountryCode changes
  useEffect(() => {
    if (initialCountryCode) {
      setSelectedCountry(initialCountryCode);
    }
  }, [initialCountryCode]);

  // Fetch all locations for the selected country once
  useEffect(() => {
    const loadLocations = async () => {
      setIsLoading(true);
      try {
        const data = await dataForSeoService.getLocationsByCountry(selectedCountry);
        setAllLocations(data || []);
      } catch (error) {
        console.error('Error loading locations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLocations();
  }, [selectedCountry]);

  // Filter locations client-side
  const filteredLocations = useMemo(() => {
    if (!cityQuery || cityQuery.length < 2) return [];
    const lowerQuery = cityQuery.toLowerCase();
    return allLocations
      .filter(loc => loc.location_name.toLowerCase().includes(lowerQuery))
      .slice(0, 50);
  }, [cityQuery, allLocations]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync cityQuery if a location is selected but not matching current query
  const displayValue = selectedLocation ? selectedLocation.location_name : cityQuery;

  return (
    <div className="flex flex-col gap-4 w-full" ref={containerRef}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Country Selector */}
        <div className="flex flex-col gap-2 w-full lg:w-40 shrink-0">
          <label 
            htmlFor="country-selector"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
          >
            País
          </label>
          <Select value={selectedCountry} onValueChange={(v) => setSelectedCountry(v as string)}>
            <SelectTrigger 
              id="country-selector"
              className="h-10 rounded-xl bg-card border-2 transition-all hover:border-brand-primary/50"
            >
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-brand-primary" />
                <SelectValue placeholder="País" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {COMMON_COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code} className="rounded-lg">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City/Town Search */}
        <div className="flex flex-col gap-2 w-full relative">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
            Ciudad / Pueblo
          </label>
          <div className="relative group">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-primary group-focus-within:scale-110 transition-transform" />
            <Input 
              placeholder={isLoading ? "Cargando ciudades..." : "Escribe ciudad... (ej: Chía)"}
              value={displayValue}
              disabled={isLoading}
              onChange={(e) => {
                const val = e.target.value;
                setCityQuery(val);
                if (selectedLocation) {
                  onLocationSelect(null);
                }
                setShowDropdown(true);
              }}
              onFocus={() => {
                if (selectedLocation) {
                  setCityQuery(selectedLocation.location_name);
                }
                setShowDropdown(true);
              }}
              className="pl-10 h-10 rounded-xl bg-card border-2 transition-all hover:border-brand-primary/50"
            />
            {isLoading && (
              <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-brand-primary/50" />
            )}
            {(cityQuery || selectedLocation) && (
              <button 
                type="button"
                onClick={() => {
                  setCityQuery('');
                  onLocationSelect(null);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Results */}
          {showDropdown && filteredLocations.length > 0 && (
            <div className="absolute top-full mt-2 left-0 w-full bg-card border-2 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <ul className="max-h-60 overflow-y-auto divide-y divide-border/50">
                {filteredLocations.map((loc) => (
                  <li 
                    key={`${loc.location_code}-${loc.location_name}`}
                    onClick={() => {
                      onLocationSelect(loc);
                      setShowDropdown(false);
                      setCityQuery('');
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
