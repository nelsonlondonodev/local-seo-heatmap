import type { GridPoint, GridSize } from '@/types';

/**
 * Generates a grid of points based on a center point, a grid size, and a radius in KM.
 * This is a pure function following clean code principles.
 * 
 * @param centerLat - Center latitude
 * @param centerLng - Center longitude
 * @param gridSize - Grid size (e.g., '3x3', '5x5', '7x7')
 * @param radiusKm - Radius in Kilometers from center to edge
 * @returns Array of GridPoints with null ranking data
 */
export function generateGridPoints(
  centerLat: number,
  centerLng: number,
  gridSize: GridSize,
  radiusKm: number
): GridPoint[] {
  // 1. Get numeric N from 'NxN' string (e.g., '3x3' -> 3)
  const n = parseInt(gridSize.split('x')[0]);
  const points: GridPoint[] = [];

  // Special case for 1x1 or safety
  if (n <= 1) {
    return [{ lat: centerLat, lng: centerLng, rank: null, totalResults: 0 }];
  }

  // Calculate the distance from center to first point (half of the total side length)
  const halfN = (n - 1) / 2;

  // 2. Constants for geographic calculation
  // 1 degree latitude is approx 111.32 km
  const latStepKm = (radiusKm * 2) / (n - 1);
  const lngStepKm = (radiusKm * 2) / (n - 1);
  
  const dLat = latStepKm / 111.32;
  // Longitude step depends on current latitude (correction factor)
  const dLng = lngStepKm / (111.32 * Math.cos(centerLat * (Math.PI / 180)));

  // 3. Generate grid points iterating from top-left (North-West) to bottom-right (South-East)
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      // Latitude decreases from top to bottom (row offset)
      // Longitude increases from left to right (col offset)
      const latOffset = (halfN - row) * dLat;
      const lngOffset = (col - halfN) * dLng;

      points.push({
        lat: Number((centerLat + latOffset).toFixed(6)),
        lng: Number((centerLng + lngOffset).toFixed(6)),
        rank: null, // No rank data yet, will be filled by the search service
        totalResults: 0,
      });
    }
  }

  return points;
}
