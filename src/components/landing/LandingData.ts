import { Map, Shield, Search, Share2 } from 'lucide-react';

export const bentoFeatures = [
  {
    title: 'Mapas de Calor 7×7',
    description: 'Análisis profundo de hasta 49 puntos geográficos simultáneos para dominar tu área.',
    icon: Map,
    className: 'lg:col-span-2 lg:row-span-2 bg-zinc-900/50 border-zinc-800',
  },
  {
    title: 'Rastreo de Keywords',
    description: 'Historial detallado de posiciones en buscadores locales.',
    icon: Search,
    className: 'lg:col-span-1 lg:row-span-1 bg-zinc-900/50 border-zinc-800',
  },
  {
    title: 'Arquitectura SaaS',
    description: 'Gestiona múltiples clientes y equipos sin complicaciones.',
    icon: Shield,
    className: 'lg:col-span-1 lg:row-span-1 bg-zinc-900/50 border-zinc-800',
  },
  {
    title: 'Informes de Marca Blanca PDF',
    description: 'Exporta reportes con tu propia marca y envíalos directamente a tus clientes.',
    icon: Share2,
    className: 'lg:col-span-2 lg:row-span-1 bg-zinc-900/50 border-zinc-800',
  }
];

export const pricingPlans = [
  {
    name: 'Inicio',
    price: '29€',
    features: ['5 Proyectos', 'Mapas 3x3', 'Rastreo semanal', 'Soporte email'],
    cta: 'Empezar ahora',
    popular: false
  },
  {
    name: 'Profesional',
    price: '79€',
    features: ['25 Proyectos', 'Mapas hasta 7x7', 'Rastreo diario', 'Informes de Marca Blanca PDF', 'Soporte prioritario'],
    cta: 'Prueba Profesional gratis',
    popular: true
  },
  {
    name: 'Agencia',
    price: '199€',
    features: ['Proyectos ilimitados', 'Todos los tamaños de grid', 'Acceso a API', 'Cuentas para equipo', 'Gestor dedicado'],
    cta: 'Contactar ventas',
    popular: false
  }
];

export const faqs = [
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
