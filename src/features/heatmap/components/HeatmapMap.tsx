import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Tooltip, useMap, Circle } from 'react-leaflet';
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
  businessName?: string;
  radiusKm?: number;
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
 * Captures the Leaflet map instance for parent component control
 */
function MapInstanceCapture({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
    return () => {
      mapRef.current = null;
    };
  }, [map, mapRef]);
  return null;
}

/**
 * MapEvents component to capture map events and notify the parent
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
export function HeatmapMap({ center, zoom, points, businessName, radiusKm, onMapClick }: HeatmapMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Sync state with native fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFull = !!document.fullscreenElement;
      setIsFullscreen(isNowFull);
      
      // Critical: Tell Leaflet to recalculate its size after the transition
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 100);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Error toggling fullscreen", err);
    }
  };

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.flyTo(center, zoom || 13, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden rounded-lg border border-border bg-background transition-all duration-300 shadow-sm",
        isFullscreen ? "h-screen w-screen" : ""
      )}
    >
      {/* MAP CONTROLS OVERLAY */}
      <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-10 w-10 bg-background/90 backdrop-blur-sm shadow-md hover:bg-background border border-border"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-10 w-10 bg-background/90 backdrop-blur-sm shadow-md hover:bg-background border border-border"
          onClick={handleRecenter}
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
        zoomControl={false}
      >
        <MapInstanceCapture mapRef={mapRef} />
        <ChangeView center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEvents onMapClick={onMapClick} />
        
        {/* Dynamic radius circle to visualize coverage area */}
        {radiusKm && (
          <Circle
            center={center}
            radius={radiusKm * 1000}
            pathOptions={{
              fillColor: 'rgb(var(--primary))',
              fillOpacity: 0.05,
              color: 'rgb(var(--primary))',
              weight: 2,
              dashArray: '5, 10',
              opacity: 0.3
            }}
          />
        )}

        {/* Center marker indicating current selection */}
        <Marker position={center} icon={DefaultIcon}>
          <Tooltip permanent direction="top" offset={[0, -40]} opacity={1}>
            <div className="flex flex-col items-center gap-0.5 min-w-[120px]">
              <div className="flex items-center gap-1.5 font-extrabold text-[11px] text-primary uppercase tracking-tight">
                <MapPin className="h-3 w-3 fill-primary/20" />
                {businessName || 'Negocio Seleccionado'}
              </div>
              <div className="h-1 w-12 rounded-full bg-primary/20 mt-0.5" />
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


