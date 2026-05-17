import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { pricingPlans } from './LandingData';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  plan: typeof pricingPlans[number];
  index: number;
}

function PricingCard({ plan, index }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={cn(
        "p-10 rounded-2xl border bg-zinc-900/30 flex flex-col h-full relative transition-all duration-300",
        plan.popular ? "border-zinc-500 bg-zinc-900/50" : "border-zinc-800"
      )}
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
        {plan.features.map((feature, j) => (
          <div key={j} className="flex gap-3 text-sm font-normal text-zinc-300">
            <Check className="h-4 w-4 text-zinc-500 shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      <Link to="/register" className="w-full">
        <Button 
          className={cn(
            "w-full h-11 rounded-lg font-semibold text-sm transition-all cursor-pointer",
            plan.popular ? "bg-white text-zinc-950 hover:bg-zinc-200" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
          )}
        >
          {plan.cta}
        </Button>
      </Link>
    </motion.div>
  );
}

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
            <PricingCard key={i} plan={plan} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
