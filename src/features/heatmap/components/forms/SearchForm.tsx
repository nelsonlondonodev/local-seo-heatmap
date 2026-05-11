import { Search, Crosshair, Grid3X3, Zap, Layers } from 'lucide-react';
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
import { cn } from '@/lib/utils';

interface SearchFormProps {
  heatmap: ReturnType<typeof useHeatmap>;
}

export function SearchForm({ heatmap }: SearchFormProps) {
  const getGridIcon = (val: string) => {
    if (val === '3x3') return <Zap className="h-3 w-3" />;
    if (val === '5x5') return <Layers className="h-3 w-3" />;
    return <Grid3X3 className="h-3 w-3" />;
  };

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
          <Label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Densidad Grid</Label>
          <div className="grid grid-cols-3 gap-2">
            {GRID_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => heatmap.setGridSize(option.value)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border p-2 transition-all active:scale-95 gap-1",
                  heatmap.gridSize === option.value
                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                    : "border-border bg-white/5 hover:border-primary/40 text-muted-foreground"
                )}
              >
                <div className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-lg mb-0.5",
                  heatmap.gridSize === option.value ? "bg-primary/20" : "bg-muted/50"
                )}>
                  {getGridIcon(option.value)}
                </div>
                <span className="text-[10px] font-black">{option.label}</span>
                <span className="text-[8px] uppercase tracking-tighter opacity-60 font-bold">{option.description}</span>
              </button>
            ))}
          </div>
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
