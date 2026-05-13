import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqs } from './LandingData';

export function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 border-b border-zinc-900">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="text-3xl lg:text-4xl font-bold mb-16 text-center text-white tracking-tight">Dudas frecuentes</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30 transition-all hover:border-zinc-700">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-6 flex items-center justify-between text-left font-semibold text-lg text-white"
              >
                {faq.q}
                <div className={`p-1.5 rounded-md bg-zinc-800 transition-transform duration-300 ${openFaq === i ? 'rotate-180 bg-white text-zinc-950' : 'text-zinc-500'}`}>
                  <ChevronDown className="h-5 w-5" />
                </div>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 text-zinc-400 font-normal text-base leading-relaxed"
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
