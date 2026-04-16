# MapRanker Pro 🗺️

**Herramienta SaaS de SEO Local con Mapa de Calor interactivo** — Permite a negocios locales visualizar su posicionamiento en Google Maps a través de una cuadrícula geolocalizada con ranking por colores.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Configuración Inicial](#configuración-inicial)
- [Variables de Entorno](#variables-de-entorno)
- [Scripts Disponibles](#scripts-disponibles)
- [Funcionalidades](#funcionalidades)
- [Modelo de Datos](#modelo-de-datos)
- [Planes y Límites](#planes-y-límites)
- [Estado Actual del MVP](#estado-actual-del-mvp)

---

10. **🎯 Search Precision (ES)**: Corrección regional de búsqueda configurada para **España (`gl: es`)** y uso del parámetro **`ll`** para geolocalización GPS exacta en Serper API.
11. **🛡️ Heatmap Robustness**: Blindaje de renderizado contra coordenadas corruptas (`NaN`) y mejora en la lógica de normalización de nombres para un matching de negocios ultra-preciso.
12. **🩺 Console Diagnostics**: Inyección de logs detallados `[SCAN]` que muestran el Top 3 de resultados encontrados por Google para facilitar el diagnóstico de rankings.

> [!TIP]
> Puedes consultar la documentación detallada de la jerarquía de permisos en [docs/ROLES_AND_HIERARCHY.md](./docs/ROLES_AND_HIERARCHY.md).

---

## 🚀 Estado Actual del Proyecto (v0.6.5 - Sales Intelligence Edition)

Hemos transformado la herramienta en una plataforma de ventas profesional (Sales-Ready) con inteligencia competitiva avanzada:

1.  **🏗️ Arquitectura de Vistas Desacoplada**: Separación total entre Dashboard, Prospección y Resultados.
2.  **📢 Inteligencia de Google Ads**: Motor híbrido que detecta anunciantes activos en tiempo real para identificar leads con presupuesto.
3.  **🏆 Análisis de Competencia (Market Share)**: Cálculo automático de "Share of Local Pack" y ranking promedio de los Top 10 competidores.
4.  **📄 Generación de Informes PDF Premium**: Reportes optimizados para impresión con plan de acción estratégico e identidad de agencia.
5.  **🧪 TypeScript Strict Mode**: Código 100% blindado contra errores en tiempo de ejecución, eliminando todo rastro de `any`.
6.  **📊 Persistencia de Prospección**: Guardado automático de leads (nombres/emails) y datos de competencia en Supabase.

---

## 🛠️ Guía de Desarrollo

### Requisitos Previos
- Node.js 20+
- Cuenta de Supabase Cloud para las variables de entorno.

### Variables de Entorno (.env)
Asegúrate de tener configuradas las siguientes variables para que la conexión a la nube sea estable:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
```

### Diagnóstico de Autenticación
Si encuentras problemas durante el refresco del navegador, hemos inyectado sensores en el `AuthProvider` que emiten logs específicos en la consola del desarrollador (`[AUTH] logs`). Esto nos permite diagnosticar el flujo de sesiones en tiempo real.

---

## Descripción

**LocalRank Pro** es una plataforma SaaS que genera mapas de calor (heatmaps) para analizar el posicionamiento local de un negocio en Google Maps. El usuario configura una búsqueda con una palabra clave, nombre de negocio, Place ID de Google, tamaño de cuadrícula y radio, y el sistema genera un mapa interactivo con puntos coloreados según el ranking obtenido en cada ubicación simulada.

### ¿Cómo funciona?

1. El usuario introduce una **palabra clave** (ej: "peluquería cerca de mí") y el **nombre de su negocio**.
2. Selecciona un **punto central** en el mapa y configura el **radio de búsqueda** y el **tamaño de cuadrícula** (3×3, 5×5 o 7×7).
3. El sistema genera una cuadrícula de puntos geográficos alrededor del centro.
4. Para cada punto, se consulta el ranking del negocio en los resultados de Google Maps.
5. Los resultados se visualizan como un **mapa de calor** con colores que van del verde (#1) al rojo oscuro (20+).

---

## Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| **Vite** | 8.x | Bundler y dev server |
| **React** | 19.x | UI framework |
| **TypeScript** | 5.9 | Tipado estático |
| **Tailwind CSS** | 4.x | Estilos (via `@tailwindcss/vite`) |
| **shadcn/ui** | 4.x | Componentes UI (Base UI + CVA) |
| **Supabase** | 2.x | Auth + Base de datos (PostgreSQL) |
| **React Query** | 5.x (TanStack) | Gestión de estado del servidor |
| **Leaflet** | 1.9 | Mapas interactivos |
| **React-Leaflet** | 5.x | Integración Leaflet + React |
| **Framer Motion** | 12.x | Animaciones |
| **React Router** | 7.x | Enrutamiento SPA |
| **Lucide React** | 1.x | Iconos |
| **Sonner** | 2.x | Notificaciones toast |
| **Geist Font** | Variable | Tipografía principal |

---

## Arquitectura del Proyecto

```
src/
├── App.tsx                    # Router + providers (QueryClient, Auth, Toaster)
├── main.tsx                   # Entry point
├── index.css                  # Estilos globales + Tailwind
│
├── components/
│   ├── ProtectedRoute.tsx     # Wrapper de rutas autenticadas
│   └── ui/                    # Componentes shadcn/ui
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── skeleton.tsx
│       ├── sonner.tsx
│       └── tabs.tsx
│
├── config/
│   └── constants.ts           # Configuración global (colores, grids, planes)
│
├── features/
│   ├── auth/
│   │   ├── AuthProvider.tsx   # Context de autenticación (Supabase Auth)
│   │   └── index.ts           # Barrel export
│   ├── heatmap/               # 🔲 Pendiente de implementar
│   └── search-history/        # 🔲 Pendiente de implementar
│
├── hooks/                     # 🔲 Custom hooks (vacío)
├── store/                     # 🔲 Estado global (vacío)
├── services/                  # 🔲 Servicios API (vacío)
│
├── layouts/
│   └── DashboardLayout.tsx    # Layout con sidebar + mobile menu
│
├── lib/
│   ├── supabase.ts            # Cliente Supabase tipado
│   └── utils.ts               # Utilidad `cn()` (clsx + tailwind-merge)
│
├── pages/
│   ├── LandingPage.tsx        # Página pública de marketing
│   ├── LoginPage.tsx          # Login (email/password + Google OAuth)
│   ├── RegisterPage.tsx       # Registro
│   ├── DashboardPage.tsx      # Panel principal con configuración + mapa
│   ├── HistoryPage.tsx        # Historial de búsquedas
│   └── SettingsPage.tsx       # Configuración del usuario
│
└── types/
    ├── index.ts               # Tipos del dominio (GridPoint, HeatmapConfig, etc.)
    └── database.ts            # Tipos de Supabase (profiles, search_history)
```

---

## Configuración Inicial

### Prerrequisitos

- **Node.js** 18+
- **npm** o **pnpm**
- Cuenta en **Supabase** (para auth y base de datos)

### Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd local-seo-heatmap

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# 4. Ejecutar en modo desarrollo
npm run dev
```

---

## Variables de Entorno

Archivo `.env` (basado en `.env.example`):

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

> ⚠️ **Nunca** subas el archivo `.env` al repositorio. Ya está incluido en `.gitignore`.

---

## Scripts Disponibles

| Script | Comando | Descripción |
|---|---|---|
| **dev** | `npm run dev` | Servidor de desarrollo con HMR |
| **build** | `npm run build` | Compilación TypeScript + build de producción |
| **lint** | `npm run lint` | Linting con ESLint |
| **preview** | `npm run preview` | Preview del build de producción |

---

## Funcionalidades

### ✅ Implementadas (Core Features)

- **Autenticación completa** — Real (Supabase) con persistencia de sesiones y perfiles.
- **Mapa interactivo real** — Integración completa de Leaflet con controles de pantalla completa y recentrado.
- **Lógica de Grid Geográfico** — Generación de puntos (3x3 a 7x7) con cálculos de radio precisos en KM.
- **Buscador Inteligente** — Autocompletado de negocios que captura Place ID y coordenadas automáticamente.
- **Historial en la Nube** — Persistencia completa en Supabase con visualización de resultados pasados.
- **Dashboard de 2026** — Interfaz refinada con flujo lógico de configuración: Negocio → Palabra Clave → Radio → Grid.
- **Sesiones de Alta Resistencia** — Configuración de seguridad para obligar al re-logueo tras cerrar la sesión del navegador.
- **Botones de Auth Dinámicos** — La Landing detecta si ya estás logueado y cambia "Iniciar Sesión" por "Ir al Dashboard" automáticamente.
- **Feedback Visual Premium** — Interfaz de carga unificada con animaciones de alta fidelidad para todos los estados de autenticación.
- **Exportación de Reportes** — Generación de PDF optimizado para ventas en frío y prospección con diseño SEO profesional.
- **Calculadora de Créditos** — Visualización dinámica del coste de API antes de ejecutar el análisis.
- **Detección de Google Ads** — Identificación de anunciantes activos para prospección de leads de alta conversión.
- **Market Dominance Tracker** — Tabla de líderes locales con métricas de cuota de mercado (% Top 3).
- **Prospección de Leads** — Captura de datos de contacto integrada directamente en el flujo de escaneo.

## 📊 Benchmarking & Referencias (Collac.io)

Para alcanzar la excelencia en el sector, hemos analizado a **Collac.io**, líder en Rank Tracking Local. Estos son los pilares que estamos integrando:

- **Análisis de SERP Local**: Emulación de ubicación exacta (Ubicación GPS real).
- **Georank**: Cálculo de visibilidad consolidada por zona.
- **Detección de ADS**: Identificación activa de competidores pautando en el Local Pack.
- **Gráfica Evolutiva**: Trazabilidad del ranking frente a la competencia en el tiempo.
- **Prospección de Leads**: Módulos específicos para captación de clientes locales.

---

## 🚀 Roadmap de Robustecimiento (v0.6.0+)

Basado en el análisis competitivo y las necesidades de Nelson, este es nuestro plan de desarrollo inmediato:

1.  **🎯 Módulo de Prospección Comercial**: Sección dedicada a la generación de leads con mensajes de "Oportunidad de Venta" integrados. ✅
2.  **📢 Detección de Competidores con Ads**: Marcado visual de negocios que pagan por posicionamiento en el heatmap. ✅
3.  **📈 Histórico & Evolución**: Guardado de escaneos previos en Supabase para visualizar el progreso mediante gráficas. ✅
4.  **🏆 Métricas "Share of Local Pack"**: Cálculo del % de dominancia (Top 3) en el área escaneada. ✅
5.  **💼 Reportes de Venta (Sales-Focused)**: Rediseño de PDFs orientados a cerrar ventas, resaltando deficiencias críticas. ✅

---

## 🚀 Roadmap de Innovación SEO Local (v0.8.0+)

Inspirado en el análisis de herramientas líderes como **DinoRank**, hemos trazado el siguiente plan de expansión para MapRanker Pro:

1.  **🤖 Inteligencia Artificial (Dino-Style)**:
    *   **GBP Post Generator**: Generación de publicaciones con Vision AI y optimización SEO (Completado ✅).
    *   **Review Reply AI**: Asistente para responder reseñas de forma profesional y optimizada para SEO (Completado ✅).
    *   **Local Bio Optimizer**: IA que analiza competidores y sugiere la descripción perfecta para el negocio (Completado ✅).

2.  **🔍 Análisis de Brechas (Local Content Gap)**:
    *   **Category Gap**: Identificación de categorías de negocio que los competidores usan y nuestro cliente no.
    *   **Services Comparison**: Panel comparativo de servicios y atributos (amenities) frente al Top 3.

3.  **📈 Monitorización Presencial y Proactiva**:
    *   **Alertas de Desplazamiento**: Notificaciones cuando un competidor nos quita el puesto en el Local Pack de una coordenada.
    *   **Local Visibility Graph**: Evolución histórica del "Share of Local Pack" y ranking promedio (Lógica implementada ✅ - Visual en ajuste 🛠️).

4.  **🌐 SEO On-Page Local & LLMs**:
    *   **Schema & Sync Audit**: Verificación de datos estructurados en la web vinculada a la ficha.
    *   **AI Search Sim (SGE/LLM)**: Simulación de cómo mencionan las IAs (ChatGPT/Gemini) al negocio en búsquedas locales.

5.  **💼 Business Intelligence para Agencias**:
    *   **ROI Dashboard**: Cálculo de ahorro estimado frente a inversión en Google Ads.
    *   **Lead Spy Ads**: Seguimiento detallado de competidores que usan anuncios LSA en las coordenadas del heatmap.

---

## Modelo de Datos

### Tabla `profiles`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` (UUID) | FK a `auth.users` |
| `email` | `string` | Email del usuario |
| `full_name` | `string | null` | Nombre completo |
| `avatar_url` | `string | null` | URL del avatar |
| `plan` | `enum` | `'free' | 'pro' | 'enterprise'` |
| `created_at` | `timestamp` | Fecha de creación |
| `updated_at` | `timestamp` | Última actualización |

### Tabla `heatmaps`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` (UUID) | PK |
| `user_id` | `string` | FK a `profiles.id` |
| `keyword` | `string` | Palabra clave buscada |
| `business_name` | `string` | Nombre del negocio |
| `place_id` | `string` | Google Place ID |
| `results_summary` | `JSON` | Resumen de métricas (Avg/Best Rank) |
| `created_at` | `timestamp` | Fecha de creación |

---

## Planes y Límites

| Característica | Free | Pro | Enterprise |
|---|---|---|---|
| Búsquedas/día | 3 | 50 | ∞ |
| Grid máximo | 5×5 | 7×7 | 7×7 |
| Historial | 7 días | 90 días | 365 días |

---

## Escala de Colores del Heatmap

| Rango | Color | Significado |
|---|---|---|
| #1-3 | 🟢 Verdes | Excelente posicionamiento |
| #4-6 | 🟡 Amarillos | Buen posicionamiento |
| #7-9 | 🟠 Naranjas | Posicionamiento medio |
| #10-15 | 🔴 Rojos | Posicionamiento bajo |
| #16+ | 🟤 Rojo oscuro | Posicionamiento muy bajo |
| N/A | ⚫ Gris | No encontrado |

---

## Estado Actual del Proyecto

> **Versión:** 0.8.0 — Sales Strategy Hub & AI Engagement Kit.

Próximas tareas:
1. **📉 Local Visibility Graph (UI Polish)**: Ajuste fino de renderizado de `recharts`.
2. **🔍 Analysis de Brechas (Category Gap)**: Siguiente módulo de inteligencia competitiva.
3. **Google API Real**: Sustituir el simulador por llamadas reales a Google Places API / Edge Functions.
4. **Sistema de suscripción**: Implementar pasarela de pago para planes Pro y Enterprise.
