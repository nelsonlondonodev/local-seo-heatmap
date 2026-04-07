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

## 🚀 Estado Actual del Proyecto (v0.4.5)

Hoy hemos alcanzado hitos críticos para la estabilidad y precisión de **MapRanker Pro**:

1.  **🌍 Regionalización Real**: Escaneo configurado para **España (`gl: es`)** con geolocalización precisa vía coordenadas **`ll`**, eliminando resultados erróneos de otros países.
2.  **🧠 Smart Matching**: Refactor de la normalización de texto. Ahora el sistema es tolerante a espacios y variaciones de nombre, garantizando que "Bar Restaurante El Mayor" sea detectado correctamente.
3.  **🎨 Renderizado Seguro**: Implementación de filtros de validación en el mapa para evitar errores de SVG si los datos de coordenadas están incompletos o corruptos.
4.  **📊 Logs de Diagnóstico**: Nuevo sistema de trazabilidad en consola que muestra los negocios encontrados por punto, permitiendo entender por qué un negocio no rankea en el Top 10.
5.  **☁️ Cloud Native**: Persistencia 100% operativa en **Supabase Cloud**.
6.  **🛡️ Seguridad Transitoria**: Implementación de **`sessionStorage`** para tokens de sesión.
7.  **🏎️ Motor de Búsqueda Real**: Integración de **Serper.dev** para escaneo de posicionamiento local en tiempo real.
8.  **✨ UX de Auth Premium**: Nuevo componente **`AuthLoading`** y animaciones de alta fidelidad.
9.  **🏗️ Arquitectura Multi-Tenant**: Soporte para agencias (Marca Blanca).
10. **🕵️ Smart Business Search**: Autocompletado con captura de coordenadas y Place IDs.
11. **📜 Historial de Nube**: Historial de escaneos persistente y navegable.
12. **🧱 Jerarquía Z-Index**: Capas optimizadas para dispositivos móviles.


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

### 🔲 Pendiente de Implementar

- **Motor de búsqueda REAL** — Sustituir el simulador por llamadas reales a Google Places API / Edge Functions.
- **Migración a Base de Datos** — Mover el historial de `localStorage` a las tablas de Supabase (SQL ya preparado).
- **Página de Historial Visual** — Mostrar los resultados guardados en una lista interactiva.
- **Sistema de planes progresivo** — Lógica de restricciones por plan (free/pro/enterprise).

---

## Modelo de Datos

### Tabla `profiles`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` (UUID) | FK a `auth.users` |
| `email` | `string` | Email del usuario |
| `full_name` | `string \| null` | Nombre completo |
| `avatar_url` | `string \| null` | URL del avatar |
| `plan` | `enum` | `'free' \| 'pro' \| 'enterprise'` |
| `created_at` | `timestamp` | Fecha de creación |
| `updated_at` | `timestamp` | Última actualización |

### Tabla `search_history`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` (UUID) | PK |
| `user_id` | `string` | FK a `profiles.id` |
| `keyword` | `string` | Palabra clave buscada |
| `business_name` | `string` | Nombre del negocio |
| `place_id` | `string` | Google Place ID |
| `grid_size` | `enum` | `'3x3' \| '5x5' \| '7x7'` |
| `radius_km` | `number` | Radio en kilómetros |
| `center_lat` | `number` | Latitud del centro |
| `center_lng` | `number` | Longitud del centro |
| `results` | `JSON` | Resultados de la cuadrícula |
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

## Estado Actual del MVP

> **Versión:** 0.4.0 — Seguridad Transitoria & UX Auth Refinado.

Próximas tareas:
1. **Google API Real**: Sustituir el simulador por llamadas reales a Google Places API / Edge Functions.
2. **Sistema de suscripción**: Implementar pasarela de pago para planes Pro y Enterprise.
3. **Analítica Comparativa**: Permitir comparar dos escaneos históricos en una misma vista.
