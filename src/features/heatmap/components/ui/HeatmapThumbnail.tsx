import { memo } from 'react';
import type { GridPoint } from '@/types';
import { getRankColor } from '@/config/constants';

interface HeatmapThumbnailProps {
  points: GridPoint[];
  gridSize: string;
}

/**
 * A lightweight, performant visualization of a heatmap grid.
 * Uses CSS Grid and colored dots instead of a full Leaflet instance.
 */
export const HeatmapThumbnail = memo(({ points, gridSize }: HeatmapThumbnailProps) => {
  // Determine grid dimensions based on gridSize string (e.g. "5x5")
  const side = parseInt(gridSize.split('x')[0]) || 5;
  
  // Sort points to ensure they follow a grid order if possible, 
  // though for a thumbnail a simplified representation is usually enough.
  // We'll take a subset if there are too many points for the thumbnail.
  const displayPoints = points.slice(0, side * side);

  return (
    <div 
      className="relative aspect-square w-16 h-16 rounded-lg bg-zinc-900 border border-zinc-800 p-1.5 shadow-inner overflow-hidden group-hover:border-primary/30 transition-colors"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${side}, 1fr)`,
        gap: '2px'
      }}
    >
      {displayPoints.map((point, i) => (
        <div 
          key={i}
          className="rounded-[1px] transition-transform duration-500 group-hover:scale-110"
          style={{ 
            backgroundColor: getRankColor(point.rank),
            opacity: point.rank ? 0.9 : 0.3
          }}
        />
      ))}
      
      {/* Gloss effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
    </div>
  );
});
