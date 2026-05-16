import { memo } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { getRankColor } from '@/config/constants';
import type { GridPoint } from '@/types';

interface RankMarkerProps {
  point: GridPoint;
  isFullscreen: boolean;
}

export const RankMarker = memo(({ point, isFullscreen }: RankMarkerProps) => {
  const size = isFullscreen ? 32 : 24;
  const fontSize = isFullscreen ? 12 : 10;
  const color = getRankColor(point.rank);
  const isValidRank = typeof point.rank === 'number' && point.rank !== null;
  
  const config = {
    text: isValidRank ? String(point.rank) : '20+',
    opacity: isValidRank ? 0.9 : 0.7,
    borderColor: isValidRank ? '#ffffff' : '#94a3b8',
    borderWidth: isValidRank ? 2 : 1.5,
    textColor: isValidRank ? '#ffffff' : '#e2e8f0',
    shadow: isValidRank ? '0 2px 6px rgba(0,0,0,0.35)' : '0 1px 4px rgba(0,0,0,0.25)'
  };

  const styles = `
    width: ${size}px; height: ${size}px; border-radius: 50%;
    background-color: ${color}; opacity: ${config.opacity};
    border: ${config.borderWidth}px solid ${config.borderColor};
    display: flex; align-items: center; justify-content: center;
    font-size: ${fontSize}px; font-weight: 800; color: ${config.textColor};
    line-height: 1; box-shadow: ${config.shadow};
    font-family: 'Inter', system-ui, sans-serif; cursor: pointer;
  `.replace(/\s+/g, ' ').trim();

  const icon = L.divIcon({
    className: 'rank-marker-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="${styles}">${config.text}</div>`,
  });

  return (
    <Marker position={[point.lat, point.lng]} icon={icon}>
      <Tooltip direction="top" offset={[0, -14]} opacity={1}>
        <div className="text-xs font-bold px-1">Posición: {point.rank ?? 'Fuera de rango'}</div>
      </Tooltip>
    </Marker>
  );
});

RankMarker.displayName = 'RankMarker';
