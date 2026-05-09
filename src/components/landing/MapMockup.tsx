import { motion } from 'framer-motion';

export function MapMockup() {
  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
      {/* Simulated Map Background */}
      <div className="absolute inset-0 opacity-20 bg-grid-pattern" />
      
      {/* Decorative Map Elements */}
      <div className="absolute top-10 left-10 h-32 w-48 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
        <div className="h-2 w-32 bg-white/10 rounded-full" />
      </div>
      
      <div className="absolute bottom-20 right-10 h-40 w-64 rounded-lg bg-white/5 border border-white/10">
        <div className="p-4 space-y-3">
          <div className="h-2 w-24 bg-brand-primary/40 rounded-full" />
          <div className="h-2 w-40 bg-white/10 rounded-full" />
          <div className="h-2 w-32 bg-white/10 rounded-full" />
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-5 gap-3 p-6 sm:gap-5">
          {[
            '#22c55e', '#4ade80', '#86efac', '#fde047', '#facc15',
            '#4ade80', '#22c55e', '#22c55e', '#86efac', '#f59e0b',
            '#86efac', '#22c55e', '#22c55e', '#4ade80', '#facc15',
            '#fde047', '#86efac', '#4ade80', '#22c55e', '#86efac',
            '#f59e0b', '#facc15', '#fde047', '#86efac', '#22c55e',
          ].map((color, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              transition={{
                delay: 0.8 + i * 0.03,
                type: 'spring',
                stiffness: 100,
                damping: 15
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-[10px] font-black text-white shadow-lg sm:h-14 sm:w-14 sm:text-xs"
              style={{ 
                backgroundColor: color,
                boxShadow: `0 0 20px ${color}44`
              }}
            >
              <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
              {i < 5 ? i + 1 : i < 10 ? i - 3 : i < 15 ? i - 8 : i < 20 ? i - 12 : i - 17}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating UI Tooltip */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute top-1/4 right-10 p-3 glass-morphism rounded-xl border border-white/20 shadow-xl hidden md:block"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/40">
            <div className="h-4 w-4 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Top Ranking</p>
            <p className="text-sm font-bold text-white">#1 en el Centro</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
