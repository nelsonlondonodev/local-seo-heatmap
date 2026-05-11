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
        "flex items-center p-2.5 rounded-xl border transition-all active:scale-95 gap-3 h-12 w-full",
        isActive
          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]"
          : "border-zinc-800 bg-white/5 hover:border-zinc-700 text-muted-foreground"
      )}
    >
      <div className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
        isActive ? "bg-primary/20" : "bg-zinc-800"
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col items-start leading-none gap-1">
        <span className="text-[11px] font-black tracking-tight">{label}</span>
        <span className="text-[8px] uppercase tracking-widest opacity-50 font-bold">{description}</span>
      </div>
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
        <Label htmlFor="keyword" className="text-xs font-black uppercase text-zinc-500 tracking-widest">Palabra clave de búsqueda</Label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search className="h-4 w-4" />
          </div>
          <Input
            id="keyword"
            placeholder="ej: peluquería cerca de mí"
            className="pl-9 h-12 bg-zinc-900/50 border-zinc-800 transition-all focus:ring-primary/20 rounded-xl focus:border-primary/50"
            value={heatmap.keyword}
            onChange={(e) => heatmap.setKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-5">
        {/* 3. Where: Radius */}
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Radio de Análisis (km)</Label>
          <Select
            value={String(heatmap.radiusKm)}
            onValueChange={(v) => heatmap.setRadiusKm(Number(v))}
          >
            <SelectTrigger className="h-12 bg-zinc-900/50 border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors focus:ring-primary/20">
              <SelectValue placeholder="Radio" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900/95 backdrop-blur-xl border-zinc-700/50 shadow-2xl">
              {RADIUS_OPTIONS.map((radius) => (
                <SelectItem key={radius} value={String(radius)} className="focus:bg-primary/20 focus:text-primary font-bold py-3 cursor-pointer">
                  {radius} km
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 4. Density: Grid Size */}
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Densidad de Puntos (Grid)</Label>
          <div className="grid grid-cols-3 gap-3">
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
      <div className="space-y-2 pt-4 border-t border-zinc-800/50">
        <Label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Coordenadas del Centro</Label>
        <div className="relative group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 shadow-inner">
          <p className="text-xs font-bold font-mono text-zinc-400">
            {heatmap.center[0].toFixed(6)}, {heatmap.center[1].toFixed(6)}
          </p>
          <button 
            type="button"
            onClick={heatmap.handleResetCenter}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-primary transition-all shadow-sm border border-zinc-700/50 active:scale-95"
            title="Resetear al centro original"
          >
            <Crosshair className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="pt-2">
        <CostIndicator estimatedCost={heatmap.estimatedCost} />
      </div>
    </div>
  );
}

