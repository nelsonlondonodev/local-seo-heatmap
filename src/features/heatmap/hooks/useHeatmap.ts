import { useState, useMemo } from 'react';
import { MAP_DEFAULT_CENTER } from '@/config/constants';
import { generateGridPoints } from '../utils/grid';
import type { GridSize } from '@/types';

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

  // Derive points reactively
  const points = useMemo(() => {
    return generateGridPoints(center[0], center[1], gridSize, radiusKm);
  }, [center, gridSize, radiusKm]);

  // Handlers
  const handleMapClick = (lat: number, lng: number) => {
    setCenter([lat, lng]);
  };

  const handleResetCenter = () => {
    setCenter([MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng]);
  };

  const isFormValid = keyword.trim().length > 0 && businessName.trim().length > 0;

  return {
    // State
    keyword,
    businessName,
    placeId,
    gridSize,
    radiusKm,
    center,
    points,
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
  };
}
