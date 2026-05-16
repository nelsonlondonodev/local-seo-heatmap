import { motion } from 'framer-motion';
import { MapMockup } from '../landing/MapMockup';
import { CheckCircle2 } from 'lucide-react';
import { registerContent } from './AuthData';


const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

function BenefitItem({ text, index }: { text: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.1 }}
      className="flex items-center gap-3 rounded-lg bg-zinc-900/50 p-4 border border-zinc-800"
    >
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-zinc-950">
        <CheckCircle2 className="h-3 w-3" />
      </div>
      <span className="text-sm font-semibold text-zinc-300">{text}</span>
    </motion.div>
  );
}

export function RegisterVisual() {
  return (
    <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-zinc-950 lg:flex border-r border-zinc-900">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-900/50 blur-[100px] rounded-full" />
      
      <div className="relative z-10 w-full max-w-xl px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <h2 className="text-5xl font-bold tracking-tighter text-white leading-[1.1] mb-6">
            {registerContent.title} <br />
            <span className="text-zinc-500">{registerContent.titleAccent}</span>
          </h2>
          <p className="text-base text-zinc-500 font-medium max-w-sm mb-10 leading-relaxed">
            {registerContent.description}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {registerContent.benefits.map((benefit, index) => (
              <BenefitItem key={benefit} text={benefit} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Living Product Preview */}
        <div className="relative h-[300px] w-full rounded-2xl border border-zinc-800 bg-zinc-900/20 p-2 shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
            <MapMockup />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
        </div>
      </div>
    </div>
  );
}

