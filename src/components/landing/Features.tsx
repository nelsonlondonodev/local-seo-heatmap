import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { bentoFeatures } from './LandingData';
import { MapMockup } from './MapMockup';
import { cn } from '@/lib/utils';

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

interface FeatureCardProps {
  feature: typeof bentoFeatures[number];
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative p-8 rounded-2xl border group transition-all duration-300 overflow-hidden",
        "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 shadow-none",
        feature.className
      )}
    >
      <div className="relative z-20 h-full flex flex-col">
        <div className={cn(
          "mb-5 p-2.5 rounded-lg bg-zinc-800/50 w-fit border border-zinc-700/50",
          "group-hover:bg-zinc-100 group-hover:text-zinc-950 transition-all"
        )}>
          <feature.icon className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{feature.title}</h3>
        <p className="text-zinc-400 text-sm font-normal leading-relaxed pr-6">{feature.description}</p>
      </div>
      
      <FeatureDecoration title={feature.title} />
    </motion.div>
  );
}

export function Features() {
  const revealVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } },
  };

  return (
    <section id="features" className="py-24 bg-zinc-950 relative border-b border-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-white">Ingeniería para el SEO</h2>
          <p className="text-lg text-zinc-400 font-normal">Datos precisos, interfaz intuitiva y resultados accionables para dominar el mercado local.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
          {bentoFeatures.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
