import { useState, useEffect, useRef, memo } from 'react';
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

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl border border-zinc-800 bg-background transition-all duration-300 shadow-2xl",
        isFullscreen ? "rounded-none" : ""
      )}
    >
      {/* MAP CONTROLS OVERLAY */}
      <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
        <Button 
          variant="secondary" size="icon" 
          className="h-10 w-10 bg-zinc-900/90 backdrop-blur-md shadow-xl hover:bg-zinc-800 border border-zinc-800 rounded-xl"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        <Button 
          variant="secondary" size="icon" 
          className="h-10 w-10 bg-zinc-900/90 backdrop-blur-md shadow-xl hover:bg-zinc-800 border border-zinc-800 rounded-xl"
          onClick={() => mapRef.current?.flyTo(center, zoom, { duration: 1.5 })}
        >
          <Crosshair className="h-4 w-4" />
        </Button>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full grayscale-[0.2] contrast-[1.1]"
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

        {/* Center marker indicating current selection */}
        <Marker position={center} icon={DefaultIcon}>
          <Tooltip permanent direction="top" offset={[0, -40]} opacity={1}>
            <div className="flex flex-col items-center gap-1 min-w-[140px] p-1">
              <div className="flex items-center gap-1.5 font-black text-[10px] text-primary uppercase tracking-widest">
                <MapPin className="h-3 w-3 fill-primary/20" />
                {businessName || 'Punto de Origen'}
              </div>
              <div className="h-0.5 w-full rounded-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </div>
          </Tooltip>
        </Marker>

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



