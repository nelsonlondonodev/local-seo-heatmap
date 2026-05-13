import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pricingPlans } from './LandingData';

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-zinc-950 border-b border-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white tracking-tight">Invierte en Crecimiento</h2>
          <p className="text-lg text-zinc-400 font-normal">Planes escalables para freelancers y agencias que buscan resultados.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className={`p-10 rounded-2xl border bg-zinc-900/30 flex flex-col h-full relative transition-all duration-300 ${plan.popular ? 'border-zinc-500 bg-zinc-900/50' : 'border-zinc-800'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-zinc-950 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Más Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-3 text-white">{plan.name}</h3>
              <div className="flex items-baseline gap-1.5 mb-8">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-zinc-500 text-sm font-medium">/mes</span>
              </div>
              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex gap-3 text-sm font-normal text-zinc-300">
                    <Check className="h-4 w-4 text-zinc-500 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Button className={`w-full h-11 rounded-lg font-semibold text-sm transition-all ${plan.popular ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100'}`}>
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
