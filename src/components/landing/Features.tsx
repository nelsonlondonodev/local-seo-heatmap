import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { bentoFeatures } from './LandingData';
import { MapMockup } from './MapMockup';

interface FeatureDecorationProps {
  title: string;
}

function FeatureDecoration({ title }: FeatureDecorationProps) {
  if (title === 'Mapas de Calor 7×7') {
    return (
      <div className="absolute -bottom-20 -right-20 w-[120%] h-[120%] opacity-15 group-hover:opacity-30 transition-all duration-1000 pointer-events-none z-0">
        <MapMockup />
      </div>
    );
  }
  return null;
}

export function Features() {
  const revealVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section id="features" className="py-32 bg-slate-950/50 relative">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <h2 className="text-5xl lg:text-7xl font-black tracking-tight mb-8 text-white">Ingeniería para el SEO</h2>
          <p className="text-xl text-slate-400 font-medium">Datos precisos, interfaz intuitiva y resultados que puedes tocar.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[280px]">
          {bentoFeatures.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-10 rounded-[3rem] border group transition-all duration-500 overflow-hidden ${f.className} hover:border-primary/50`}
            >
              <div className="relative z-20 h-full flex flex-col">
                <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit border border-white/10 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-white tracking-tight">{f.title}</h3>
                <p className="text-zinc-300 font-medium leading-relaxed pr-10">{f.description}</p>
              </div>
              
              <FeatureDecoration title={f.title} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
