import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MAP_DEFAULT_CENTER } from '@/config/constants';
import { generateGridPoints } from '../utils/grid';
import { useHeatmaps } from '@/hooks';
import { searchService } from '../services/searchService';
import type { GridSize, HeatmapConfig, GridPoint } from '@/types';

/**
 * Custom hook to manage the heatmap state and logic.
 * Separates business logic from visual components.
 */
export function useHeatmap() {
  // 1. External Library Hooks (Always First)
  const location = useLocation();
  const navigate = useNavigate();
  const { saveHeatmap } = useHeatmaps();

  // 2. State Hooks (Grouped and Stable)
  const [keyword, setKeyword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [gridSize, setGridSize] = useState<GridSize>('5x5');
  const [radiusKm, setRadiusKm] = useState(3);
  const [center, setCenter] = useState<[number, number]>([
    MAP_DEFAULT_CENTER.lat,
    MAP_DEFAULT_CENTER.lng,
  ]);
  const [points, setPoints] = useState<GridPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFromHistory, setIsFromHistory] = useState(false);

  // 3. Memoized Values
  const isFormValid = useMemo(() => 
    keyword.trim().length > 0 && businessName.trim().length > 0
  , [keyword, businessName]);

  const currentConfig = useMemo<HeatmapConfig>(() => ({
    keyword,
    businessName,
    placeId,
    gridSize,
    radiusKm,
    centerLat: center[0],
    centerLng: center[1],
  }), [keyword, businessName, placeId, gridSize, radiusKm, center]);

  // 4. Side Effects (Always at the end of hooks section)
  
  // Effect: Detect if we came from history and load the data
  useEffect(() => {
    const historicalData = (location.state as any)?.heatmap;
    if (historicalData) {
      console.log('[DASHBOARD] Loading historical heatmap:', historicalData.id);
      
      setIsFromHistory(true);
      setKeyword(historicalData.keyword);
      setBusinessName(historicalData.business_name);
      setPlaceId(historicalData.place_id || '');
      setGridSize(historicalData.grid_size as GridSize);
      setRadiusKm(Number(historicalData.radius_km));
      setCenter([Number(historicalData.center_lat), Number(historicalData.center_lng)]);
      setPoints(historicalData.points);

      // Clear the navigation state so a page refresh doesn't trigger this again
      navigate(location.pathname, { replace: true, state: {} });
      
      toast.info('Mostrando resultados históricos del ' + new Date(historicalData.created_at).toLocaleDateString());
    }
  }, [location.state, navigate, location.pathname]);

  // Effect: Synchronize points when configuration changes (Reset rankings)
  useEffect(() => {
    // If we just loaded from history, don't overwrite with empty points
    if (isFromHistory) {
      setIsFromHistory(false);
      return;
    }

    const newPoints = generateGridPoints(center[0], center[1], gridSize, radiusKm);
    setPoints(newPoints);
  }, [center, gridSize, radiusKm, isFromHistory]);

  // 5. Actions / Handlers
  const runAnalysis = async () => {
    if (!isFormValid) return;

    try {
      setIsLoading(true);
      toast.loading('Ejecutando análisis de ranking local...', { id: 'search-heatmap' });
      
      const result = await searchService.executeSearch(currentConfig, points);
      
      // Persist to Supabase Cloud
      await saveHeatmap(result);
      
      setPoints(result.points);
      toast.success('¡Análisis completado y guardado!', { id: 'search-heatmap' });
    } catch (error) {
      console.error('Search failed', error);
      toast.error('Hubo un error al ejecutar el análisis o guardar los datos.', { id: 'search-heatmap' });
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
