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
Asegúrate de tener configuradas las siguientes variables para que la conexión a la nube sea estable:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
VITE_SERPER_API_KEY=tu_api_key_de_serper
VITE_OPENAI_API_KEY=tu_api_key_de_openai

# Configuración White-Label
VITE_DEFAULT_COUNTRY=es      # Código de país (gl) por defecto (es, us, co, etc.)
VITE_DEFAULT_LAT=40.4168    # Latitud por defecto (ej: Madrid)
VITE_DEFAULT_LNG=-3.7038    # Longitud por defecto
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

## 🚀 Estado Actual del Proyecto (v1.2.0 - Final Session Summary)

Tareas pendientes:
1.  **🔄 Sincronización de Proyectos**: Validar refresco de estado entre vistas.
2.  **📉 Gráficos de Evolución**: Visualizar historial de ranking.
3.  **🧪 Debug Final**: Validar rastreo de `narbossalon.com` en Chía.
