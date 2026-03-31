import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { MAP_DEFAULT_CENTER } from '@/config/constants';
import { generateGridPoints } from '../utils/grid';
import { searchService } from '../services/searchService';
import type { GridSize, HeatmapConfig, GridPoint } from '@/types';

/**
 * Custom hook to manage the heatmap state and logic.
 * Separates business logic from visual components.
 */
export function useHeatmap() {
  const [keyword, setKeyword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [gridSize, setGridSize] = useState<GridSize>('5x5');
  const [radiusKm, setRadiusKm] = useState(3);
  const [center, setCenter] = useState<[number, number]>([
    MAP_DEFAULT_CENTER.lat,
    MAP_DEFAULT_CENTER.lng,
  ]);
  
  // Points state to allow manual updates (from search results)
  const [points, setPoints] = useState<GridPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Synchronize points when configuration changes (Reset rankings)
  useEffect(() => {
    const newPoints = generateGridPoints(center[0], center[1], gridSize, radiusKm);
    setPoints(newPoints);
  }, [center, gridSize, radiusKm]);

  // Derived Values
  const isFormValid = keyword.trim().length > 0 && businessName.trim().length > 0;

  const currentConfig = useMemo<HeatmapConfig>(() => ({
    keyword,
    businessName,
    placeId,
    gridSize,
    radiusKm,
    centerLat: center[0],
    centerLng: center[1],
  }), [keyword, businessName, placeId, gridSize, radiusKm, center]);

  // Actions
  const runAnalysis = async () => {
    if (!isFormValid) return;

    try {
      setIsLoading(true);
      toast.loading('Ejecutando análisis de ranking local...', { id: 'search-heatmap' });
      
      const result = await searchService.executeSearch(currentConfig, points);
      
      setPoints(result.points);
      toast.success('¡Análisis completado!', { id: 'search-heatmap' });
    } catch (error) {
      console.error('Search failed', error);
      toast.error('Hubo un error al ejecutar el análisis.', { id: 'search-heatmap' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setCenter([lat, lng]);
  };

  const handleResetCenter = () => {
    setCenter([MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng]);
  };

  return {
    // State
    keyword,
    businessName,
    placeId,
    gridSize,
    radiusKm,
    center,
    points,
    isLoading,
    isFormValid,

    // Setters
    setKeyword,
    setBusinessName,
    setPlaceId,
    setGridSize,
    setRadiusKm,
    
    // Actions
    handleMapClick,
    handleResetCenter,
    runAnalysis,
  };
}
