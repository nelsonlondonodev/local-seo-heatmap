import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Map, ArrowRight, Zap, BarChart3, Globe, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/config/constants';

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
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Map className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">{APP_CONFIG.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="gap-1">
                Comenzar Gratis <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
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
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>SEO Local potenciado con IA</span>
            </motion.div>

            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Domina el{' '}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                SEO Local
              </span>{' '}
              con mapas de calor
            </h1>

            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Rastrea el posicionamiento de tu ficha de Google Maps en múltiples
              puntos geográficos. Visualiza, analiza y mejora tu visibilidad local
              como nunca antes.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/register">
                <Button size="lg" className="gap-2 text-base">
                  <Zap className="h-4 w-4" />
                  Comenzar Gratis
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-base">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual - Heatmap Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-muted-foreground">
                localrank-pro.app/dashboard
              </span>
            </div>
            <div className="relative h-64 bg-gradient-to-br from-muted via-background to-muted sm:h-80 lg:h-96">
              {/* Simulated heatmap grid */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-5 gap-3 p-8">
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
                      animate={{ scale: 1, opacity: 0.85 }}
                      transition={{
                        delay: 0.5 + i * 0.04,
                        type: 'spring',
                        stiffness: 200,
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold text-white shadow-lg sm:h-12 sm:w-12"
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
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Todo lo que necesitas para el SEO Local
            </h2>
            <p className="text-lg text-muted-foreground">
              Herramientas profesionales para dominar los resultados de búsqueda
              local.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {APP_CONFIG.name}. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
