# 🛠️ Guía de Desarrollo Local y Marca Flexible - MapRanker Pro

Esta guía detalla los pasos para configurar, probar y desplegar el entorno de desarrollo local de **MapRanker Pro**, así como los pasos quirúrgicos requeridos si decides cambiar el nombre del producto o el dominio en el futuro.

---

## 🚀 Configuración del Entorno Local

### 1. Requisitos del Sistema
*   **Node.js**: Versión 20 o superior.
*   **Gestor de Paquetes**: `pnpm` (obligatorio por política del proyecto, controlado mediante `only-allow pnpm` en la preinstalación).
*   **Supabase CLI**: Instalado en tu máquina local para gestionar migraciones y Edge Functions.

### 2. Instalación de Dependencias
Ejecuta el siguiente comando en la raíz del proyecto:
```bash
pnpm install
```

### 3. Variables de Entorno (`.env`)
Crea un archivo `.env` en la raíz copiando la plantilla de ejemplo:
```bash
cp .env.example .env
```
Edita `.env` agregando tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-publica

# Configuración por defecto del mapa para pruebas locales (Madrid)
VITE_DEFAULT_COUNTRY=es
VITE_DEFAULT_LAT=40.4168
VITE_DEFAULT_LNG=-3.7038

# Modo Demo: Si está en true, simulará datos de API en el frontend sin consumir créditos reales de las Edge Functions
VITE_DEMO_MODE=false
```

### 4. Configuración de API Keys (Supabase Secrets)
Para que las Edge Functions proxies puedan comunicarse con los proveedores externos, debes guardar las credenciales en los secretos de Supabase en producción utilizando Supabase CLI:
```bash
supabase secrets set SERPER_API_KEY=tu_clave_de_serper
supabase secrets set OPENAI_API_KEY=tu_clave_de_openai
supabase secrets set DATAFORSEO_LOGIN=tu_usuario_de_dataforseo
supabase secrets set DATAFORSEO_PASSWORD=tu_contraseña_de_dataforseo
supabase secrets set GOOGLE_MAPS_API_KEY=tu_clave_de_google_maps
```

### 5. Parches de Base de Datos (Database Patches)
Si estás desplegando o configurando una base de datos nueva, asegúrate de correr los parches SQL correspondientes en el editor SQL de Supabase:
*   **[supabase_credits_patch.sql](file:///Users/nelsonlondono/Trabajo/developer/local-seo-heatmap/supabase_credits_patch.sql)**: Cambia el valor por defecto de créditos iniciales de 20 a 50 para nuevas cuentas gratuitas y actualiza las cuentas de demo existentes.

---

## 🧬 Guía de Cambio de Marca o Dominio (Paso a Paso)

Si en el futuro compras un dominio diferente o cambias el nombre comercial de **MapRanker Pro**, sigue estas instrucciones para realizar el cambio en el código fuente de manera segura y limpia:

### Paso 1: Configurar la URL Base y el Nombre en el SaaS
Abre el archivo [src/config/saas.ts](file:///Users/nelsonlondono/Trabajo/developer/local-seo-heatmap/src/config/saas.ts) y edita los siguientes campos en la constante `SAAS_CONFIG`:
```ts
export const SAAS_CONFIG = {
  // ...
  SEO: {
    BASE_URL: 'https://tu-nuevo-dominio.com', // 👈 Reemplaza con tu nuevo dominio
    PROTECTED_PATHS: [ /* ... */ ],
  },
  BRAND: {
    NAME: 'Tu Nuevo Nombre Comercial',        // 👈 Reemplaza con el nuevo nombre
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  }
} as const;
```

### Paso 2: Actualizar Metadatos HTML y SEO
Abre el archivo [index.html](file:///Users/nelsonlondono/Trabajo/developer/local-seo-heatmap/index.html) y actualiza el título y las etiquetas OpenGraph y Twitter:
```html
<title>Tu Nuevo Nombre — Domina el SEO Local con Mapas de Calor</title>
<meta name="title" content="Tu Nuevo Nombre — Domina el SEO Local con Mapas de Calor" />
<meta property="og:title" content="Tu Nuevo Nombre — Auditorías de SEO Local de Alta Fidelidad" />
<meta property="twitter:title" content="Tu Nuevo Nombre — SEO Local Maps" />
```

### Paso 3: Actualizar la Lista Blanca de CORS en las Edge Functions
Para que las Edge Functions sigan aceptando peticiones desde el nuevo dominio de producción, debes agregarlo a la lista blanca de CORS.
Abre el archivo [supabase/functions/_shared/cors.ts](file:///Users/nelsonlondono/Trabajo/developer/local-seo-heatmap/supabase/functions/_shared/cors.ts) y añade la nueva URL al array `ALLOWED_ORIGINS`:
```ts
const ALLOWED_ORIGINS = [
  'https://tu-nuevo-dominio.com',           // 👈 Agrega tu nuevo dominio de producción
  'https://local-seo-heatmap-six.vercel.app', // Mantén el dominio anterior de Vercel si es necesario
  'http://localhost:5173',
  'http://localhost:3000',
];
```

### Paso 4: Desplegar las Edge Functions actualizadas
Dado que has editado el archivo compartido de CORS, debes re-desplegar todas las funciones proxy en Supabase para que apliquen las nuevas directivas de cabeceras:
```bash
supabase functions deploy proxy-serper
supabase functions deploy proxy-openai
supabase functions deploy proxy-dataforseo
supabase functions deploy proxy-places
```

### Paso 5: Configurar en Vercel
1. Entra a tu Dashboard de Vercel para el proyecto.
2. Ve a **Settings > Domains** y añade tu nuevo dominio comprado.
3. Asegúrate de configurar los registros DNS correspondientes (CNAME / registros A) en tu registrador de dominios según te indique Vercel.

---

## 🧪 Pruebas Automatizadas y Datos Ficticios

### Ejecución de Pruebas (Vitest)
El proyecto cuenta con un riguroso motor de pruebas unitarias. Para verificar que todo el código comercial, los mappers y los hooks de concurrencia funcionan correctamente, ejecuta:
```bash
pnpm test
```
Para abrir la interfaz gráfica interactiva de pruebas en el navegador:
```bash
pnpm run test:ui
```

### Script de Semilla Histórica (Seeding)
Para poblar tu base de datos local o remota con datos históricos realistas de mapas de calor y keywords para demostraciones, puedes ejecutar el script semilla:
```bash
pnpm dlx tsx src/scripts/seed-history.ts
```
*(Este script requiere que las variables de entorno de Supabase en `.env` apunten a la base de datos de desarrollo y tengan permisos de escritura).*
