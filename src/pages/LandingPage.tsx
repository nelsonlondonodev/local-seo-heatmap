import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Map, ArrowRight, Zap, BarChart3, Globe, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBranding } from '@/features/branding';

const features = [
  {
    icon: Map,
    title: 'Mapa de Calor Interactivo',
    description: 'Visualiza el ranking de tu negocio en Google Maps con una cuadrícula de puntos geográficos en tiempo real.',
  },
  {
    icon: BarChart3,
    title: 'Análisis de Keywords',
    description: 'Rastrea las palabras clave más relevantes para tu negocio local y monitorea su evolución.',
  },
  {
    icon: Globe,
    title: 'Grids Personalizables',
    description: 'Escoge entre cuadrículas de 3×3, 5×5 o 7×7 con radio ajustable para análisis preciso.',
  },
  {
    icon: Shield,
    title: 'Multi-Tenant SaaS',
    description: 'Arquitectura preparada para escalar con múltiples cuentas, equipos y planes de suscripción.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function LandingPage() {
  const { config } = useBranding();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary shadow-sm">
              <Map className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">{config.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-medium">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="gap-1 font-semibold bg-brand-primary hover:opacity-90">
                Comenzar Gratis <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-24">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-primary/10 blur-3xl" />
          <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-5 py-2 text-sm font-medium"
            >
              <Sparkles className="h-4 w-4 text-brand-primary" />
              <span>SEO Local potenciado con IA</span>
            </motion.div>

            <h1 className="mb-8 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Domina el{' '}
              <span className="bg-gradient-to-r from-brand-primary via-blue-500 to-brand-primary bg-clip-text text-transparent">
                SEO Local
              </span>{' '}
              con mapas de calor
            </h1>

            <p className="mb-10 text-xl text-muted-foreground leading-relaxed">
              Rastrea el posicionamiento de tu ficha de Google Maps en múltiples
              puntos geográficos. Visualiza, analiza y mejora tu visibilidad local
              como nunca antes con <strong>{config.name}</strong>.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 gap-3 text-lg font-bold bg-brand-primary hover:opacity-95 shadow-xl shadow-brand-primary/20 transition-all active:scale-95">
                  <Zap className="h-5 w-5 fill-current" />
                  Comenzar gratis ahora
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-semibold rounded-xl border-2 transition-all hover:bg-muted active:scale-95">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual - Heatmap Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 overflow-hidden rounded-3xl border border-border bg-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-5 py-4">
              <div className="h-3.5 w-3.5 rounded-full bg-red-400" />
              <div className="h-3.5 w-3.5 rounded-full bg-yellow-400" />
              <div className="h-3.5 w-3.5 rounded-full bg-green-400" />
              <span className="ml-3 text-sm font-medium text-muted-foreground opacity-70">
                {config.name.toLowerCase().replace(/\s+/g, '-')}.app/dashboard
              </span>
            </div>
            <div className="relative h-72 bg-gradient-to-br from-muted/50 via-background to-muted/50 sm:h-96 lg:h-[450px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-5 gap-4 p-10 sm:gap-6">
                  {[
                    '#22c55e', '#4ade80', '#86efac', '#fde047', '#facc15',
                    '#4ade80', '#22c55e', '#22c55e', '#86efac', '#f59e0b',
                    '#86efac', '#22c55e', '#22c55e', '#4ade80', '#facc15',
                    '#fde047', '#86efac', '#4ade80', '#22c55e', '#86efac',
                    '#f59e0b', '#facc15', '#fde047', '#86efac', '#4ade80',
                  ].map((color, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.9 }}
                      transition={{
                        delay: 0.6 + i * 0.04,
                        type: 'spring',
                        stiffness: 150,
                      }}
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-black text-white shadow-lg sm:h-16 sm:w-16"
                      style={{ backgroundColor: color }}
                    >
                      {i < 5 ? i + 1 : i < 10 ? i - 3 : i < 15 ? i - 8 : i < 20 ? i - 12 : i - 17}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/20 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Todo lo que necesitas para el SEO Local
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Herramientas de nivel empresarial para dominar los resultados de búsqueda
              local y superar a la competencia.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-brand-primary/40 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-primary-foreground shadow-sm">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 text-center text-muted-foreground sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-6 w-6 rounded bg-brand-primary flex items-center justify-center">
               <Map className="h-3 w-3 text-white" />
            </div>
            <span className="font-bold text-foreground">{config.name}</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} {config.name}. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
