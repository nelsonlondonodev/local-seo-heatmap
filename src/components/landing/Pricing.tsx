import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pricingPlans } from './LandingData';

export function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-slate-950/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-24">
          <h2 className="text-6xl font-black mb-6 text-white">Invierte en Crecimiento</h2>
          <p className="text-xl text-slate-400 font-medium">Planes escalables para freelancers y agencias.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className={`p-12 rounded-[3.5rem] border bg-slate-900/50 glass-morphism flex flex-col h-full relative transition-all duration-500 ${plan.popular ? 'border-primary ring-1 ring-primary/20' : 'border-white/5'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl shadow-primary/40">
                  Más Popular
                </div>
              )}
              <h3 className="text-2xl font-black mb-4 text-white">{plan.name}</h3>
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-6xl font-black text-white">{plan.price}</span>
                <span className="text-slate-500 font-bold">/mes</span>
              </div>
              <div className="space-y-5 mb-12 flex-grow">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex gap-4 text-sm font-bold text-slate-300">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Button className={`w-full h-16 rounded-2xl font-black text-lg transition-all ${plan.popular ? 'bg-primary shadow-xl shadow-primary/20' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
