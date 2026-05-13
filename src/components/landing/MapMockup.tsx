import { motion } from 'framer-motion';

// Constantes de configuración
const GRID_COLORS = [
  '#22c55e', '#4ade80', '#86efac', '#fde047', '#facc15',
  '#4ade80', '#22c55e', '#22c55e', '#86efac', '#f59e0b',
  '#86efac', '#22c55e', '#22c55e', '#4ade80', '#facc15',
  '#fde047', '#86efac', '#4ade80', '#22c55e', '#86efac',
  '#f59e0b', '#facc15', '#fde047', '#86efac', '#22c55e',
];

interface HeatmapCellProps {
  color: string;
  index: number;
}

function HeatmapCell({ color, index }: HeatmapCellProps) {
  const isLight = ['#fde047', '#facc15', '#4ade80', '#86efac'].includes(color);
  const number = index < 5 ? index + 1 : index < 10 ? index - 3 : index < 15 ? index - 8 : index < 20 ? index - 12 : index - 17;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{
        delay: 0.5 + index * 0.01,
        type: 'spring',
        stiffness: 150,
        damping: 15
      }}
      className={`relative flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold border border-black/10 sm:h-12 sm:w-12 sm:text-xs ${
        isLight ? 'text-zinc-950' : 'text-white'
      }`}
      style={{ 
        backgroundColor: color
      }}
    >
      <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 hover:opacity-100 transition-opacity cursor-crosshair" />
      {number}
    </motion.div>
  );
}

export function MapMockup() {
  return (
    <div className="relative w-full h-full bg-zinc-950 overflow-hidden rounded-xl">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 opacity-[0.03] bg-grid-pattern" />
      
      {/* UI Decorativa */}
      <div className="absolute top-6 left-6 p-3 bg-zinc-900 border border-zinc-800 rounded-lg hidden md:block shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <div className="h-1 w-16 bg-zinc-800 rounded-full" />
        </div>
      </div>

      {/* Grid del Mapa de Calor */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-5 gap-2 p-4 sm:gap-3 lg:gap-4">
          {GRID_COLORS.map((color, i) => (
            <HeatmapCell key={i} color={color} index={i} />
          ))}
        </div>
      </div>

      {/* Tooltip Flotante */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 p-3 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl min-w-[160px]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">Live Insight</p>
            <p className="text-xs font-bold text-white">#1 Ranking Local</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
