import { motion } from 'framer-motion';
import { MapMockup } from '../landing/MapMockup';
import { Sparkles } from 'lucide-react';
import { loginContent } from './AuthData';

export function LoginVisual() {
  return (
    <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-[#030712] lg:flex border-r border-white/5">
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-primary/10 blur-[120px] rounded-full" />
      
      <div className="relative z-10 w-full max-w-2xl px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-12"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
            <Sparkles className="h-3 w-3 fill-current" />
            {loginContent.badge}
          </div>
          <h2 className="text-5xl font-black tracking-tighter text-white leading-tight mb-4">
            {loginContent.title} <br />
            <span className="text-primary italic">{loginContent.titleAccent}</span>
          </h2>
          <p className="text-lg text-slate-400 font-medium max-w-md">
            {loginContent.description}
          </p>
        </motion.div>

        <div className="relative h-[450px] w-full rounded-[2.5rem] border border-white/10 bg-slate-900/50 p-4 shadow-2xl backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
            <MapMockup />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}
