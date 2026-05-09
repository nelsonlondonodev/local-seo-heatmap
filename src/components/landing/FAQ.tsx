import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqs } from './LandingData';

export function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-5xl font-black mb-20 text-center text-white italic">Dudas frecuentes</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/5 rounded-3xl overflow-hidden bg-slate-900/50 transition-colors hover:border-white/10">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-8 flex items-center justify-between text-left font-black text-xl text-white"
              >
                {faq.q}
                <div className={`p-2 rounded-full bg-white/5 transition-transform duration-300 ${openFaq === i ? 'rotate-180 bg-primary/20 text-primary' : 'text-slate-500'}`}>
                  <ChevronDown className="h-6 w-6" />
                </div>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-8 pb-8 text-slate-400 font-bold text-lg leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
