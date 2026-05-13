import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MousePointer2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapMockup } from './MapMockup';

export function Hero() {
  const revealVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden border-b border-zinc-900">
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-[0.03]" />
      
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={revealVariants}
            className="lg:w-1/2 text-left"
          >
            <Badge variant="outline" className="mb-6 py-1 px-4 rounded-full border-zinc-800 bg-zinc-900/50 text-zinc-400 font-medium tracking-tight text-xs">
              <Sparkles className="h-3 w-3 mr-2 text-primary" />
              Next-Gen Local Intelligence
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1] mb-6 text-white">
              Domina el ranking <br />
              <span className="text-zinc-400">de tu ciudad.</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-lg mb-10 font-normal">
              La herramienta definitiva para agencias que necesitan visualizar el posicionamiento real en Google Maps y superar a la competencia con precisión quirúrgica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="h-12 px-8 text-base font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all rounded-md">
                  Prueba Gratis <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base font-semibold rounded-md border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-all text-zinc-100">
                Ver Demo <MousePointer2 className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 relative w-full"
          >
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/30 p-2 backdrop-blur-sm">
               <div className="rounded-xl overflow-hidden border border-zinc-800/50 h-[400px] lg:h-[550px]">
                  <MapMockup />
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
