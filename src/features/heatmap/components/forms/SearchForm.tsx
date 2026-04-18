import { Search, Crosshair } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GRID_OPTIONS, RADIUS_OPTIONS } from '@/config/constants';
import { BusinessSearch, CostIndicator, type PlaceSuggestion } from '@/features/heatmap';
import { useHeatmap } from '../../hooks/useHeatmap';
import type { GridSize } from '@/types';

interface SearchFormProps {
  heatmap: ReturnType<typeof useHeatmap>;
}

export function SearchForm({ heatmap }: SearchFormProps) {
  return (
    <div className="space-y-5">
      {/* 1. Who: Business Search */}
      <BusinessSearch 
        initialValue={heatmap.businessName}
        selectedPlaceId={heatmap.placeId}
        onSelect={(place: PlaceSuggestion) => {
          heatmap.setBusinessName(place.name);
          heatmap.setPlaceId(place.placeId);
          heatmap.handleMapClick(place.lat, place.lng);
        }}
        onClear={() => {
          heatmap.setBusinessName('');
          heatmap.setPlaceId('');
        }}
      />

      {/* 2. What: Keyword */}
      <div className="space-y-2">
        <Label htmlFor="keyword">Palabra clave de búsqueda</Label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search className="h-4 w-4" />
          </div>
          <Input
            id="keyword"
            placeholder="ej: peluquería cerca de mí"
            className="pl-9 transition-all focus:ring-primary/20"
            value={heatmap.keyword}
            onChange={(e) => heatmap.setKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 3. Where: Radius */}
        <div className="space-y-2">
          <Label>Radio (km)</Label>
          <Select
            value={String(heatmap.radiusKm)}
            onValueChange={(v) => heatmap.setRadiusKm(Number(v))}
          >
            <SelectTrigger className="hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Radio" />
            </SelectTrigger>
            <SelectContent>
              {RADIUS_OPTIONS.map((radius) => (
                <SelectItem key={radius} value={String(radius)}>
                  {radius} km
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 4. Density: Grid Size */}
        <div className="space-y-2">
          <Label>Grid</Label>
          <Select
            value={heatmap.gridSize}
            onValueChange={(v) => heatmap.setGridSize(v as GridSize)}
          >
            <SelectTrigger className="hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Grid" />
            </SelectTrigger>
            <SelectContent>
              {GRID_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 5. Location Reference */}
      <div className="space-y-2 pt-2 border-t border-border/50">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Coordenadas Centro</Label>
          <button 
            type="button"
            onClick={heatmap.handleResetCenter}
            className="text-[10px] text-primary hover:underline flex items-center gap-1"
          >
            <Crosshair className="h-3 w-3" /> Resetear
          </button>
        </div>
        <div className="rounded-lg bg-secondary/30 p-2 text-center">
          <p className="text-[11px] font-medium font-mono text-muted-foreground">
            {heatmap.center[0].toFixed(6)}, {heatmap.center[1].toFixed(6)}
          </p>
        </div>
      </div>

      <CostIndicator estimatedCost={heatmap.estimatedCost} />
    </div>
  );
}
