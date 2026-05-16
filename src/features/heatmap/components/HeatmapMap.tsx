import { useState, useEffect, useRef, memo } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Tooltip, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, Minimize2, Crosshair } from 'lucide-react';
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
 * Atomic Marker for each grid point
 */
const RankMarker = memo(({ point, isFullscreen }: { point: GridPoint, isFullscreen: boolean }) => {
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

/**
 * Coverage area visualization
 */
function CoverageCircle({ center, radiusKm }: { center: [number, number], radiusKm?: number }) {
  if (!radiusKm) return null;
  return (
    <Circle
      center={center}
      radius={radiusKm * 1000}
      pathOptions={{
        fillColor: 'rgb(var(--primary))',
        fillOpacity: 0.08,
        color: 'rgb(var(--primary))',
        weight: 1.5,
        dashArray: '8, 12',
        opacity: 0.4
      }}
    />
  );
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
    return () => { mapRef.current = null; };
  }, [map, mapRef]);
  return null;
}

/**
 * MapEvents component to capture map events and notify the parent
 */
function MapEvents({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) { onMapClick?.(e.latlng.lat, e.latlng.lng); },
  });
  return null;
}

/**
 * Animated Pulse Marker for the Center
 */
function CenterMarker({ position, businessName }: { position: [number, number], businessName?: string }) {
  const icon = L.divIcon({
    className: 'custom-center-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute h-10 w-10 animate-ping rounded-full bg-zinc-950/20 dark:bg-white/20 opacity-75"></div>
        <div class="relative h-3 w-3 rounded-full bg-zinc-950 dark:bg-white border-2 border-white dark:border-zinc-950 shadow-xl"></div>
      </div>
    `
  });

  const labelIcon = L.divIcon({
    className: 'center-label-icon',
    iconSize: [200, 40],
    iconAnchor: [100, 45],
    html: `
      <div class="flex flex-col items-center justify-center">
        <div class="px-3 py-1.5 bg-zinc-950/80 dark:bg-black/80 backdrop-blur-md border border-zinc-800 dark:border-zinc-700 rounded-lg shadow-2xl flex items-center gap-2">
          <div class="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></div>
          <span class="text-[10px] font-bold text-white uppercase tracking-[0.15em] whitespace-nowrap">
            ${businessName || 'Punto de Origen'}
          </span>
        </div>
        <div class="w-px h-2 bg-gradient-to-b from-zinc-800 to-transparent"></div>
      </div>
    `
  });

  return (
    <>
      <Marker position={position} icon={icon} interactive={false} />
      <Marker position={position} icon={labelIcon} interactive={false} />
    </>
  );
}

/**
 * Map Controls (Zoom / Fullscreen)
 */
function MapControls({ 
  isFullscreen, 
  onToggleFullscreen, 
  onRecenter 
}: { 
  isFullscreen: boolean; 
  onToggleFullscreen: () => void; 
  onRecenter: () => void;
}) {
  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
      <Button 
        variant="secondary" size="icon" 
        className="h-9 w-9 bg-zinc-950/90 dark:bg-black/90 backdrop-blur-md shadow-2xl hover:bg-zinc-900 dark:hover:bg-zinc-950 border border-zinc-800/50 dark:border-zinc-700/50 rounded-xl text-white transition-all hover:scale-105 active:scale-95"
        onClick={onToggleFullscreen}
      >
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </Button>
      <Button 
        variant="secondary" size="icon" 
        className="h-9 w-9 bg-zinc-950/90 dark:bg-black/90 backdrop-blur-md shadow-2xl hover:bg-zinc-900 dark:hover:bg-zinc-950 border border-zinc-800/50 dark:border-zinc-700/50 rounded-xl text-white transition-all hover:scale-105 active:scale-95"
        onClick={onRecenter}
      >
        <Crosshair className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function HeatmapMap({ center, zoom, points, businessName, radiusKm, onMapClick }: HeatmapMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(() => mapRef.current?.invalidateSize(), 150);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
    else await document.exitFullscreen();
  };

  const handleRecenter = () => {
    mapRef.current?.flyTo(center, zoom, { duration: 1.5 });
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition-all duration-300 shadow-2xl",
        isFullscreen ? "rounded-none" : ""
      )}
    >
      <MapControls 
        isFullscreen={isFullscreen} 
        onToggleFullscreen={toggleFullscreen} 
        onRecenter={handleRecenter} 
      />

      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full grayscale-[0.1] contrast-[1.1]"
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
        <CoverageCircle center={center} radiusKm={radiusKm} />
        <CenterMarker position={center} businessName={businessName} />

        {/* Dynamic points grid with rank numbers */}
        {points
          .filter(p => !isNaN(p.lat) && !isNaN(p.lng))
          .map((point, index) => (
            <RankMarker 
              key={`${point.lat}-${point.lng}-${index}`} 
              point={point} 
              isFullscreen={isFullscreen} 
            />
          ))}
      </MapContainer>
    </div>
  );
}
