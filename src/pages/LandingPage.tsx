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
    description: 'Análisis profundo de hasta 49 puntos geográficos simultáneos.',
    icon: Map,
    className: 'lg:col-span-2 lg:row-span-2 bg-blue-500/5 border-blue-500/20',
    visual: <MapMockup />
  },
  {
    title: 'Rastreo de Keywords',
    description: 'Historial detallado de posiciones.',
    icon: Search,
    className: 'lg:col-span-1 lg:row-span-1 bg-purple-500/5 border-purple-500/20',
  },
  {
    title: 'Multi-Tenant',
    description: 'Gestiona múltiples clientes fácilmente.',
    icon: Shield,
    className: 'lg:col-span-1 lg:row-span-1 bg-emerald-500/5 border-emerald-500/20',
  },
  {
    title: 'Informes Whitelabel',
    description: 'Exporta reportes con tu propia marca y colores.',
    icon: Share2,
    className: 'lg:col-span-2 lg:row-span-1 bg-orange-500/5 border-orange-500/20',
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-background selection:bg-brand-primary/30">
      {/* Navbar con Glassmorphism */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/40 glass-morphism">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary shadow-lg shadow-brand-primary/20">
              <Map className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-gradient">{config.name}</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Funciones</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Precios</a>
            <a href="#faq" className="hover:text-foreground transition-colors">Ayuda</a>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button size="sm" className="bg-brand-primary hover:opacity-90 font-bold rounded-lg px-6">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold hover:text-brand-primary transition-colors">Entrar</Link>
                <Link to="/register">
                  <Button size="sm" className="bg-brand-primary hover:opacity-90 font-bold rounded-lg px-6">
                    Empezar Gratis
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-[0.03]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl -z-10 bg-gradient-to-b from-brand-primary/10 via-transparent to-transparent blur-3xl rounded-full" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-left"
              >
                <Badge variant="outline" className="mb-6 py-1.5 px-4 rounded-full border-brand-primary/30 bg-brand-primary/5 text-brand-primary font-bold animate-in fade-in slide-in-from-bottom-3">
                  <Sparkles className="h-3.5 w-3.5 mr-2 fill-current" />
                  Próxima Generación de SEO Local
                </Badge>
                <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-gradient">
                  Domina tu <br />
                  <span className="text-brand-primary italic">Ciudad.</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mb-10">
                  Visualiza tu ranking en Google Maps con precisión quirúrgica. 
                  Identifica puntos ciegos y supera a tus competidores locales con datos en tiempo real.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <Button size="lg" className="h-14 px-10 text-lg font-black bg-brand-primary hover:scale-[1.02] transition-transform shadow-2xl shadow-brand-primary/30 rounded-2xl">
                      Comenzar Ahora <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl hover:bg-muted">
                    Ver Demo <MousePointer2 className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground font-medium">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-10 w-10 rounded-full border-4 border-background bg-muted overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <p>+500 agencias confían en nosotros</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative aspect-square lg:aspect-auto lg:h-[600px] w-full"
              >
                <div className="absolute inset-0 bg-brand-primary/20 blur-[100px] rounded-full" />
                <MapMockup />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="py-32 bg-muted/30 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl lg:text-6xl font-black tracking-tight mb-6">Herramientas diseñadas para ganar</h2>
              <p className="text-xl text-muted-foreground">Cada detalle ha sido optimizado para que tomes mejores decisiones de SEO Local.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[240px]">
              {bentoFeatures.map((f, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className={`relative p-8 rounded-[2.5rem] border overflow-hidden group transition-all shadow-sm hover:shadow-2xl ${f.className}`}
                >
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="mb-4 p-3 rounded-2xl bg-white dark:bg-white/10 w-fit shadow-sm">
                        <f.icon className="h-6 w-6 text-foreground" />
                      </div>
                      <h3 className="text-2xl font-black mb-2">{f.title}</h3>
                      <p className="text-muted-foreground font-medium">{f.description}</p>
                    </div>
                  </div>
                  {f.visual && (
                    <div className="absolute inset-x-0 bottom-0 top-32 scale-110 opacity-50 group-hover:opacity-100 transition-opacity">
                      {f.visual}
                    </div>
                  )}
                  {/* Decorative Gradient */}
                  <div className="absolute -right-4 -top-4 w-32 h-32 bg-foreground/5 blur-3xl rounded-full" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-32 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-4xl lg:text-6xl font-black tracking-tight mb-12">De 0 a 100 en tres pasos</h2>
                <div className="space-y-12">
                  {[
                    { step: '01', title: 'Añade tu negocio', desc: 'Conecta con tu perfil de Google Business o busca manualmente por nombre.', icon: Globe },
                    { step: '02', title: 'Define el área', desc: 'Elige el tamaño del grid y el radio de búsqueda (de 1 a 50 km).', icon: Layers },
                    { step: '03', title: 'Recibe el reporte', desc: 'Visualiza tu ranking en cada punto y detecta dónde flaquea tu competencia.', icon: TrendingUp },
                  ].map((s, i) => (
                    <motion.div 
                      key={i} 
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={itemVariants}
                      className="flex gap-6"
                    >
                      <div className="text-4xl font-black text-brand-primary/20">{s.step}</div>
                      <div>
                        <h4 className="text-2xl font-bold mb-2">{s.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="absolute inset-0 bg-brand-primary/10 blur-[120px] rounded-full" />
                <div className="relative p-2 rounded-3xl border bg-card/50 shadow-2xl rotate-2">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bbbda5366392?q=80&w=1000&auto=format&fit=crop" 
                    alt="Dashboard Preview" 
                    className="rounded-2xl w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-6xl font-black mb-6">Planes para cada etapa</h2>
              <p className="text-xl text-muted-foreground">Precios transparentes. Sin contratos ocultos.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className={`p-10 rounded-[2.5rem] border bg-card flex flex-col h-full relative ${plan.popular ? 'border-brand-primary ring-4 ring-brand-primary/10' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-10 -translate-y-1/2 bg-brand-primary text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                      Más Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className="text-muted-foreground font-medium">/mes</span>
                  </div>
                  <div className="space-y-4 mb-10 flex-grow">
                    {plan.features.map((f, j) => (
                      <div key={j} className="flex gap-3 text-sm font-medium">
                        <Check className="h-5 w-5 text-brand-primary shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Button className={`w-full h-12 rounded-xl font-bold text-lg ${plan.popular ? 'bg-brand-primary' : 'variant-outline'}`}>
                    {plan.cta}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-32">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-4xl font-black mb-16 text-center">Preguntas Frecuentes</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border rounded-2xl overflow-hidden bg-card">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-6 flex items-center justify-between text-left font-bold text-lg"
                  >
                    {faq.q}
                    <ChevronDown className={`h-5 w-5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 text-muted-foreground leading-relaxed"
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

        {/* Final CTA */}
        <section className="py-32 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-5xl rounded-[3rem] bg-brand-primary p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(var(--brand-primary),0.3)]"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="relative z-10">
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 italic">
                ¿Listo para dominar <br />tu mercado local?
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto mb-12 font-medium">
                Únete a cientos de agencias y dueños de negocios que ya están mejorando su visibilidad con {config.name}.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Button size="lg" className="h-16 px-12 text-xl font-black bg-white text-brand-primary hover:bg-gray-100 rounded-2xl">
                  Empieza Gratis Ahora
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-12 text-xl font-bold border-white/30 hover:bg-white/10 rounded-2xl">
                  Agendar Demo
                </Button>
              </div>
            </div>
            {/* Background Decorative Circles */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 blur-[100px] rounded-full" />
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-black/10 blur-[100px] rounded-full" />
          </motion.div>
        </section>
      </main>

      {/* Footer Moderno */}
      <footer className="py-20 border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-brand-primary flex items-center justify-center">
                  <Map className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tight">{config.name}</span>
              </div>
              <p className="text-muted-foreground font-medium max-w-xs leading-relaxed">
                La plataforma de inteligencia competitiva para SEO Local líder en Europa.
              </p>
            </div>
            <div>
              <h5 className="font-black mb-6 uppercase text-xs tracking-widest text-muted-foreground">Producto</h5>
              <ul className="space-y-4 text-sm font-bold">
                <li><a href="#" className="hover:text-brand-primary transition-colors">Funciones</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Roadmap</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Precios</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black mb-6 uppercase text-xs tracking-widest text-muted-foreground">Compañía</h5>
              <ul className="space-y-4 text-sm font-bold">
                <li><a href="#" className="hover:text-brand-primary transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-muted-foreground font-medium">
              © {new Date().getFullYear()} {config.name}. Hecho con ❤️ para SEOs.
            </p>
            <div className="flex gap-8 text-sm font-bold text-muted-foreground">
              <a href="#" className="hover:text-foreground">Términos</a>
              <a href="#" className="hover:text-foreground">Privacidad</a>
              <a href="#" className="hover:text-foreground">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
