# Registro de Cambios (Changelog) - MapRanker Pro

Este documento registra de manera cronológica todos los cambios, mejoras, refactorizaciones y parches de seguridad del proyecto **MapRanker Pro**.

---

## 🚀 Detección Geográfica Dinámica & Placeholders Neutrales (v1.2.0 - Geo-Intelligence Edition)

Hito completado para la globalización de la experiencia de usuario de la plataforma y el robustecimiento ante auditorías de seguridad:

1. **🌍 Detección Geográfica Dinámica (`geoUtils`)**:
   - Creación de la utilidad atómica [geoUtils.ts](file:///Users/nelsonlondono/Trabajo/developer/local-seo-heatmap/src/util/geoUtils.ts) para detectar automáticamente el idioma del navegador del usuario.
   - Adaptación de stubs y datos de demostración en [placesService.ts](file:///Users/nelsonlondono/Trabajo/developer/local-seo-heatmap/src/features/heatmap/services/placesService.ts) a la región del usuario (Madrid para español (`es`), Nueva York para fallback global/inglés).
2. **🧼 Placeholders Neutrales de Interfaz**:
   - Neutralización de inputs fijos de dominio y ubicaciones (ej: Chía, Colombia) en componentes clave (`LocationSelector`, `CreateProjectModal`, `DomainSearchForm`, `SiteAnalyzerPage`), ofreciendo ahora placeholders adaptados dinámicamente según el locale.
3. **🧪 Suite de Pruebas Unitarias de Vitest (71/71 Pasados)**:
   - Creación de [geoUtils.test.ts](file:///Users/nelsonlondono/Trabajo/developer/local-seo-heatmap/src/util/geoUtils.test.ts) con cobertura completa (10 tests) para verificar el mockeo de `navigator.language` bajo todos los entornos posibles.
   - Actualización de aserciones en tests existentes para soportar placeholders dinámicos. Todos los tests de la app se ejecutan con un **100% de éxito**.
4. **🔒 Mitigación de Alertas de Seguridad en Supabase (Auditoría Resolutiva)**:
   - **Aislamiento de `is_super_admin`**: Traslado de la función crítica al esquema privado `internal` para resolver la advertencia de ejecución pública como SECURITY DEFINER.
   - **Política RLS en `ip_rate_limits`**: Creación de una política de RLS exclusiva para el rol `service_role`, eliminando el warning de "RLS Enabled No Policy".

---

## 🚀 Concurrency Armor & Security Hardening (v1.1.0 - Production Armor Edition)

Hito completado en el blindaje contra fugas de presupuesto, bloqueos de concurrencia y optimización del flujo B2B Personal:

1. **🛡️ Concurrency Armor (Hooks de Bloqueo)**:
   - **`useAsyncLock`**: Nuevo hook general que bloquea síncronamente los doble-clics impacientes y peticiones en paralelo en los módulos de Heatmaps, Site Analyzer y Keyword Discovery.
   - **`useKeyedAsyncLock`**: Hook avanzado de bloqueo segmentado por clave. Permite que múltiples keywords actualicen sus rankings en paralelo sin entorpecerse mutuamente, pero **bloquea síncronamente múltiples clics en la misma keyword**.
2. **🧪 Suite de Testing Vitest (61/61 Pasados)**:
   - Creación de pruebas unitarias completas para los hooks en `useAsyncLock.test.ts` y `useKeyedAsyncLock.test.ts` validadas bajo escenarios asíncronos rigurosos y aserciones de microtareas.
   - **Cero fallos**: Confirmación de estabilidad con **61 tests de 61 exitosos** y cero advertencias en la compilación.
3. **🔒 Servidor Proxy Hardening (proxy-dataforseo)**:
   - **Safe JSON Body Parser**: Envoltura defensiva `try/catch` que devuelve un error `400 Bad Request` en solicitudes corruptas para evitar caídas imprevistas (excepciones 500) en el servidor de Deno.
   - **Costo Declarativo**: Centralización dinámica de costes mediante un mapa estricto `ENDPOINT_COSTS` y evaluación limpia con `calculateRequestCost(endpoint)`.
   - **Logs de Auditoría**: Trazabilidad en tiempo real en la consola de Supabase: `[AUDIT] [proxy-dataforseo] User: <id> | Endpoint: <endpoint> | Costo: <costo> créditos`.
4. **📈 Comenzar Gratis & Optimización B2B**:
   - **Cuota de Entrada Corregida**: Ajuste de `DEFAULT_INITIAL_CREDITS` de 20 a **100 créditos** en las reglas de negocio de `saas.ts`. Esto permite a las cuentas nuevas gratis realizar exactamente **3 búsquedas de 3x3** o **1 búsqueda de 5x5**, alineándose con el plan de marketing sin bloquear al usuario en el día 1.
   - **Ocultación de Canales de Pago**: Ocultación del botón *"Actualizar a Pro"* inactivo en los Ajustes (reemplazado por un elegante texto B2B para planes a medida de agencia) y redirección directa de los CTAs de precios a la página de registro gratuito (`/register`).

---

## 🚀 Primera Versión de Producción Estable (v1.0.0 - Release Oficial)

Hito alcanzado en robustez de infraestructura, seguridad de base de datos y tipado 100% estricto:

1. **📦 Infra & DevOps (pnpm Migration)**: Migración completa de `npm` a `pnpm` para optimizar dependencias. Implementación de control estricto de instalación mediante `only-allow pnpm` en la fase `preinstall` y resolución total de dependencias fantasma.
2. **🏗️ Robust-Zero Layout & Collapsable Sidebar**: Implementación de un sidebar colapsable persistente con sincronización de mapas en tiempo real mediante `ResizeObserver` para evitar roturas visuales. Optimización responsiva impecable en tablets y pantallas pequeñas.
3. **🛡️ Database Security & Hardening**: Restricción de la función crítica de base de datos `check_and_deduct_credits` para ejecutarse únicamente bajo el rol `service_role`. Habilitación de políticas RLS para `ip_rate_limits` y adición de pruebas de integración de seguridad.
4. **✨ Zinc-Zero Atomic UI & Form Polish**: Rediseño del marcador de origen en el Heatmap con glassmorphism moderno. Modularización atómica y tipado estricto de componentes de formularios (`DensityButton`, `CostIndicator`) e interfaz de prospección.
5. **⚡ Iron-Code Architecture & SEO**: Centralización del estado de configuración SaaS y hooks de consumo de créditos. Integración de tags canónicos dinámicos y manejo automatizado de directivas para SEO, junto con la importación automática de la versión de `package.json` en Vite.
6. **🩺 Absolute Zero Any Policy**: Erradicación quirúrgica total de la palabra clave `any` y casteos inseguros en el 100% del proyecto y tests, garantizando una seguridad de tipos (Type Safety) absoluta libre de alertas rojas en el IDE.

---

> [!NOTE]
> **Nota sobre el control de versiones**: Las versiones anteriores a la `v1.0.0` oficial de producción (`v0.8.0` a `v2.4.0` en el historial) representaron sprints e iteraciones de la fase de desarrollo Beta del MVP. Con los avances de ayer (commit `662c286`), el proyecto consolidó su primera versión de producción oficial estable como **`v1.0.0`** (sincronizada con el `package.json`), unificando todos los desarrollos previos bajo un ecosistema de alta estabilidad, seguridad y tipado estricto.

---

## 🚀 Visual Identity & Heatmap Vitality (Beta-v2.4.0 - Phase A & B Finalized)

1. **🧬 Unificación de Marca Tipográfica**: Eliminación total de iconos de marca genéricos en favor de una identidad 100% tipográfica (`MAPRANKER PRO`). Refactorización de `Logo.tsx` como componente atómico central para garantizar consistencia absoluta en Sidebar, Navbar y Footer.
2. **✨ Simulación de Mapa Viva (`MapMockup`)**: Transformación del mockup estático en una experiencia interactiva:
   - **Efecto Escáner**: Implementación de una línea de luz dinámica que recorre el grid simulando procesamiento en tiempo real.
   - **Identidad de Negocio**: Integración de un pin central (`MapPin`) con animación de pulso sutil para marcar la ubicación analizada.
   - **Micro-interacciones**: Celdas con estados de `hover` táctiles y escalado dinámico.
3. **🔐 Rediseño de Acceso "Surgical Tech" (Punto B)**: Rediseño integral de los portales de Login y Registro:
   - **Geometría Técnica**: Evolución de `rounded-2xl` a `rounded-lg` para un look más arquitectónico y profesional.
   - **Contraste Extremo**: Botones primarios en blanco sólido con texto negro y un "halo de luz" (glow) sutil para destacar la acción principal.
   - **Credibilidad Social**: Restauración de los colores oficiales de Google para maximizar la confianza del usuario.
4. **🏗️ Arquitectura Atómica y Refactorización**:
   - Modularización de `AuthInput`, `AuthSocial` y `AuthSuccess`.
   - Extracción de componentes internos en `MapMockup` para una mantenibilidad quirúrgica.
   - Localización total (100%) al español de todos los flujos de marketing y acceso.
5. **📱 Accesibilidad y Responsividad**: Corrección del sistema de scroll en tablets y laptops pequeñas, asegurando que los formularios sean siempre navegables independientemente de la altura de la pantalla.

---

## 🚀 Neo-Minimalist UI/UX Refactor (Beta-v2.3.0 - Cal.com / Linear Aesthetic)

1. **Patrón Estético Establecido (Nuestro Nuevo Estándar):**
   - **Monocromatismo**: Uso predominante de la escala de grises (`zinc-50` a `zinc-950`) y blanco/negro puro para contrastes altos. Se prohíbe el uso de fondos coloridos saturados (azules, esmeraldas, ámbar) en los contenedores.
   - **Sin Sombras, Sin Blur**: Transición de diseños "glassmorphism" ruidosos a componentes planos, delimitados por un borde sutil (`border-zinc-200` light / `border-zinc-800` dark) y esquinas redondeadas (`rounded-xl` o `rounded-md`).
   - **Color Funcional, No Decorativo**: El color se reserva *únicamente* para los datos geográficos del mapa de calor, avatares, o pequeños estados críticos. Los iconos pasan a ser grises, blancos o negros.
2. **🧹 Limpieza Profunda del Sistema:**
   - Refactorización total del **Sidebar** y **Menú de Usuario**: Reemplazo de insignias de color llamativas por variantes "outline" monocromáticas.
   - **Página de Resultados & Dashboard**: Componentes como `StatRow` y el módulo de `SalesStrategyHub` fueron limpiados, erradicando gradientes y cajas con opacidad colorida.
   - **Tablas Premium (`CompetitorsTable`, `AdminPage`)**: Eliminación de medallas de oro, plata y bronce. Implementación de un sistema de posición sobrio con barras de progreso en blanco/negro, inspirado en paneles financieros.
   - **Configuraciones Modulares**: Las pestañas de `SettingsPage` actúan ahora como botones limpios integrados perfectamente en un panel ligero, elevando la experiencia de usuario.

---

## 🚀 Reporting Dorado & History Intelligence (Beta-v2.2.0)

1. **📊 LocalDominanceGauge (SoLV)**: Implementación de un medidor radial premium basado en SVG para visualizar el "Share of Local Vision". Incluye estados dinámicos (Crítico, Competitivo, Dominante) y animaciones de alta fidelidad con `framer-motion`.
2. **💡 Centro de Estrategia Dorado**: Nuevo módulo `SalesStrategyHub` con "Píldoras de Inteligencia" (Punto Ciego, Oportunidad de Oro, Fuerza de Marca) que traducen datos técnicos en argumentos de venta persuasivos para consultores.
3. **🖼️ Heatmap Mini-Previews**: Integración de `HeatmapThumbnail` en el historial, permitiendo visualizar la cuadrícula de colores de cada escaneo sin necesidad de abrirlo, mejorando la navegación visual.
4. **⚖️ Modo Comparativo Ejecutivo**: Nueva interfaz de selección múltiple con una barra de herramientas flotante ("Floating Compare Bar") para elegir y contrastar dos análisis históricos ("Antes vs. Después").
5. **💅 Premium SaaS Aesthetics**: Refactorización estética total del panel de resultados e historial utilizando una base `zinc-950`, tipografía italiana en negrita (`black italic`) y efectos de cristalería (glassmorphism) avanzados.
6. **🛡️ Surgical Stability Fixes**: Resolución de errores de compilación críticos (Strict TS) y adición formal del componente `Checkbox` mediante el CLI de `shadcn`, garantizando un build de producción impecable.

---

## 🚀 Premium Experience & Auth Architecture (Beta-v2.0.0)

1. **🌑 Dark-First Premium UI**: Rediseño integral de la Landing Page utilizando una paleta de colores inmersiva (`oklch(0.1 0.01 250)`), patrones de rejilla técnica y efectos de "glow" ambientales para una estética SaaS de alto nivel.
2. **🌗 Portal de Acceso Inmersivo (Split Layout)**: Implementación de un nuevo diseño de Login de doble panel (60/40) que combina un "Feature Showcase" visual dinámico con un formulario minimalista y profesional.
3. **🏗️ Arquitectura Atómica de Autenticación**: Refactorización del módulo de Auth en componentes reutilizables (`AuthInput`, `AuthBrand`) y centralización de datos en `AuthData.ts`, permitiendo escalar el registro y login con total consistencia.
4. **💉 Precision Refactor (Surgical Clean Code)**: Atomización de la Landing Page en 8 sub-componentes independientes, eliminando archivos monolíticos y mejorando la mantenibilidad mediante la separación total de datos y visuales.
5. **🛡️ Production Build Mastery**: Resolución de conflictos críticos de tipado en animaciones (`Framer Motion`) e imports estrictos (`verbatimModuleSyntax`), garantizando un despliegue en producción 100% estable.
6. **✨ UX/UI Polish**: Integración de Micro-animaciones sincronizadas, Glassmorphism avanzado y corrección de jerarquías tipográficas para una experiencia de usuario fluida y cohesiva.

---

## 🚀 Production Deployment & Security Hardening (Beta-v1.9.0)

1. **📦 Vercel Production Release**: Despliegue exitoso en `local-seo-heatmap-six.vercel.app` con configuración de **SPA Routing** optimizada en `vercel.json`, resolviendo errores 404 mediante reglas de reescritura nativas.
2. **🛡️ Security Headers & CSP**: Implementación de una política de seguridad de contenido (**Content-Security-Policy**) estricta junto con headers de protección industrial (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) para mitigar ataques XSS y Clickjacking.
3. **🔒 Dynamic CORS Origin Validation**: Blindaje de las Edge Functions de Supabase. Ahora los proxies (`proxy-openai`, `proxy-serper`, etc.) solo aceptan peticiones desde el dominio de producción y localhost, bloqueando accesos no autorizados con **403 Forbidden**.
4. **💉 TypeScript Strict Compliance (Final)**: Limpieza quirúrgica de errores de tipado, importaciones huérfanas y variables no utilizadas que bloqueaban el pipeline de construcción de producción.
5. **🧼 Zero-Exposure API Strategy**: Eliminación definitiva de cualquier rastro de API Keys en el código fuente del cliente (incluyendo `VITE_SERPER_API_KEY`), delegando la totalidad de la inteligencia y secretos al entorno seguro de Supabase Secrets.

---

## 🚀 Role-Based Access Control & White Label Administration (Beta-v1.8.0)

1. **🛡️ Jerarquía de Roles Estricta**: Creación de un sistema de 5 niveles (`super-admin`, `owner`, `admin`, `staff`, `client`), protegiendo todas las vistas de la aplicación y garantizando el aislamiento de datos entre agencias.
2. **👑 Panel de Super Administración (`/admin`)**: Dashboard global con métricas en tiempo real y capacidad de alterar roles en caliente mediante mutaciones controladas por React Query.
3. **🏢 White Label Agency Settings**: Módulo exclusivo en la Configuración para que los `owner` y `admin` definan el nombre y logo de su agencia, y gestionen a su propio equipo (`staff` y `client`).
4. **🔒 Master RLS Refactor (Security Definer)**: Parcheo avanzado de Row Level Security (RLS) en Supabase para evitar bucles infinitos de recursión, utilizando funciones `SECURITY DEFINER` protegidas con las mejores prácticas de la industria.
5. **🔗 Historial Compartido (Agency-Level)**: Modificación quirúrgica del hook de historiales y servicios para permitir que los miembros de una agencia vean los mapas de calor creados por su equipo, mientras los clientes solo ven los suyos.

---

## 🚀 Pre-Production Quality & UX Edition (Beta-v1.7.0)

1. **🧪 Vitest Testing Suite**: Implementación de pruebas unitarias y de componentes (React Testing Library) con 100% de cobertura en utilidades clave (`mappers`, `jsonUtils`, `exportUtils`) y validación de componentes interactivos (`DomainSearchForm`, `LocalVisibilityGraph`).
2. **🛡️ Integration Testing**: Creación de pruebas de integración end-to-end simuladas para `SiteAnalyzerPage`, garantizando que el flujo de exploración y consumo de créditos sea invulnerable a fallos estructurales.
3. **💳 API Credit Protection (Smart UX)**: Eliminación definitiva de "gastos fantasma" de la API de DataForSEO. Se reemplazó la recarga automática de posiciones por un *Smart Banner* que notifica al usuario cuando los datos están obsoletos, delegando la decisión de consumo de créditos a una actualización manual.
4. **🔧 Technical Debt Resolution**: Eliminación de errores críticos de compilación (Strict TypeScript) incluyendo fallos en propagación de JSON y corrección de advertencias dimensionales (Width/Height) del contenedor en gráficos de Recharts.

---

## 🚀 Site Intelligence & Domain Analysis (Beta-v1.6.0 - Explorer Edition)

1. **🌐 Explorador de Dominios (Site Analyzer)**: Nueva sección dedicada a analizar cualquier URL para extraer KPIs críticos: Tráfico Mensual Estimado, Total de Keywords Orgánicas, Costo Equivalente en Ads y desgloses de posición (Top 10).
2. **🏗️ Arquitectura de UI Atómica**: Refactorización quirúrgica de la interfaz de análisis en componentes granulares (`DomainSearchForm`, `SiteOverviewCards`, `RankedKeywordsTable`, `SiteAnalyzerEmptyState`), garantizando un mantenimiento simplificado y alto rendimiento.
3. **📍 National Intelligence Logic**: Implementación de lógica de filtrado por país para compatibilidad con DataForSEO Labs. El sistema utiliza códigos de ubicación nacionales (ej: España 2724) para garantizar la precisión de los datos pre-calculados a nivel país.
4. **🧼 Robust Data Parsing**: Desarrollo de un motor de procesamiento de respuestas específico para DataForSEO Labs, blindado contra estructuras de array complejas y garantizando que la información de palabras clave y URLs de destino se muestre siempre con integridad.
5. **✨ Premium Empty State UX**: Diseño de estados de "No Data" dinámicos que informan al usuario de forma elegante cuando un dominio es demasiado nuevo o tiene poco volumen para aparecer en las bases de datos globales.
6. **💉 Atomic Utilities & Refactor**: Extracción de lógicas de limpieza de dominios y formateo de divisas (`es-CO`) a utilidades centralizadas, elevando la coherencia visual y técnica de toda la plataforma.

---

## 🚀 Keyword Tracking & RLS Refactor (Beta-v1.5.0 - Data Integrity Edition)

1. **🛡️ Row-Level Security (RLS) Mastery**: Configuración nativa y reparación de políticas `SELECT`, `INSERT` y `UPDATE` para las tablas `keyword_projects` and `keyword_history`. Eliminación definitiva de bloqueos silenciosos y errores `403 Forbidden`.
2. **🏗️ Defensive UI Pattern**: Inyección de validaciones estrictas (`.select().single()`) post-mutación para garantizar que las caídas de base de datos se reporten explícitamente en la interfaz de usuario en lugar de simular éxitos falsos.
3. **📍 Smart Location Fallback**: Mecanismo de seguridad en las peticiones a la API de DataForSEO que asume un país por defecto en caso de que el proyecto carezca de ubicación, evitando el colapso (código 0) y falsos reportes de "No encontrado".
4. **🎓 UX/UI Creation Flow Refactor**: Rediseño arquitectónico de la creación de proyectos mediante un modal exigente (`CreateProjectModal`). Obligación de definir **Nombre, URL (recomendada) y Ubicación (País/Ciudad)** desde el inicio, unificando el ecosistema para SEO Nacional y SEO Local.
5. **💳 API Credit Protection**: Desarrollo de un modal de confirmación inteligente ("Pre-flight Check") en el Analizador de Mercado, deteniendo peticiones accidentales a DataForSEO causadas por errores tipográficos.
6. **🧼 Clean Code Refactor**: Limpieza exhaustiva mediante linter, eliminando importaciones huérfanas, corrigiendo dependencias de React (`useEffect`) y reparando advertencias visuales de "z-index" superpuestos en componentes modales.

---

## 🚀 Edge Functions & Security API Migration Resolved (Beta-v1.4.1 - Production Stable)

1. **🛡️ Custom JWT Verification**: El Gateway de Supabase (modo `--verify-jwt`) rechazaba los tokens ES256. Se configuraron las funciones con `--no-verify-jwt` delegando la seguridad de forma nativa a Deno (`getAuthenticatedUser`), garantizando protección total y soporte para todos los tokens.
2. **🏗️ Enhanced Proxy Logger**: Se construyó un logger quirúrgico en `edgeFunctions.ts` capaz de capturar respuestas JSON en cuerpos de error 401, permitiendo aislar si el bloqueo proviene del Gateway o del proveedor (ej. DataForSEO).
3. **💊 Session Persistence**: Se reconfiguró Supabase Client para usar `localStorage` en lugar de `sessionStorage`, eliminando deslogueos silenciosos que cortaban la comunicación con el proxy.
4. **🔒 Secrets Sanitization**: Se actualizaron y comprobaron las variables de entorno en producción (específicamente credenciales de DataForSEO), eliminando espacios fantasma y garantizando llamadas limpias.

---

## 🚀 Edge Functions & Security Migration (Beta-v1.4.0 - Infrastructure Edition)

1. **🛡️ Zero-Key Client Architecture**: Eliminación total de API Keys del bundle de frontend. Ahora el cliente solo conoce las llaves de Supabase.
2. **🏗️ Supabase Edge Proxy Hub**: Implementación de 4 proxies inteligentes en Deno/Supabase Functions para centralizar el tráfico hacia OpenAI, Serper, DataForSEO y Google Places.
3. **💉 JWT Security Injection**: Todas las llamadas se autorizan mediante el header `Authorization`, centralizando el control de acceso en el servidor.
4. **📦 Secrets Management**: Configuración de entorno segura mediante `supabase secrets`, protegiendo las credenciales de terceros contra inspección.

---

## 🚀 Global Sync & RLS Resilience (Beta-v1.3.0 - Surgery Edition)

1. **🏗️ Centralización de Datos (Single Source of Truth)**: Refactorización integral de la gestión de proyectos. Ahora la información fluye desde `KeywordPage` hacia todos los subcomponentes, eliminando la fragmentación de estados y garantizando que toda la app vea lo mismo al mismo tiempo.
2. **🛡️ Parche de Seguridad RLS (Supabase)**: Implementación de una lógica de "reparación de agencia" automática. El sistema ahora detecta y corrige la ausencia de `agency_id` en los proyectos, asegurando el cumplimiento de las políticas de Row Level Security y eliminando los errores 403 Forbidden.
3. **⚡ Actualizaciones Optimistas**: Mejora de la experiencia de usuario (UX) mediante actualizaciones inmediatas en la interfaz. Los cambios (como vincular una URL) se reflejan al instante sin esperar la respuesta del servidor, eliminando parpadeos y borrados accidentales.
4. **🧼 Modo Investigación por Defecto**: Preservación del estado "Ninguno" como punto de entrada predeterminado. Esto permite realizar estudios de mercado sin ensuciar proyectos reales, manteniendo una "Mesa de Trabajo Limpia".
5. **💉 Refactorización Quirúrgica**: Re-escritura de componentes críticos (`MonitoringView`, `ProjectSelector`, `SiteSettingsCard`) con un enfoque en funciones atómicas, tipado estricto y eliminación de deuda técnica.

---

## 🚀 Modular Intelligence & Site Management (Beta-v1.2.0 - Core Scaling Edition)

1. **🏗️ Arquitectura Dual de Keywords**: Separación de **Analizador de Mercado** y **Rastreador de Posiciones**.
2. **🌐 Site Manager (Asset Tracking)**: Nuevo panel `SiteSettingsCard` para vincular URLs (ej: `narbossalon.com`).
3. **🤖 Smart Auto-Monitoring**: Rastreo automático cada 3 días para keywords obsoletas.
4. **🎯 Local SoLV Metrics**: Cuota de visibilidad en el heatmap.
5. **🔗 Nav-Reconnection**: Navegación fluida entre secciones mediante React Router.

---

## 🚀 Surgical Refactor & Clean Code (Beta-v1.1.0 - Architecture Excellence)

1. **🛡️ 100% Strict Type Safety**: Refactorización integral de `keywordPersistenceService.ts` y `dataForSeoService.ts`. Eliminación total de tipos `any` y casteos inseguros (`as unknown as`), sustituyéndolos por tipos compuestos que reflejan exactamente los JOINS de la base de datos.
2. **🏗️ Atomic Hook Logic**: Rediseño completo de `useKeywordDiscovery.ts`, extrayendo la lógica de sincronización, caché y auto-guardado en funciones atómicas. Mejora de estabilidad y rendimiento mediante el uso exhaustivo de `useCallback`.
3. **🔄 Database Schema Sync**: Sincronización manual de las definiciones en `database.ts` con columnas reales existentes (`location_name`, `country_code`), garantizando que la capa de persistencia sea robusta ante cambios en el esquema.
4. **💉 Precision Helper Extraction**: Simplificación de los puntos de entrada de los servicios mediante la extracción de lógicas complejas (como la doble verificación de volumen local) a funciones privadas y atómicas.
5. **🧼 UI Cleanliness**: Eliminación de logs residuales de depuración y estandarización de los flujos de "Workbench" para una experiencia de usuario final impecable.

---

## 🚀 Precision & Persistence Hub (Beta-v1.0.0 - Local Intelligence Edition)

1. **📍 Local Search Precision (City-Level)**: Implementación de lógica de "Doble Verificación" en el API. Ahora el sistema extrae el volumen de búsqueda específico de la ciudad (ej: Chía) en lugar del volumen nacional, eliminando inflaciones de datos irrelevantes para negocios locales.
2. **💾 Auto-Save Infrastructure**: Los términos principales de búsqueda en el laboratorio de Descubrimiento se guardan automáticamente en el historial de seguimiento del proyecto, agilizando el flujo de trabajo.
3. **🧼 Clean Workbench UX**: Lógica de "Mesa Limpia" configurada para vaciar los resultados temporales al entrar en la sección o cambiar de cliente, manteniendo el foco y evitando la confusión entre proyectos.
4. **🏷️ Project Branding Logic**: Refactorización visual del selector de proyectos para mostrar nombres reales en lugar de IDs, junto con un flujo de creación de proyectos ultra-simplificado e intuitivo.
5. **🔄 Balanced Session Continuity**: Equilibrio entre persistencia de datos (mientras navegas internamente) y reseteo de pantalla (al cambiar de contexto), optimizando la navegación fluida.

---

## 🚀 Auditoría de Robustez & Tipado (Beta-v0.9.5 - Surgical Compliance)

1. **🛡️ TypeScript Strict Compliance**: Eliminación total de tipos `any` en los módulos de Keywords, Servicios de Datos, Persistencia y Hooks. Uso de interfaces robustas para el 100% de la lógica de negocio.
2. **🏗️ VerbatimModuleSyntax Compliance**: Resolución definitiva de errores de renderizado (pantalla en blanco) mediante la estandarización de `import type`, optimizando la compatibilidad con el compilador de Vite y TypeScript 5+.
3. **📍 Location Intelligence UX**: Refactorización del selector geográfico para eliminar bloqueos de entrada y mejorar la precisión del flujo de usuario.
4. **🔧 Dev-Ops & Support Overhaul**: Extensión de la excelencia del código hacia las herramientas de desarrollo; el script `seed-history.ts` ha sido blindado contra errores de tipo.
5. **💉 Atomic Persistence Service**: Blindaje del servicio de Supabase mediante "Double-Layer Casting" y validación previa de datos, eliminando fallos silenciosos.

---

## 🚀 Keyword Intelligence Hub (Beta-v0.9.0 - SEO Discovery & Tracking)

1. **🔍 Descubrimiento Predictivo Geografiado**: Nuevo flujo de búsqueda País -> Ciudad -> Pueblo con autocompletado en tiempo real para una precisión geográfica total.
2. **📊 Métricas de Google Ads Real-Time**: Integración con DataForSEO para obtener volúmenes de búsqueda, dificultad y CPC específicos para la localidad seleccionada.
3. **🎯 Rank Tracking Live**: Capacidad de rastrear la posición orgánica actual de un dominio en el Top 100 de Google para cualquier palabra clave guardada.
4. **💾 Persistencia Geográfica de Proyectos**: Los proyectos ahora guardan su propio contexto (País y Ubicación), permitiendo una carga automática de datos al cambiar de cliente.
5. **📈 Historial & Evolución de Ranking**: Sistema de guardado histórico cada vez que se actualiza una posición, preparando el terreno para gráficas de evolución.
6. **💉 Master Refactor**: Modularización de la UI en componentes atómicos (`KeywordConfigPanel`, `KeywordRankRow`) y estandarización del servicio de API para un mantenimiento simplificado.
