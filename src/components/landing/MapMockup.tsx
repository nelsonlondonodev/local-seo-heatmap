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
        delay: 0.5 + index * 0.02,
        type: 'spring',
        stiffness: 120,
        damping: 12
      }}
      className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-[10px] font-black shadow-lg sm:h-14 sm:w-14 sm:text-sm ${
        isLight ? 'text-slate-900' : 'text-white'
      }`}
      style={{ 
        backgroundColor: color,
        boxShadow: `0 8px 16px -4px ${color}66`
      }}
    >
      <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 hover:opacity-100 transition-opacity cursor-crosshair" />
      {number}
    </motion.div>
  );
}

export function MapMockup() {
  return (
    <div className="relative w-full h-full bg-transparent overflow-hidden rounded-3xl">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute inset-0 opacity-10 bg-grid-pattern" />
      
      {/* UI Decorativa */}
      <div className="absolute top-8 left-8 p-4 glass-morphism rounded-2xl border border-white/10 hidden md:block">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <div className="h-1.5 w-24 bg-white/20 rounded-full" />
        </div>
      </div>

      {/* Grid del Mapa de Calor */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-5 gap-3 p-6 sm:gap-4 lg:gap-5">
          {GRID_COLORS.map((color, i) => (
            <HeatmapCell key={i} color={color} index={i} />
          ))}
        </div>
      </div>

      {/* Tooltip Flotante */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 p-4 glass-morphism rounded-2xl border border-white/20 shadow-2xl min-w-[200px]"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 border border-primary/40">
            <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Live Insight</p>
            <p className="text-sm font-black text-white">#1 Ranking Local</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
