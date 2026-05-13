# LocalRank Pro 🗺️

**El Problema:** Muchos negocios locales pierden miles de dólares mensuales porque son "invisibles" en Google Maps. Carecen de herramientas para entender en qué calles específicas su competencia les está robando clientes, y las agencias de marketing sufren para demostrar el valor real de sus servicios de SEO Local con reportes técnicos aburridos.

**La Solución (LocalRank Pro):** Una plataforma SaaS de Inteligencia SEO Local que audita el posicionamiento geolocalizado de cualquier negocio y lo convierte en un mapa de calor visual e interactivo. Transforma métricas complejas en "Argumentos de Cierre" persuasivos (visibilidad, puntos ciegos, ROI) permitiendo a consultores y agencias auditar, prospectar y cerrar clientes de forma contundente.

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
- [Registro de Versiones](#registro-de-versiones)

---

10. **🎯 Search Precision (ES)**: Corrección regional de búsqueda configurada para **España (`gl: es`)** y uso del parámetro **`ll`** para geolocalización GPS exacta en Serper API.
11. **🛡️ Heatmap Robustness**: Blindaje de renderizado contra coordenadas corruptas (`NaN`) y mejora en la lógica de normalización de nombres para un matching de negocios ultra-preciso.
12. **🩺 Console Diagnostics**: Inyección de logs detallados `[SCAN]` que muestran el Top 3 de resultados encontrados por Google para facilitar el diagnóstico de rankings.

> [!TIP]
> Puedes consultar la documentación detallada de la jerarquía de permisos en [docs/ROLES_AND_HIERARCHY.md](./docs/ROLES_AND_HIERARCHY.md).

---

## 🚀 Estado Actual del Proyecto (v0.8.0 - Audit & Robustness Edition)

Hemos finalizado una auditoría técnica profunda para elevar el proyecto a estándares de "Marca Blanca" profesional:

1.  **🧪 Infraestructura de Testing**: Implementación de Vitest + React Testing Library para garantizar la integridad de la lógica comercial.
2.  **🛡️ TypeScript Strict Engine**: Tipado 100% estricto en servicios de IA y Heatmaps, eliminando riesgos de tiempo de ejecución.
3.  **🏳️‍🌈 Arquitectura White-Label**: Soporte para personalización dinámica de país (`gl`), centro de mapa y branding de agencia mediante variables de entorno.
4.  **🛑 Módulo de Confirmación de Gasto**: Nuevo modal de pre-vuelo que valida datos y muestra costos en créditos antes de ejecutar análisis.
5.  **📜 Logging Centralizado**: Sistema de monitoreo que silencia la consola en producción y ofrece trazabilidad detallada en desarrollo.
6.  **📦 Optimización SPA (Vercel)**: Configuración nativa de redirecciones para despliegues estables en Vercel.

---

## 🛠️ Guía de Desarrollo

### Requisitos Previos
- Node.js 20+
- Cuenta de Supabase Cloud para las variables de entorno.

### Variables de Entorno (.env)
Solo se requieren variables **públicas** en el frontend:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase

# Configuración White-Label
VITE_DEFAULT_COUNTRY=es      # Código de país (gl) por defecto (es, us, co, etc.)
VITE_DEFAULT_LAT=40.4168    # Latitud por defecto (ej: Madrid)
VITE_DEFAULT_LNG=-3.7038    # Longitud por defecto

# Modo Demo (datos simulados sin API keys)
VITE_DEMO_MODE=false
```

### API Keys (Supabase Edge Function Secrets)
> ⚠️ **Las API keys NUNCA van en el `.env` del frontend.** Se configuran como Secrets en Supabase:
```bash
supabase secrets set SERPER_API_KEY=xxx
supabase secrets set OPENAI_API_KEY=xxx
supabase secrets set DATAFORSEO_LOGIN=xxx
supabase secrets set DATAFORSEO_PASSWORD=xxx
supabase secrets set GOOGLE_MAPS_API_KEY=xxx
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
| **Vitest** | 4.x | Marco de pruebas unitarias |
| **Testing Library** | 16.x | Testing de componentes React |
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
| **test** | `npm test` | Ejecución de pruebas unitarias con Vitest |
| **test:ui** | `npm run test:ui` | Interfaz gráfica de Vitest |

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

## 🚀 Keyword Intelligence Hub (v0.9.0 - SEO Discovery & Tracking)

Hemos implementado un ecosistema completo para el descubrimiento y monitoreo de palabras clave locales:

1.  **🔍 Descubrimiento Predictivo Geografiado**: Nuevo flujo de búsqueda País -> Ciudad -> Pueblo con autocompletado en tiempo real para una precisión geográfica total.
2.  **📊 Métricas de Google Ads Real-Time**: Integración con DataForSEO para obtener volúmenes de búsqueda, dificultad y CPC específicos para la localidad seleccionada.
3.  **🎯 Rank Tracking Live**: Capacidad de rastrear la posición orgánica actual de un dominio en el Top 100 de Google para cualquier palabra clave guardada.
4.  **💾 Persistencia Geográfica de Proyectos**: Los proyectos ahora guardan su propio contexto (País y Ubicación), permitiendo una carga automática de datos al cambiar de cliente.
5.  **📈 Historial & Evolución de Ranking**: Sistema de guardado histórico cada vez que se actualiza una posición, preparando el terreno para gráficas de evolución.
6.  **💉 Master Refactor**: Modularización de la UI en componentes atómicos (`KeywordConfigPanel`, `KeywordRankRow`) y estandarización del servicio de API para un mantenimiento simplificado.

---

## 🚀 Auditoría de Robustez & Tipado (v0.9.5 - Surgical Compliance)

Hemos elevado la calidad del código a estándares de nivel "Enterprise" mediante una auditoría quirúrgica de estabilidad:

1.  **🛡️ TypeScript Strict Compliance**: Eliminación total de tipos `any` en los módulos de Keywords, Servicios de Datos, Persistencia y Hooks. Uso de interfaces robustas para el 100% de la lógica de negocio.
2.  **🏗️ VerbatimModuleSyntax Compliance**: Resolución definitiva de errores de renderizado (pantalla en blanco) mediante la estandarización de `import type`, optimizando la compatibilidad con el compilador de Vite y TypeScript 5+.
3.  **📍 Location Intelligence UX**: Refactorización del selector geográfico para eliminar bloqueos de entrada y mejorar la precisión del flujo de usuario.
4.  **🔧 Dev-Ops & Support Overhaul**: Extensión de la excelencia del código hacia las herramientas de desarrollo; el script `seed-history.ts` ha sido blindado contra errores de tipo.
5.  **💉 Atomic Persistence Service**: Blindaje del servicio de Supabase mediante "Double-Layer Casting" y validación previa de datos, eliminando fallos silenciosos.

---

## 🚀 Precision & Persistence Hub (v1.0.0 - Local Intelligence Edition)

Hito alcanzado en la profesionalización de la entrega de datos e interfaz:

1.  **📍 Local Search Precision (City-Level)**: Implementación de lógica de "Doble Verificación" en el API. Ahora el sistema extrae el volumen de búsqueda específico de la ciudad (ej: Chía) en lugar del volumen nacional, eliminando inflaciones de datos irrelevantes para negocios locales.
2.  **💾 Auto-Save Infrastructure**: Los términos principales de búsqueda en el laboratorio de Descubrimiento se guardan automáticamente en el historial de seguimiento del proyecto, agilizando el flujo de trabajo.
3.  **🧼 Clean Workbench UX**: Lógica de "Mesa Limpia" configurada para vaciar los resultados temporales al entrar en la sección o cambiar de cliente, manteniendo el foco y evitando la confusión entre proyectos.
4.  **🏷️ Project Branding Logic**: Refactorización visual del selector de proyectos para mostrar nombres reales en lugar de IDs, junto con un flujo de creación de proyectos ultra-simplificado e intuitivo.
5.  **🔄 Balanced Session Continuity**: Equilibrio entre persistencia de datos (mientras navegas internamente) y reseteo de pantalla (al cambiar de contexto), optimizando la navegación fluida.

---

## 🚀 Surgical Refactor & Clean Code (v1.1.0 - Architecture Excellence)

Sesión dedicada a la eliminación de deuda técnica y fortalecimiento del núcleo de Inteligencia de Keywords:

1.  **🛡️ 100% Strict Type Safety**: Refactorización integral de `keywordPersistenceService.ts` y `dataForSeoService.ts`. Eliminación total de tipos `any` y casteos inseguros (`as unknown as`), sustituyéndolos por tipos compuestos que reflejan exactamente los JOINS de la base de datos.
2.  **🏗️ Atomic Hook Logic**: Rediseño completo de `useKeywordDiscovery.ts`, extrayendo la lógica de sincronización, caché y auto-guardado en funciones atómicas. Mejora de estabilidad y rendimiento mediante el uso exhaustivo de `useCallback`.
3.  **🔄 Database Schema Sync**: Sincronización manual de las definiciones en `database.ts` con columnas reales existentes (`location_name`, `country_code`), garantizando que la capa de persistencia sea robusta ante cambios en el esquema.
4.  **💉 Precision Helper Extraction**: Simplificación de los puntos de entrada de los servicios mediante la extracción de lógicas complejas (como la doble verificación de volumen local) a funciones privadas y atómicas.
5.  **🧼 UI Cleanliness**: Eliminación de logs residuales de depuración y estandarización de los flujos de "Workbench" para una experiencia de usuario final impecable.

---

## 🚀 Modular Intelligence & Site Management (v1.2.0 - Core Scaling Edition)

Hito alcanzado en la especialización de la plataforma:

1.  **🏗️ Arquitectura Dual de Keywords**: Separación de **Analizador de Mercado** y **Rastreador de Posiciones**.
2.  **🌐 Site Manager (Asset Tracking)**: Nuevo panel `SiteSettingsCard` para vincular URLs (ej: `narbossalon.com`).
3.  **🤖 Smart Auto-Monitoring**: Rastreo automático cada 3 días para keywords obsoletas.
4.  **🎯 Local SoLV Metrics**: Cuota de visibilidad en el heatmap.
5.  **🔗 Nav-Reconnection**: Navegación fluida entre secciones mediante React Router.

---

## 🚀 Global Sync & RLS Resilience (v1.3.0 - Surgery Edition)

Hito alcanzado en la madurez arquitectónica y seguridad del módulo de Keywords:

1.  **🏗️ Centralización de Datos (Single Source of Truth)**: Refactorización integral de la gestión de proyectos. Ahora la información fluye desde `KeywordPage` hacia todos los subcomponentes, eliminando la fragmentación de estados y garantizando que toda la app vea lo mismo al mismo tiempo.
2.  **🛡️ Parche de Seguridad RLS (Supabase)**: Implementación de una lógica de "reparación de agencia" automática. El sistema ahora detecta y corrige la ausencia de `agency_id` en los proyectos, asegurando el cumplimiento de las políticas de Row Level Security y eliminando los errores 403 Forbidden.
3.  **⚡ Actualizaciones Optimistas**: Mejora de la experiencia de usuario (UX) mediante actualizaciones inmediatas en la interfaz. Los cambios (como vincular una URL) se reflejan al instante sin esperar la respuesta del servidor, eliminando parpadeos y borrados accidentales.
4.  **🧼 Modo Investigación por Defecto**: Preservación del estado "Ninguno" como punto de entrada predeterminado. Esto permite realizar estudios de mercado sin ensuciar proyectos reales, manteniendo una "Mesa de Trabajo Limpia".
5.  **💉 Refactorización Quirúrgica**: Re-escritura de componentes críticos (`MonitoringView`, `ProjectSelector`, `SiteSettingsCard`) con un enfoque en funciones atómicas, tipado estricto y eliminación de deuda técnica.

---

---

## 🚀 Edge Functions & Security Migration (v1.4.0 - Infrastructure Edition)

Hemos completado la transición hacia una arquitectura de seguridad robusta de nivel SaaS:

1.  **🛡️ Zero-Key Client Architecture**: Eliminación total de API Keys del bundle de frontend. Ahora el cliente solo conoce las llaves de Supabase.
2.  **🏗️ Supabase Edge Proxy Hub**: Implementación de 4 proxies inteligentes en Deno/Supabase Functions para centralizar el tráfico hacia OpenAI, Serper, DataForSEO y Google Places.
3.  **💉 JWT Security Injection**: Todas las llamadas se autorizan mediante el header `Authorization`, centralizando el control de acceso en el servidor.
4.  **📦 Secrets Management**: Configuración de entorno segura mediante `supabase secrets`, protegiendo las credenciales de terceros contra inspección.

---

## 🚀 Edge Functions & Security API Migration Resolved (v1.4.1 - Production Stable)

Hemos resuelto de raíz el problema de autenticación (Errores 401) en las Edge Functions, finalizando con éxito la migración de todas las APIs:

1.  **🛡️ Custom JWT Verification**: El Gateway de Supabase (modo `--verify-jwt`) rechazaba los tokens ES256. Se configuraron las funciones con `--no-verify-jwt` delegando la seguridad de forma nativa a Deno (`getAuthenticatedUser`), garantizando protección total y soporte para todos los tokens.
2.  **🏗️ Enhanced Proxy Logger**: Se construyó un logger quirúrgico en `edgeFunctions.ts` capaz de capturar respuestas JSON en cuerpos de error 401, permitiendo aislar si el bloqueo proviene del Gateway o del proveedor (ej. DataForSEO).
3.  **💊 Session Persistence**: Se reconfiguró Supabase Client para usar `localStorage` en lugar de `sessionStorage`, eliminando deslogueos silenciosos que cortaban la comunicación con el proxy.
4.  **🔒 Secrets Sanitization**: Se actualizaron y comprobaron las variables de entorno en producción (específicamente credenciales de DataForSEO), eliminando espacios fantasma y garantizando llamadas limpias.

---

## 🚀 Keyword Tracking & RLS Refactor (v1.5.0 - Data Integrity Edition)

Sesión dedicada a la resolución de conflictos de seguridad, integridad de datos y mejora de la experiencia de usuario (UX) en la creación de proyectos:

1.  **🛡️ Row-Level Security (RLS) Mastery**: Configuración nativa y reparación de políticas `SELECT`, `INSERT` y `UPDATE` para las tablas `keyword_projects` y `keyword_history`. Eliminación definitiva de bloqueos silenciosos y errores `403 Forbidden`.
2.  **🏗️ Defensive UI Pattern**: Inyección de validaciones estrictas (`.select().single()`) post-mutación para garantizar que las caídas de base de datos se reporten explícitamente en la interfaz de usuario en lugar de simular éxitos falsos.
3.  **📍 Smart Location Fallback**: Mecanismo de seguridad en las peticiones a la API de DataForSEO que asume un país por defecto en caso de que el proyecto carezca de ubicación, evitando el colapso (código 0) y falsos reportes de "No encontrado".
4.  **🎓 UX/UI Creation Flow Refactor**: Rediseño arquitectónico de la creación de proyectos mediante un modal exigente (`CreateProjectModal`). Obligación de definir **Nombre, URL (recomendada) y Ubicación (País/Ciudad)** desde el inicio, unificando el ecosistema para SEO Nacional y SEO Local.
5.  **💳 API Credit Protection**: Desarrollo de un modal de confirmación inteligente ("Pre-flight Check") en el Analizador de Mercado, deteniendo peticiones accidentales a DataForSEO causadas por errores tipográficos.
6.  **🧼 Clean Code Refactor**: Limpieza exhaustiva mediante linter, eliminando importaciones huérfanas, corrigiendo dependencias de React (`useEffect`) y reparando advertencias visuales de "z-index" superpuestos en componentes modales.

---

## 🚀 Site Intelligence & Domain Analysis (v1.6.0 - Explorer Edition)

Hemos expandido el ecosistema de inteligencia SEO con un nuevo módulo dedicado al análisis profundo de sitios web y competencia:

1.  **🌐 Explorador de Dominios (Site Analyzer)**: Nueva sección dedicada a analizar cualquier URL para extraer KPIs críticos: Tráfico Mensual Estimado, Total de Keywords Orgánicas, Costo Equivalente en Ads y desgloses de posición (Top 10).
2.  **🏗️ Arquitectura de UI Atómica**: Refactorización quirúrgica de la interfaz de análisis en componentes granulares (`DomainSearchForm`, `SiteOverviewCards`, `RankedKeywordsTable`, `SiteAnalyzerEmptyState`), garantizando un mantenimiento simplificado y alto rendimiento.
3.  **📍 National Intelligence Logic**: Implementación de lógica de filtrado por país para compatibilidad con DataForSEO Labs. El sistema utiliza códigos de ubicación nacionales (ej: España 2724) para garantizar la precisión de los datos pre-calculados a nivel país.
4.  **🧼 Robust Data Parsing**: Desarrollo de un motor de procesamiento de respuestas específico para DataForSEO Labs, blindado contra estructuras de array complejas y garantizando que la información de palabras clave y URLs de destino se muestre siempre con integridad.
5.  **✨ Premium Empty State UX**: Diseño de estados de "No Data" dinámicos que informan al usuario de forma elegante cuando un dominio es demasiado nuevo o tiene poco volumen para aparecer en las bases de datos globales.
6.  **💉 Atomic Utilities & Refactor**: Extracción de lógicas de limpieza de dominios y formateo de divisas (`es-CO`) a utilidades centralizadas, elevando la coherencia visual y técnica de toda la plataforma.

---

## 🚀 Pre-Production Quality & UX Edition (v1.7.0)

Sesión enfocada en blindar la aplicación para el paso a producción mediante testing automatizado y mejoras críticas de experiencia de usuario:

1.  **🧪 Vitest Testing Suite**: Implementación de pruebas unitarias y de componentes (React Testing Library) con 100% de cobertura en utilidades clave (`mappers`, `jsonUtils`, `exportUtils`) y validación de componentes interactivos (`DomainSearchForm`, `LocalVisibilityGraph`).
2.  **🛡️ Integration Testing**: Creación de pruebas de integración end-to-end simuladas para `SiteAnalyzerPage`, garantizando que el flujo de exploración y consumo de créditos sea invulnerable a fallos estructurales.
3.  **💳 API Credit Protection (Smart UX)**: Eliminación definitiva de "gastos fantasma" de la API de DataForSEO. Se reemplazó la recarga automática de posiciones por un *Smart Banner* que notifica al usuario cuando los datos están obsoletos, delegando la decisión de consumo de créditos a una actualización manual.
4.  **🔧 Technical Debt Resolution**: Eliminación de errores críticos de compilación (Strict TypeScript) incluyendo fallos en propagación de JSON y corrección de advertencias dimensionales (Width/Height) del contenedor en gráficos de Recharts.

---

## 🚀 Role-Based Access Control & White Label Administration (v1.8.0)

Hemos construido e integrado un ecosistema completo de jerarquías y administración de agencias (White Label), preparando la aplicación para su lanzamiento SaaS definitivo:

1.  **🛡️ Jerarquía de Roles Estricta**: Creación de un sistema de 5 niveles (`super-admin`, `owner`, `admin`, `staff`, `client`), protegiendo todas las vistas de la aplicación y garantizando el aislamiento de datos entre agencias.
2.  **👑 Panel de Super Administración (`/admin`)**: Dashboard global con métricas en tiempo real y capacidad de alterar roles en caliente mediante mutaciones controladas por React Query.
3.  **🏢 White Label Agency Settings**: Módulo exclusivo en la Configuración para que los `owner` y `admin` definan el nombre y logo de su agencia, y gestionen a su propio equipo (`staff` y `client`).
4.  **🔒 Master RLS Refactor (Security Definer)**: Parcheo avanzado de Row Level Security (RLS) en Supabase para evitar bucles infinitos de recursión, utilizando funciones `SECURITY DEFINER` protegidas con las mejores prácticas de la industria.
5.  **🔗 Historial Compartido (Agency-Level)**: Modificación quirúrgica del hook de historiales y servicios para permitir que los miembros de una agencia vean los mapas de calor creados por su equipo, mientras los clientes solo ven los suyos.

## 🚀 Production Deployment & Security Hardening (v1.9.0)

Hito alcanzado en el lanzamiento oficial y blindaje de infraestructura para producción:

1.  **📦 Vercel Production Release**: Despliegue exitoso en `local-seo-heatmap-six.vercel.app` con configuración de **SPA Routing** optimizada en `vercel.json`, resolviendo errores 404 mediante reglas de reescritura nativas.
2.  **🛡️ Security Headers & CSP**: Implementación de una política de seguridad de contenido (**Content-Security-Policy**) estricta junto con headers de protección industrial (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) para mitigar ataques XSS y Clickjacking.
3.  **🔒 Dynamic CORS Origin Validation**: Blindaje de las Edge Functions de Supabase. Ahora los proxies (`proxy-openai`, `proxy-serper`, etc.) solo aceptan peticiones desde el dominio de producción y localhost, bloqueando accesos no autorizados con **403 Forbidden**.
4.  **💉 TypeScript Strict Compliance (Final)**: Limpieza quirúrgica de errores de tipado, importaciones huérfanas y variables no utilizadas que bloqueaban el pipeline de construcción de producción.
5.  **🧼 Zero-Exposure API Strategy**: Eliminación definitiva de cualquier rastro de API Keys en el código fuente del cliente (incluyendo `VITE_SERPER_API_KEY`), delegando la totalidad de la inteligencia y secretos al entorno seguro de Supabase Secrets.

## 🚀 Premium Experience & Auth Architecture (v2.0.0)

Hito alcanzado en la excelencia visual y estructural del producto:

1.  **🌑 Dark-First Premium UI**: Rediseño integral de la Landing Page utilizando una paleta de colores inmersiva (`oklch(0.1 0.01 250)`), patrones de rejilla técnica y efectos de "glow" ambientales para una estética SaaS de alto nivel.
2.  **🌗 Portal de Acceso Inmersivo (Split Layout)**: Implementación de un nuevo diseño de Login de doble panel (60/40) que combina un "Feature Showcase" visual dinámico con un formulario minimalista y profesional.
3.  **🏗️ Arquitectura Atómica de Autenticación**: Refactorización del módulo de Auth en componentes reutilizables (`AuthInput`, `AuthBrand`) y centralización de datos en `AuthData.ts`, permitiendo escalar el registro y login con total consistencia.
4.  **💉 Precision Refactor (Surgical Clean Code)**: Atomización de la Landing Page en 8 sub-componentes independientes, eliminando archivos monolíticos y mejorando la mantenibilidad mediante la separación total de datos y visuales.
5.  **🛡️ Production Build Mastery**: Resolución de conflictos críticos de tipado en animaciones (`Framer Motion`) e imports estrictos (`verbatimModuleSyntax`), garantizando un despliegue en producción 100% estable.
6.  **✨ UX/UI Polish**: Integración de Micro-animaciones sincronizadas, Glassmorphism avanzado y corrección de jerarquías tipográficas para una experiencia de usuario fluida y cohesiva.

## 🚀 Reporting Dorado & History Intelligence (v2.2.0)

Hito alcanzado en la profesionalización de los reportes ejecutivos y la gestión inteligente del historial:

1.  **📊 LocalDominanceGauge (SoLV)**: Implementación de un medidor radial premium basado en SVG para visualizar el "Share of Local Vision". Incluye estados dinámicos (Crítico, Competitivo, Dominante) y animaciones de alta fidelidad con `framer-motion`.
2.  **💡 Centro de Estrategia Dorado**: Nuevo módulo `SalesStrategyHub` con "Píldoras de Inteligencia" (Punto Ciego, Oportunidad de Oro, Fuerza de Marca) que traducen datos técnicos en argumentos de venta persuasivos para consultores.
3.  **🖼️ Heatmap Mini-Previews**: Integración de `HeatmapThumbnail` en el historial, permitiendo visualizar la cuadrícula de colores de cada escaneo sin necesidad de abrirlo, mejorando la navegación visual.
4.  **⚖️ Modo Comparativo Ejecutivo**: Nueva interfaz de selección múltiple con una barra de herramientas flotante ("Floating Compare Bar") para elegir y contrastar dos análisis históricos ("Antes vs. Después").
5.  **💅 Premium SaaS Aesthetics**: Refactorización estética total del panel de resultados e historial utilizando una base `zinc-950`, tipografía italiana en negrita (`black italic`) y efectos de cristalería (glassmorphism) avanzados.
6.  **🛡️ Surgical Stability Fixes**: Resolución de errores de compilación críticos (Strict TS) y adición formal del componente `Checkbox` mediante el CLI de `shadcn`, garantizando un build de producción impecable.

---

## 🚀 Neo-Minimalist UI/UX Refactor (v2.3.0 - Cal.com / Linear Aesthetic)

Hito enfocado en erradicar el ruido visual y consolidar una estética premium, seria y 100% orientada a datos:

1.  **Patrón Estético Establecido (Nuestro Nuevo Estándar):**
    *   **Monocromatismo:** Uso predominante de la escala de grises (`zinc-50` a `zinc-950`) y blanco/negro puro para contrastes altos. Se prohíbe el uso de fondos coloridos saturados (azules, esmeraldas, ámbar) en los contenedores.
    *   **Sin Sombras, Sin Blur:** Transición de diseños "glassmorphism" ruidosos a componentes planos, delimitados por un borde sutil (`border-zinc-200` light / `border-zinc-800` dark) y esquinas redondeadas (`rounded-xl` o `rounded-md`).
    *   **Color Funcional, No Decorativo:** El color se reserva *únicamente* para los datos geográficos del mapa de calor, avatares, o pequeños estados críticos. Los iconos pasan a ser grises, blancos o negros.
2.  **🧹 Limpieza Profunda del Sistema:**
    *   Refactorización total del **Sidebar** y **Menú de Usuario**: Reemplazo de insignias de color llamativas por variantes "outline" monocromáticas.
    *   **Página de Resultados & Dashboard:** Componentes como `StatRow` y el módulo de `SalesStrategyHub` fueron limpiados, erradicando gradientes y cajas con opacidad colorida.
    *   **Tablas Premium (`CompetitorsTable`, `AdminPage`):** Eliminación de medallas de oro, plata y bronce. Implementación de un sistema de posición sobrio con barras de progreso en blanco/negro, inspirado en paneles financieros.
    *   **Configuraciones Modulares:** Las pestañas de `SettingsPage` actúan ahora como botones limpios integrados perfectamente en un panel ligero, elevando la experiencia de usuario.

Con esta fase, el SaaS garantiza una presencia visual impecable que transmite confianza, claridad absoluta y un alto valor percibido (Premium Enterprise).

---

## 🚀 Visual Identity & Heatmap Vitality (v2.4.0 - Phase A & B Finalized)

Hito final en la transición estética y funcional hacia el estándar Neo-Minimalista (Estilo Linear/Vercel):

1.  **🧬 Unificación de Marca Tipográfica**: Eliminación total de iconos de marca genéricos en favor de una identidad 100% tipográfica (`MAPRANKER PRO`). Refactorización de `Logo.tsx` como componente atómico central para garantizar consistencia absoluta en Sidebar, Navbar y Footer.
2.  **✨ Simulación de Mapa Viva (`MapMockup`)**: Transformación del mockup estático en una experiencia interactiva:
    *   **Efecto Escáner**: Implementación de una línea de luz dinámica que recorre el grid simulando procesamiento en tiempo real.
    *   **Identidad de Negocio**: Integración de un pin central (`MapPin`) con animación de pulso sutil para marcar la ubicación analizada.
    *   **Micro-interacciones**: Celdas con estados de `hover` táctiles y escalado dinámico.
3.  **🔐 Rediseño de Acceso "Surgical Tech" (Punto B)**: Rediseño integral de los portales de Login y Registro:
    *   **Geometría Técnica**: Evolución de `rounded-2xl` a `rounded-lg` para un look más arquitectónico y profesional.
    *   **Contraste Extremo**: Botones primarios en blanco sólido con texto negro y un "halo de luz" (glow) sutil para destacar la acción principal.
    *   **Credibilidad Social**: Restauración de los colores oficiales de Google para maximizar la confianza del usuario.
4.  **🏗️ Arquitectura Atómica y Refactorización**:
    *   Modularización de `AuthInput`, `AuthSocial` y `AuthSuccess`.
    *   Extracción de componentes internos en `MapMockup` para una mantenibilidad quirúrgica.
    *   Localización total (100%) al español de todos los flujos de marketing y acceso.
5.  **📱 Accesibilidad y Responsividad**: Corrección del sistema de scroll en tablets y laptops pequeñas, asegurando que los formularios sean siempre navegables independientemente de la altura de la pantalla.

---

## 🚦 Siguiente Enfoque (Next Steps)

La arquitectura base está asegurada, permitiendo continuar con el perfeccionamiento de producto:
1.  **Rank Tracking Automation**: Fortalecer el monitoreo automático.
2.  **UI/UX Polish**: Perfeccionamiento de gráficas de evolución y animaciones de carga internas.


