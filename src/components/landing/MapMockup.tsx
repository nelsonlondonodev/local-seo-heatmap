import { motion } from 'framer-motion';

export function MapMockup() {
  const getTextColor = (bgColor: string) => {
    // Colores claros donde el texto debe ser oscuro para contraste
    const lightColors = ['#fde047', '#facc15', '#4ade80', '#86efac'];
    return lightColors.includes(bgColor) ? 'text-slate-900' : 'text-white';
  };

  return (
    <div className="relative w-full h-full bg-transparent overflow-hidden rounded-3xl">
      {/* Glow ambiental detrás del mapa */}
      <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full" />
      
      {/* Grid pattern sutil */}
      <div className="absolute inset-0 opacity-10 bg-grid-pattern" />
      
      {/* Decorative UI Elements */}
      <div className="absolute top-8 left-8 p-4 glass-morphism rounded-2xl border border-white/10 hidden md:block">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <div className="h-1.5 w-24 bg-white/20 rounded-full" />
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-5 gap-3 p-6 sm:gap-4 lg:gap-5">
          {[
            '#22c55e', '#4ade80', '#86efac', '#fde047', '#facc15',
            '#4ade80', '#22c55e', '#22c55e', '#86efac', '#f59e0b',
            '#86efac', '#22c55e', '#22c55e', '#4ade80', '#facc15',
            '#fde047', '#86efac', '#4ade80', '#22c55e', '#86efac',
            '#f59e0b', '#facc15', '#fde047', '#86efac', '#22c55e',
          ].map((color, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                delay: 0.5 + i * 0.02,
                type: 'spring',
                stiffness: 120,
                damping: 12
              }}
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-[10px] font-black shadow-lg sm:h-14 sm:w-14 sm:text-sm ${getTextColor(color)}`}
              style={{ 
                backgroundColor: color,
                boxShadow: `0 8px 16px -4px ${color}66`
              }}
            >
              <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 hover:opacity-100 transition-opacity cursor-crosshair" />
              {i < 5 ? i + 1 : i < 10 ? i - 3 : i < 15 ? i - 8 : i < 20 ? i - 12 : i - 17}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating UI Tooltip - Mejorado */}
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
