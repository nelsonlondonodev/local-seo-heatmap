import { MapContainer, TileLayer, CircleMarker, useMapEvents, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
 * ClickHandler component to capture map events and notify the parent
 * This follows the atomic pattern of separating concern from the main render.
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
 * Visualizes geographic data using Leaflet. Uses CircleMarkers for rank representation.
 */
export function HeatmapMap({ center, zoom, points, onMapClick }: HeatmapMapProps) {
  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-border bg-muted/20">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEvents onMapClick={onMapClick} />
        
        {/* Center marker indicating current selection */}
        <Marker position={center} />

        {/* Dynamic points grid */}
        {points.map((point, index) => {
          const color = getRankColor(point.rank);
          return (
            <CircleMarker
              key={`${point.lat}-${point.lng}-${index}`}
              center={[point.lat, point.lng]}
              radius={10}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.8,
                color: '#ffffff',
                weight: 1.5,
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="text-xs font-semibold">
                  Rank: {point.rank ?? 'N/A'}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
