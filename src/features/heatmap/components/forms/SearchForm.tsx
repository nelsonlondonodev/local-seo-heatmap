import { Search } from 'lucide-react';
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

// Sub-components
import { SectionLabel } from './FormAtoms';
import { DensityButton } from './DensityButton';
import { CoordinateBox } from './CoordinateBox';

interface SearchFormProps {
  heatmap: ReturnType<typeof useHeatmap>;
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
