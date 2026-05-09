import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MousePointer2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapMockup } from './MapMockup';

export function Hero() {
  const revealVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-40 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] -z-10 bg-primary/10 blur-[120px] rounded-full" />
      
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={revealVariants}
            className="lg:w-1/2 text-left"
          >
            <Badge className="mb-8 py-2 px-6 rounded-full border-primary/20 bg-primary/10 text-primary font-black tracking-widest text-[10px] uppercase">
              <Sparkles className="h-4 w-4 mr-2 fill-current" />
              Next-Gen Local Intelligence
            </Badge>
            <h1 className="text-7xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-8 text-white">
              Domina <br />
              <span className="text-primary italic">tu Ciudad.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-xl mb-12 font-medium">
              La herramienta definitiva para agencias que necesitan visualizar el posicionamiento real en Google Maps y superar a la competencia.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/register">
                <Button size="lg" className="h-16 px-12 text-xl font-black bg-primary hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] transition-all rounded-2xl">
                  Prueba Gratis <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-16 px-12 text-xl font-black rounded-2xl border-white/10 hover:bg-white/5 transition-all text-white">
                Ver Demo <MousePointer2 className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="lg:w-1/2 relative h-[500px] lg:h-[650px] w-full"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-50" />
            <MapMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
