import { Marker } from 'react-leaflet';
import L from 'leaflet';

interface CenterMarkerProps {
  position: [number, number];
  businessName?: string;
}

export function CenterMarker({ position, businessName }: CenterMarkerProps) {
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
