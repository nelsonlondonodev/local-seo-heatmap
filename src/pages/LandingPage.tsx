import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Map, ArrowRight, Zap, BarChart3, Globe, Shield, 
  Sparkles, Check, ChevronDown, MousePointer2, 
  Layers, Search, Share2, TrendingUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBranding } from '@/features/branding';
import { useAuth } from '@/features/auth';
import { MapMockup } from '@/components/landing/MapMockup';
import { Badge } from '@/components/ui/badge';

const bentoFeatures = [
  {
    title: 'Mapas de Calor 7×7',
    description: 'Análisis profundo de hasta 49 puntos geográficos simultáneos para dominar tu área.',
    icon: Map,
    className: 'lg:col-span-2 lg:row-span-2 bg-primary/5 border-primary/20',
    visual: <div className="absolute inset-0 top-32 lg:top-40 scale-125 opacity-40 group-hover:opacity-80 transition-opacity"><MapMockup /></div>
  },
  {
    title: 'Rastreo de Keywords',
    description: 'Historial detallado de posiciones en buscadores locales.',
    icon: Search,
    className: 'lg:col-span-1 lg:row-span-1 bg-white/5 border-white/10',
  },
  {
    title: 'Arquitectura SaaS',
    description: 'Gestiona múltiples clientes y equipos sin complicaciones.',
    icon: Shield,
    className: 'lg:col-span-1 lg:row-span-1 bg-white/5 border-white/10',
  },
  {
    title: 'Informes Whitelabel PDF',
    description: 'Exporta reportes con tu propia marca y envíalos directamente a tus clientes.',
    icon: Share2,
    className: 'lg:col-span-2 lg:row-span-1 bg-white/5 border-white/10',
  }
];

const faqs = [
  {
    q: "¿Cómo funciona el mapa de calor?",
    a: "Nuestra herramienta utiliza la API de Google para consultar el ranking de tu negocio en una cuadrícula de coordenadas específicas alrededor de tu ubicación física."
  },
  {
    q: "¿Necesito mi propia API Key de Google?",
    a: "No, nosotros nos encargamos de toda la infraestructura técnica para que tú solo te preocupes por analizar tus resultados."
  },
  {
    q: "¿Puedo exportar los resultados para mis clientes?",
    a: "¡Sí! Puedes generar reportes en PDF totalmente personalizados con tu logo y colores corporativos (según tu plan)."
  }
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '29€',
    features: ['5 Proyectos', 'Mapas 3x3', 'Rastreo semanal', 'Soporte email'],
    cta: 'Empezar ahora',
    popular: false
  },
  {
    name: 'Pro',
    price: '79€',
    features: ['25 Proyectos', 'Mapas hasta 7x7', 'Rastreo diario', 'Informes Whitelabel PDF', 'Soporte prioritario'],
    cta: 'Prueba Pro gratis',
    popular: true
  },
  {
    name: 'Agency',
    price: '199€',
    features: ['Proyectos ilimitados', 'Todos los tamaños de grid', 'API Access', 'Cuentas para equipo', 'Manager dedicado'],
    cta: 'Contactar ventas',
    popular: false
  }
];

export function LandingPage() {
  const { config } = useBranding();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const revealVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="dark min-h-screen bg-[#030712] text-slate-50 selection:bg-primary/30 font-sans overflow-x-hidden">
      {/* Navbar Premium */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 glass-morphism">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]">
              <Map className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gradient">{config.name}</span>
          </div>
          <div className="hidden lg:flex items-center gap-10 text-sm font-bold text-slate-400">
            <a href="#features" className="hover:text-primary transition-colors">Funciones</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Precios</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary hover:scale-105 transition-transform font-black rounded-xl px-8 shadow-lg shadow-primary/20">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-black hover:text-primary transition-colors">Entrar</Link>
                <Link to="/register">
                  <Button size="lg" className="bg-primary hover:scale-105 transition-transform font-black rounded-xl px-8 shadow-lg shadow-primary/20">
                    Comenzar Gratis
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section - Dark & Immersive */}
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

        {/* Bento Grid - Mejorado y Corregido */}
        <section id="features" className="py-32 bg-slate-950/50 relative">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealVariants}
              className="text-center max-w-3xl mx-auto mb-24"
            >
              <h2 className="text-5xl lg:text-7xl font-black tracking-tight mb-8 text-white">Ingeniería para el SEO</h2>
              <p className="text-xl text-slate-400 font-medium">Datos precisos, interfaz intuitiva y resultados que puedes tocar.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[280px]">
              {bentoFeatures.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative p-10 rounded-[3rem] border group transition-all duration-500 overflow-hidden ${f.className} hover:border-primary/50`}
                >
                  <div className="relative z-20 h-full flex flex-col">
                    <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit border border-white/10 group-hover:bg-primary group-hover:text-white transition-all">
                      <f.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-black mb-4 text-white">{f.title}</h3>
                    <p className="text-slate-400 font-bold leading-relaxed pr-10">{f.description}</p>
                  </div>
                  {f.visual}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="order-2 lg:order-1 relative">
                 <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full" />
                 <div className="relative p-3 rounded-[2.5rem] border border-white/10 bg-slate-900 shadow-2xl rotate-1">
                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000" alt="Dashboard" className="rounded-[2rem] opacity-80" />
                 </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-5xl lg:text-7xl font-black tracking-tighter mb-16 text-white leading-none">Resultados en <br/> <span className="text-primary italic">segundos.</span></h2>
                <div className="space-y-12">
                  {[
                    { title: 'Conecta tu GMB', desc: 'Sincroniza tus fichas de Google Business de forma segura.' },
                    { title: 'Ejecuta el Escaneo', desc: 'Define el radio de acción y deja que nuestra IA haga el resto.' },
                    { title: 'Domina el Mercado', desc: 'Identifica dónde necesitas más reseñas o optimización local.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="text-5xl font-black text-white/5 group-hover:text-primary/40 transition-colors">{i+1}</div>
                      <div>
                        <h4 className="text-2xl font-black mb-3 text-white">{item.title}</h4>
                        <p className="text-slate-400 font-medium text-lg leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Table - Glassmorphism */}
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

        {/* FAQ - Acordeón Limpio */}
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

        {/* Final CTA - Máximo Impacto */}
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
      </main>

      {/* Footer Minimalista & Poderoso */}
      <footer className="py-32 border-t border-white/5 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-24">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-10">
                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center">
                  <Map className="h-7 w-7 text-white" />
                </div>
                <span className="text-3xl font-black tracking-tighter">{config.name}</span>
              </div>
              <p className="text-slate-500 font-bold text-xl leading-relaxed max-w-md">
                La plataforma de inteligencia competitiva definitiva para dominar el SEO Local.
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-6">
                <h5 className="font-black uppercase text-xs tracking-widest text-slate-400">Producto</h5>
                <ul className="space-y-4 text-lg font-bold text-slate-500">
                  <li><a href="#" className="hover:text-primary transition-colors">Heatmaps</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Keywords</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h5 className="font-black uppercase text-xs tracking-widest text-slate-400">Soporte</h5>
                <ul className="space-y-4 text-lg font-bold text-slate-500">
                  <li><a href="#" className="hover:text-primary transition-colors">Ayuda</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Contacto</a></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h5 className="font-black uppercase text-xs tracking-widest text-slate-400">Legal</h5>
                <ul className="space-y-4 text-lg font-bold text-slate-500">
                  <li><a href="#" className="hover:text-primary transition-colors">Términos</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Privacidad</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-16 border-t border-white/5 text-center">
            <p className="text-slate-600 font-bold">
              © {new Date().getFullYear()} {config.name}. Built with precision.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
