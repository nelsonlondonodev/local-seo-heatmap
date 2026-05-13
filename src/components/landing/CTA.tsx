import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="py-24 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mx-auto max-w-5xl rounded-2xl bg-zinc-900 p-12 lg:p-24 text-center text-white relative overflow-hidden border border-zinc-800 shadow-none"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="relative z-10">
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-10 leading-tight">
            Toma el control <br /><span className="text-zinc-500">de tu SEO Local.</span>
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-14 px-10 text-lg font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all rounded-md">
              Empieza Gratis
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-semibold border-zinc-700 bg-transparent hover:bg-zinc-800 text-white rounded-md transition-all">
              Ver Demo Live
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
