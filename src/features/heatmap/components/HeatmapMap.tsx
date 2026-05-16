import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';
import type { GridPoint } from '@/types';

// Sub-components
import { RankMarker } from './map/RankMarker';
import { CenterMarker } from './map/CenterMarker';
import { CoverageCircle } from './map/CoverageCircle';
import { MapControls } from './map/MapControls';
import { ChangeView, MapInstanceCapture, MapEvents } from './map/MapUtils';

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
