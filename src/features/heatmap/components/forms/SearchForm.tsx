import { Search, Crosshair, Grid3X3, Zap, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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
import { cn } from '@/lib/utils';

interface SearchFormProps {
  heatmap: ReturnType<typeof useHeatmap>;
}

/**
 * Atomic Density Selector Button
 */
function DensityButton({ 
  label, 
  description, 
  value, 
  isActive, 
  onClick 
}: { 
  label: string; 
  description: string; 
  value: string; 
  isActive: boolean; 
  onClick: () => void;
}) {
  const IconMap: Record<string, LucideIcon> = {
    '3x3': Zap,
    '5x5': Layers,
    '7x7': Grid3X3
  };
  const Icon = IconMap[value] || Grid3X3;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border p-2 transition-all active:scale-95 gap-1 h-full",
        isActive
          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary shadow-sm"
          : "border-border bg-white/5 hover:border-primary/40 text-muted-foreground"
      )}
    >
      <div className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg mb-0.5 transition-colors",
        isActive ? "bg-primary/20" : "bg-zinc-800"
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-[10px] font-black">{label}</span>
      <span className="text-[8px] uppercase tracking-tighter opacity-60 font-bold">{description}</span>
    </button>
  );
}

export function SearchForm({ heatmap }: SearchFormProps) {
  return (
    <div className="space-y-6">
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
        <Label htmlFor="keyword" className="text-xs font-bold text-zinc-400">Palabra clave de búsqueda</Label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search className="h-4 w-4" />
          </div>
          <Input
            id="keyword"
            placeholder="ej: peluquería cerca de mí"
            className="pl-9 h-11 bg-white/5 border-zinc-800 transition-all focus:ring-primary/20 rounded-xl"
            value={heatmap.keyword}
            onChange={(e) => heatmap.setKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* 3. Where: Radius */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-zinc-400">Radio (km)</Label>
          <Select
            value={String(heatmap.radiusKm)}
            onValueChange={(v) => heatmap.setRadiusKm(Number(v))}
          >
            <SelectTrigger className="h-11 bg-white/5 border-zinc-800 rounded-xl hover:border-primary/40 transition-colors">
              <SelectValue placeholder="Radio" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-800">
              {RADIUS_OPTIONS.map((radius) => (
                <SelectItem key={radius} value={String(radius)} className="focus:bg-primary/20 focus:text-primary font-bold">
                  {radius} km
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 4. Density: Grid Size */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Densidad Grid</Label>
          <div className="grid grid-cols-3 gap-2">
            {GRID_OPTIONS.map((option) => (
              <DensityButton
                key={option.value}
                {...option}
                isActive={heatmap.gridSize === option.value}
                onClick={() => heatmap.setGridSize(option.value)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 5. Location Reference */}
      <div className="space-y-3 pt-4 border-t border-zinc-800/50">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Coordenadas Centro</Label>
          <button 
            type="button"
            onClick={heatmap.handleResetCenter}
            className="text-[10px] font-black text-primary hover:underline flex items-center gap-1 uppercase tracking-tighter"
          >
            <Crosshair className="h-3 w-3" /> Resetear
          </button>
        </div>
        <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-3 text-center shadow-inner">
          <p className="text-[11px] font-bold font-mono text-zinc-400">
            {heatmap.center[0].toFixed(6)}, {heatmap.center[1].toFixed(6)}
          </p>
        </div>
      </div>

      <CostIndicator estimatedCost={heatmap.estimatedCost} />
    </div>
  );
}

