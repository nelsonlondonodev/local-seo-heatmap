import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, Minimize2, Crosshair, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { GridPoint } from '@/types';
import { getRankColor } from '@/config/constants';

// Fix for default marker icons in Leaflet + React (common issue)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface HeatmapMapProps {
  center: [number, number];
  zoom: number;
  points: GridPoint[];
  onMapClick?: (lat: number, lng: number) => void;
}

/**
 * Creates a Leaflet DivIcon that renders a colored circle with the rank number inside.
 */
function createRankIcon(rank: number | null, isFullscreen: boolean): L.DivIcon {
  const size = isFullscreen ? 32 : 24;
  const fontSize = isFullscreen ? 12 : 10;
  const color = getRankColor(rank);
  const isValidRank = typeof rank === 'number' && rank !== null;
  
  const config = {
    text: isValidRank ? String(rank) : '20+',
    opacity: isValidRank ? 0.9 : 0.7,
    borderColor: isValidRank ? '#ffffff' : '#94a3b8',
    borderWidth: isValidRank ? 2 : 1.5,
    textColor: isValidRank ? '#ffffff' : '#e2e8f0',
    shadow: isValidRank ? '0 2px 6px rgba(0,0,0,0.35)' : '0 1px 4px rgba(0,0,0,0.25)'
  };

  const styles = `
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background-color: ${color};
    opacity: ${config.opacity};
    border: ${config.borderWidth}px solid ${config.borderColor};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${fontSize}px;
    font-weight: 700;
    color: ${config.textColor};
    line-height: 1;
    box-shadow: ${config.shadow};
    font-family: 'Inter', system-ui, sans-serif;
    cursor: pointer;
  `.replace(/\s+/g, ' ').trim();

  return L.divIcon({
    className: 'rank-marker-icon', // Use a custom class for consistency
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="${styles}">${config.text}</div>`,
  });
}

/**
 * Syncs the map view when the 'center' prop changes.
 */
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 1.5 });
  }, [center, map]);
  return null;
}

/**
 * ClickHandler component to capture map events and notify the parent
 */
function MapEvents({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/**
 * HeatmapMap Component
 * Visualizes geographic data using Leaflet with DivIcon markers for rank display.
 */
export function HeatmapMap({ center, zoom, points, onMapClick }: HeatmapMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keyboard shortcut for ESC to exit fullscreen
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className={cn(
      "relative h-full w-full overflow-hidden rounded-lg border border-border bg-muted/20 transition-all duration-300 shadow-sm",
      isFullscreen ? "fixed inset-0 z-[4000] rounded-none border-none animate-in fade-in zoom-in duration-300" : "h-full w-full"
    )}>
      {/* MAP CONTROLS OVERLAY */}
      <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-10 w-10 bg-background/90 backdrop-blur-sm shadow-md hover:bg-background border border-border"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-10 w-10 bg-background/90 backdrop-blur-sm shadow-md hover:bg-background border border-border"
          onClick={() => {
            // Force Fly to center via a workaround or direct center re-sync
            onMapClick?.(center[0], center[1]);
          }}
          title="Recentrar en el negocio"
        >
          <Crosshair className="h-4 w-4" />
        </Button>
      </div>

      {isFullscreen && (
        <div className="absolute left-6 top-6 z-[1000] rounded-full bg-background/80 px-4 py-2 text-xs font-bold shadow-lg backdrop-blur-md border border-primary/20 flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          Modo Análisis Expandido (Presiona ESC para salir)
        </div>
      )}

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={false} // We can hide default zoom control to look cleaner
      >
        <ChangeView center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEvents onMapClick={onMapClick} />
        
        {/* Center marker indicating current selection */}
        <Marker position={center} icon={DefaultIcon}>
          <Tooltip permanent direction="top" offset={[0, -40]}>
            <div className="flex items-center gap-1.5 font-bold text-[10px]">
              <MapPin className="h-3 w-3 text-primary fill-primary/20" />
              Negocio Seleccionado
            </div>
          </Tooltip>
        </Marker>

        {/* Dynamic points grid with rank numbers */}
        {points
          .filter(p => !isNaN(p.lat) && !isNaN(p.lng))
          .map((point, index) => (
            <Marker
              key={`${point.lat}-${point.lng}-${index}`}
              position={[point.lat, point.lng]}
              icon={createRankIcon(point.rank, isFullscreen)}
            >
              <Tooltip direction="top" offset={[0, -14]} opacity={1}>
                <div className="text-xs font-semibold">
                  Rank: {point.rank ?? 'N/A'}
                </div>
              </Tooltip>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

