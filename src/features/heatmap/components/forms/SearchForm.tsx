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
 * Atomic Section Label
 */
const SectionLabel = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Label className={cn("text-xs font-semibold uppercase text-zinc-500 tracking-widest", className)}>
    {children}
  </Label>
);

/**
 * Density Selector Button
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
  const IconMap: Record<string, LucideIcon> = { '3x3': Zap, '5x5': Layers, '7x7': Grid3X3 };
  const Icon = IconMap[value] || Grid3X3;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-2 rounded-xl border transition-all active:scale-95 gap-1.5 h-20 w-full",
        isActive
          ? "border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white ring-1 ring-zinc-950 dark:ring-white shadow-none"
          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500"
      )}
    >
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
        isActive ? "text-zinc-950 dark:text-white" : "text-zinc-400"
      )}>
        <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <div className="flex flex-col items-center leading-tight gap-0.5">
        <span className="text-xs font-bold tracking-tight">{label}</span>
        <span className="text-[7px] uppercase tracking-widest opacity-70 font-bold">{description}</span>
      </div>
    </button>
  );
}

/**
 * Coordinates Display with Reset
 */
function CoordinateBox({ center, onReset }: { center: [number, number], onReset: () => void }) {
  return (
    <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
      <SectionLabel className="text-[10px]">Coordenadas del Centro</SectionLabel>
      <div className="relative group overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-3 shadow-none">
        <p className="text-[11px] font-medium font-mono text-zinc-500 dark:text-zinc-400">
          {center[0].toFixed(6)}, {center[1].toFixed(6)}
        </p>
        <button 
          type="button"
          onClick={onReset}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-950 dark:text-white transition-colors border border-zinc-200 dark:border-zinc-800 active:scale-95"
          title="Resetear al centro original"
        >
          <Crosshair className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
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
        <SectionLabel>Palabra clave de búsqueda</SectionLabel>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-950 dark:group-focus-within:text-white transition-colors">
            <Search className="h-4 w-4" />
          </div>
          <input
            placeholder="ej: peluquería cerca de mí"
            className="w-full flex pl-9 h-11 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 transition-all focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white rounded-xl focus:border-zinc-950 dark:focus:border-white shadow-none text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 outline-none"
            value={heatmap.keyword}
            onChange={(e) => heatmap.setKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-5">
        {/* 3. Where: Radius */}
        <div className="space-y-2">
          <SectionLabel>Radio de Análisis (km)</SectionLabel>
          <Select
            value={String(heatmap.radiusKm)}
            onValueChange={(v) => heatmap.setRadiusKm(Number(v))}
          >
            <SelectTrigger className="h-11 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors focus:ring-1 focus:ring-zinc-950 dark:focus:ring-white shadow-none text-sm text-zinc-950 dark:text-white">
              <SelectValue placeholder="Radio" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl">
              {RADIUS_OPTIONS.map((radius) => (
                <SelectItem key={radius} value={String(radius)} className="focus:bg-zinc-50 dark:focus:bg-zinc-900 focus:text-zinc-950 dark:focus:text-white font-medium py-3 cursor-pointer">
                  {radius} km
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 4. Density: Grid Size */}
        <div className="space-y-2">
          <SectionLabel>Densidad de Puntos (Grid)</SectionLabel>
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

      <CoordinateBox center={heatmap.center} onReset={heatmap.handleResetCenter} />

      <div className="pt-2">
        <CostIndicator estimatedCost={heatmap.estimatedCost} />
      </div>
    </div>
  );
}

