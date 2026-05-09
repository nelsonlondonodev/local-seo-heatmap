import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="py-40 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mx-auto max-w-6xl rounded-[4rem] bg-gradient-to-br from-primary to-violet-900 p-16 lg:p-32 text-center text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10">
          <h2 className="text-6xl lg:text-8xl font-black tracking-tighter mb-12 leading-none italic">
            Toma el control <br />de tu SEO Local.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <Button size="lg" className="h-20 px-16 text-2xl font-black bg-white text-primary hover:scale-105 transition-all rounded-3xl shadow-2xl">
              Empieza Gratis
            </Button>
            <Button variant="outline" size="lg" className="h-20 px-16 text-2xl font-black border-white/30 bg-black/20 hover:bg-black/40 text-white rounded-3xl transition-all">
              Ver Demo Live
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
