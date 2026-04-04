import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MAP_DEFAULT_CENTER } from '@/config/constants';
import { generateGridPoints } from '../utils/grid';
import { useHeatmaps } from '@/hooks';
import { searchService } from '../services/searchService';
import type { GridSize, HeatmapConfig, GridPoint } from '@/types';
import type { Database } from '@/types/database';

/**
 * Custom hook to manage the heatmap state and logic.
 * Structured to be ultra-stable for React Reconciliation.
 */
export function useHeatmap() {
  // 1. Context & Navigation Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { saveHeatmap } = useHeatmaps();

  // 2. Persistent Refs
  const hasLoadedHistory = useRef(false);

  // 3. Application State
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

  // 4. Derived State (Computed values)
  const isFormValid = useMemo(() => {
    const k = keyword || '';
    const b = businessName || '';
    return k.trim().length > 0 && b.trim().length > 0;
  }, [keyword, businessName]);

  const currentConfig = useMemo<HeatmapConfig>(() => ({
    keyword: keyword || '',
    businessName: businessName || '',
    placeId: placeId || '',
    gridSize,
    radiusKm,
    centerLat: center[0],
    centerLng: center[1],
  }), [keyword, businessName, placeId, gridSize, radiusKm, center]);

  // 5. Side Effects
  
  // A. Load from History
  useEffect(() => {
    const state = location.state as { heatmap?: Database['public']['Tables']['heatmaps']['Row'] } | null;
    const historicalData = state?.heatmap;
    
    if (historicalData && !hasLoadedHistory.current) {
      hasLoadedHistory.current = true; // LOCK: Prevent grid sync from overwriting
      
      setKeyword(historicalData.keyword || '');
      setBusinessName(historicalData.business_name || '');
      setPlaceId(historicalData.place_id || '');
      setGridSize(historicalData.grid_size as GridSize);
      setRadiusKm(Number(historicalData.radius_km));
      setCenter([Number(historicalData.center_lat), Number(historicalData.center_lng)]);
      setPoints((historicalData.points as unknown as GridPoint[]) || []);

      toast.info(`Cargado: ${historicalData.keyword}`);
    }
  }, [location.state, navigate, location.pathname]);

  // B. Sync Grid Points
  useEffect(() => {
    // If the lock is active, skip any automatic sync
    if (hasLoadedHistory.current) return;

    const newPoints = generateGridPoints(center[0], center[1], gridSize, radiusKm);
    setPoints(newPoints);
  }, [center, gridSize, radiusKm]);

  // 6. Action Handlers (Explicit Unlockers)
  const handleMapClick = useCallback((lat: number, lng: number) => {
    hasLoadedHistory.current = false; // Manually break the lock
    setCenter([lat, lng]);
  }, []);

  const handleResetCenter = useCallback(() => {
    hasLoadedHistory.current = false; // Manually break the lock
    setCenter([MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng]);
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!isFormValid) return;
    hasLoadedHistory.current = false; // Manually break the lock

    try {
      setIsLoading(true);
      toast.loading('Iniciando análisis...', { id: 'search-exec' });
      
      const result = await searchService.executeSearch(currentConfig, points);
      
      // Save to Cloud
      await saveHeatmap(result);
      
      setPoints(result.points);
      toast.success('Análisis completado', { id: 'search-exec' });
    } catch (error) {
      console.error('Heatmap analysis failed', error);
      toast.error('Error al ejecutar el análisis', { id: 'search-exec' });
    } finally {
      setIsLoading(false);
    }
  }, [isFormValid, currentConfig, points, saveHeatmap]);

  // Handlers for manual parameter changes to break history lock
  const updateGridSize = useCallback((size: GridSize) => {
    hasLoadedHistory.current = false;
    setGridSize(size);
  }, []);

  const updateRadius = useCallback((radius: number) => {
    hasLoadedHistory.current = false;
    setRadiusKm(radius);
  }, []);

  const updateKeyword = useCallback((val: string) => {
    hasLoadedHistory.current = false;
    setKeyword(val);
  }, []);

  const updateBusinessName = useCallback((val: string) => {
    hasLoadedHistory.current = false;
    setBusinessName(val);
  }, []);

  const updatePlaceId = useCallback((val: string) => {
    hasLoadedHistory.current = false;
    setPlaceId(val);
  }, []);

  return {
    keyword, setKeyword: updateKeyword,
    businessName, setBusinessName: updateBusinessName,
    placeId, setPlaceId: updatePlaceId,
    gridSize, setGridSize: updateGridSize,
    radiusKm, setRadiusKm: updateRadius,
    center,
    points,
    isLoading,
    isFormValid,
    handleMapClick,
    handleResetCenter,
    runAnalysis,
  };
}
