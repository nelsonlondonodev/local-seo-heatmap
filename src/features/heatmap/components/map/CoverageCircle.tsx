import { Circle } from 'react-leaflet';

interface CoverageCircleProps {
  center: [number, number];
  radiusKm?: number;
}

export function CoverageCircle({ center, radiusKm }: CoverageCircleProps) {
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
