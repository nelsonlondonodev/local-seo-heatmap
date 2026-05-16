import { Maximize2, Minimize2, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapControlsProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onRecenter: () => void;
}

export function MapControls({ 
  isFullscreen, 
  onToggleFullscreen, 
  onRecenter 
}: MapControlsProps) {
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
