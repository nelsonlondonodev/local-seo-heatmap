# MapRanker Pro 🗺️

**El Problema:** Muchos negocios locales pierden miles de dólares mensuales porque son "invisibles" en Google Maps. Carecen de herramientas para entender en qué calles específicas su competencia les está robando clientes, y las agencias de marketing sufren para demostrar el valor real de sus servicios de SEO Local con reportes técnicos aburridos.

**La Solución (MapRanker Pro):** Una plataforma SaaS de Inteligencia SEO Local que audita el posicionamiento geolocalizado de cualquier negocio y lo convierte en un mapa de calor visual e interactivo. Transforma métricas complejas en "Argumentos de Cierre" persuasivos (visibilidad, puntos ciegos, ROI) permitiendo a consultores y agencias auditar, prospectar y cerrar clientes de forma contundente.

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
- [Documentación Técnica Específica](#-documentación-técnica-específica)
- [Registro de Versiones](#-registro-de-versiones)

---

## 🚀 Estado Actual del Proyecto (v1.3.0 - Production Stable)

El proyecto se encuentra en su versión de producción estable **`v1.3.0`**, habiéndose implementado medidas estrictas de control de consumo para proteger la inversión en APIs de terceros y corregido advertencias críticas del ciclo de vida de React:

1. **🔒 Arquitectura Zero-Key Client**: Las API keys de terceros (Serper, DataForSEO, OpenAI, Google) están 100% protegidas y aisladas en el servidor mediante Supabase Edge Functions. El frontend solo conoce las credenciales públicas de Supabase.
2. **💳 Control de Créditos y Límite Inicial**: El saldo por defecto para nuevas cuentas se redujo de 100 a **50 créditos** (mediante [supabase_credits_patch.sql](./supabase_credits_patch.sql) y [saas.ts](./src/config/saas.ts)), limitando la exposición financiera por cuenta de prueba a un máximo de $0.05.
3. **🚫 Bloqueo de Grid 7x7 para Cuentas Free**: Deshabilitación visual e interactiva con icono de candado (`Lock`) de la cuadrícula de 7x7 para usuarios en el plan gratuito en [SearchForm.tsx](./src/features/heatmap/components/forms/SearchForm.tsx), mitigando consumos accidentales de alto costo.
4. **🛡️ Concurrency Armor**: Implementación de bloqueos asíncronos (`useAsyncLock`, `useKeyedAsyncLock`) para blindar el presupuesto contra clics accidentales dobles y cargas concurrentes innecesarias.
5. **🩺 Estabilidad del Código (Rules of Hooks)**: Corrección de violaciones de renderizado condicional en la página de Keywords ([KeywordPage.tsx](./src/pages/KeywordPage.tsx)), garantizando un ciclo de vida limpio y libre de advertencias de consola.
3. **🏢 White Label & Roles**: Jerarquía multi-inquilino de 5 niveles para agencias y clientes con aislamiento estricto mediante políticas de seguridad a nivel de fila (RLS).
4. **🌍 Detección Geográfica Dinámica**: Detección del idioma y locale del usuario para mostrar coordenadas iniciales (Madrid vs. New York) y placeholders neutrales de búsqueda.
5. **🧪 Cobertura de Testing**: Suite robusta de pruebas automatizadas con Vitest que valida la lógica del negocio con un 100% de éxito.

---

## 🛠️ Guía de Desarrollo Rápido

### Requisitos Previos
- Node.js 20+
- pnpm (instalador de paquetes requerido por política del proyecto)
- Supabase CLI para configuraciones locales de base de datos.

### Instalación
```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd local-seo-heatmap

# 2. Instalar dependencias (se requiere pnpm)
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# 4. Ejecutar en modo desarrollo
pnpm run dev
```

> [!TIP]
> Para conocer a detalle la configuración del entorno local y cómo renombrar la marca o dominio en el futuro, consulta la [Guía de Configuración Local y Desarrollo (docs/DEVELOPMENT_GUIDE.md)](./docs/DEVELOPMENT_GUIDE.md).

---

## Descripción

**MapRanker Pro** es una plataforma SaaS que genera mapas de calor (heatmaps) para analizar el posicionamiento local de un negocio en Google Maps. El usuario configura una búsqueda con una palabra clave, nombre de negocio, Place ID de Google, tamaño de cuadrícula y radio, y el sistema genera un mapa interactivo con puntos coloreados según el ranking obtenido en cada ubicación simulada.

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
| **TypeScript** | 5.9 | Tipado estático estricto |
| **Tailwind CSS** | 4.x | Estilos (via `@tailwindcss/vite`) |
| **shadcn/ui** | 4.x | Componentes UI (Base UI + CVA) |
| **Supabase** | 2.x | Auth + Base de datos (PostgreSQL) + Edge Functions |
| **React Query** | 5.x | Gestión de estado del servidor |
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
├── components/                # Componentes comunes y UI atómica
│   ├── ProtectedRoute.tsx     # Wrapper de rutas autenticadas
│   ├── auth/                  # Componentes auxiliares de login/registro
│   ├── landing/               # Componentes de la Landing Page pública
│   ├── seo/                   # Elementos de cabecera e indexación
│   ├── shared/                # Componentes compartidos (Logo, Sidebar, etc.)
│   └── ui/                    # Componentes shadcn/ui
│
├── config/                    # Configuración estática y del SaaS
│   ├── constants.ts           # Constantes generales de la UI y mapas
│   └── saas.ts                # Fuente de verdad de límites, costes y marca
│
├── context/                   # Contextos globales de React
│   └── SidebarContext.tsx     # Estado del menú lateral colapsable
│
├── features/                  # Módulos encapsulados por dominio de negocio
│   ├── ai-optimization/       # Herramientas de optimización con OpenAI (Posts, Reseñas, Bios)
│   ├── auth/                  # Lógica y proveedores de autenticación de Supabase
│   ├── branding/              # Gestión de marca blanca para agencias
│   ├── heatmap/               # Generador de mapas de calor y lógica de puntos
│   └── keywords/              # Descubrimiento de Keywords y Rank Tracking local
│
├── hooks/                     # Custom Hooks globales (bloqueos, media queries, etc.)
│   ├── useAsyncLock.ts        # Bloqueo síncrono para clicks concurrentes
│   ├── useKeyedAsyncLock.ts   # Bloqueo segmentado asíncrono para keywords
│   ├── useHeatmaps.ts         # Hook para escaneo e historiales de heatmap
│   └── ...
│
├── layouts/
│   └── DashboardLayout.tsx    # Layout con sidebar colapsable + mobile menu
│
├── lib/                       # Librerías y configuración de clientes
│   ├── edgeFunctions.ts       # Utilidades para llamadas a Supabase Edge Functions
│   ├── errors.ts              # Manejo estandarizado de excepciones
│   ├── logger.ts              # Sistema de logs centralizado por entorno
│   ├── supabase.ts            # Cliente Supabase tipado
│   └── utils.ts               # Utilidad cn() (clsx + tailwind-merge)
│
├── pages/                     # Vistas de la aplicación SPA
│   ├── LandingPage.tsx        # Página de marketing pública
│   ├── LoginPage.tsx          # Login
│   ├── RegisterPage.tsx       # Registro
│   ├── DashboardPage.tsx      # Panel principal (configuración + mapa de calor)
│   ├── HistoryPage.tsx        # Historial de búsquedas y comparador
│   ├── KeywordPage.tsx        # Keywords (Descubrimiento + Tracking)
│   ├── SiteAnalyzerPage.tsx   # Analizador de dominios y competidores
│   ├── AdminPage.tsx          # Panel de SuperAdministrador
│   └── SettingsPage.tsx       # Ajustes y Marca Blanca de Agencia
│
├── scripts/                   # Scripts de automatización y desarrollo
│   └── seed-history.ts        # Lector/Generador de datos históricos ficticios
│
├── services/                  # Servicios de conexión y llamadas de negocio
│   ├── adminService.ts        # Operaciones de administración y créditos
│   ├── agencyService.ts       # Operaciones de agencias y branding
│   ├── aiService.ts           # Generador e integración de prompts de IA
│   ├── heatmapService.ts      # Consultas e inserción de heatmaps en DB
│   └── profileService.ts      # Gestión de datos del perfil del usuario
│
├── types/                     # Tipados estricto de TypeScript
│   ├── index.ts               # Tipos del dominio
│   └── database.ts            # Tipos de la base de datos Supabase
│
└── util/                      # Utilidades y mappers de datos puros
    ├── geoUtils.ts            # Utilidad de detección geográfica
    ├── jsonUtils.ts           # Parseadores de JSON seguros
    └── ...
```

---

## Variables de Entorno (.env)

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

> [!WARNING]
> **Las API keys de terceros (SERPER, OPENAI, DATAFORSEO) nunca se exponen en el frontend.** Deben configurarse como Secrets en las Edge Functions de Supabase. Consulta [docs/API_REFERENCE.md](./docs/API_REFERENCE.md) para más información.

---

## Scripts Disponibles

| Script | Comando | Descripción |
|---|---|---|
| **dev** | `pnpm run dev` | Servidor de desarrollo local con Vite |
| **build** | `pnpm run build` | Compilación de TypeScript y empaquetado de producción |
| **lint** | `pnpm run lint` | Análisis de código estático con ESLint |
| **preview** | `pnpm run preview` | Previsualización local del build de producción |
| **test** | `pnpm test` | Ejecución de pruebas unitarias con Vitest |
| **test:ui** | `pnpm run test:ui` | Interfaz gráfica de Vitest |

## 🚀 Roadmap de Telemetría y Consumo de Créditos (v1.4.0+)

Para garantizar la viabilidad comercial y la protección del presupuesto de APIs de terceros (Serper, DataForSEO, OpenAI), el proyecto tiene planificado el desarrollo de los siguientes módulos en las próximas versiones:

### 1. Tabla Desglose de Consumo de Créditos (Basado en Collac.io)
El sistema contará con una equivalencia clara de costos por acción para que el usuario conozca en qué gasta su saldo:

| Acción del Sistema | Costo en Créditos | API de Terceros Consumida | Propósito |
|---|---|---|---|
| **Escaneo de Heatmap (Coordenada)** | 1 crédito / punto | Serper /maps API | Búsqueda local geolocalizada en Google Maps |
| **Búsqueda Web Orgánica (SERP)** | 5 créditos / consulta | Serper /search API | Listado de resultados de búsqueda móvil/desktop |
| **Optimización SEO con IA** | 2 créditos / análisis | OpenAI completions API | Generación de posts, respuestas y descripciones GBP |
| **Análisis de Palabras Clave (Labs)** | 5 créditos / consulta | DataForSEO Labs API | Obtención de volumen, CPC y competencia local |
| **Autocompletado de Ubicaciones** | 1 crédito / consulta | Google Places / autocomplete | Búsqueda predictiva de direcciones y negocios |

### 2. Módulos de Contadores y Telemetría
*   **Panel de SuperAdministrador (SuperAdmin Counter)**:
    - Vista consolidada de consumo de créditos totales en la plataforma.
    - Monitor de coste financiero real en USD de las APIs de Serper y DataForSEO para el administrador (Nelson).
*   **Panel de Dueño de Agencia (Owner Agency Counter)**:
    - Registro histórico del consumo de créditos realizado por su equipo (usuarios tipo `admin` y `staff`).
    - Desglose de créditos consumidos por cada cliente final (`client`) asignado a su marca blanca.
*   **Contadores e Historial por Perfil (Profile Limits & Throttling)**:
    - Contadores individuales por perfil (`profiles.credits`) con reabastecimiento manual o periódico configurable.
    - Cuotas de uso temporal por día/semana para evitar picos de consumo inesperados.

### 3. Gestión Completa de Usuarios (CRUD Administrativo & Owners)
El panel de **Gestión de Usuarios** incorporará controles administrativos completos para gestionar el ciclo de vida de los perfiles de la plataforma (aplicable tanto a la vista de `SuperAdmin` como al panel de administración de agencias de `Owner`):
*   **Create (Crear)**: Capacidad para dar de alta nuevos usuarios/miembros del equipo directamente desde la interfaz, asignando plan inicial, créditos y rol de forma inmediata.
*   **Read (Leer)**: Vista detallada de perfiles que incluya su historial de mapas generados y transacciones de créditos.
*   **Update (Actualizar)**: Edición directa del nombre de usuario, email, plan, créditos y cambio dinámico de rol (`super-admin`, `owner`, `admin`, `staff`, `client`).
*   **Delete (Eliminar)**: Eliminación o desactivación lógica de perfiles no deseados con un **modal de confirmación de seguridad de doble paso** para evitar pérdidas accidentales de datos e historial de mapas.

---

## 🗂️ Documentación Técnica Específica

Para profundizar en la arquitectura y componentes específicos del sistema, consulta los siguientes documentos:

*   **[Guía de Permisos y Jerarquías (docs/ROLES_AND_HIERARCHY.md)](./docs/ROLES_AND_HIERARCHY.md)**: Estructura multi-tenant, roles (`super-admin`, `owner`, `admin`, `staff`, `client`) y su herencia.
*   **[Esquema de Base de Datos y RLS (docs/DATABASE_SCHEMA.md)](./docs/DATABASE_SCHEMA.md)**: Tablas de PostgreSQL, relaciones, triggers, funciones y políticas de seguridad a nivel de fila.
*   **[Referencia de la API y Edge Functions (docs/API_REFERENCE.md)](./docs/API_REFERENCE.md)**: Arquitectura Zero-Key, proxies, payloads, códigos de error y control de locks.
*   **[Guía de Configuración Local y Desarrollo (docs/DEVELOPMENT_GUIDE.md)](./docs/DEVELOPMENT_GUIDE.md)**: Instalación local de dependencias con `pnpm`, manejo de secrets, ejecución de tests y guía para renombrar marca/dominio.

---

## 📝 Registro de Versiones

Todo el historial detallado del desarrollo del MVP (sprints de desarrollo beta) y las versiones estables de producción se registran formalmente en el archivo **[CHANGELOG.md](./CHANGELOG.md)**.
