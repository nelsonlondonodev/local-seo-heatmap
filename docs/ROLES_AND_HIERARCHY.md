# 👑 Roles & Hierarchy - MapRanker Pro (White Label MVP)

Este documento define la estructura de permisos y jerarquías del sistema Multi-Tenant de **MapRanker Pro**, optimizado para una agencia de marketing de Marca Blanca.

---

## 🏛️ Jerarquía de Roles

### 1. SuperAdmin (Tú, Nelson)
- **Alcance**: Global (Toda la plataforma).
- **Relación**: El dueño del SaaS.
- **Permisos**:
  - Ver y gestionar TODAS las agencias.
  - Ver y gestionar TODOS los usuarios y sus transacciones.
  - Gestionar el branding global y planes de suscripción.
  - CRUD total sobre cualquier mapa o histórico.

### 2. Owner (Dueño de Agencia de Marca Blanca)
- **Alcance**: Su propia Agencia.
- **Relación**: El cliente de Nelson que compra el servicio.
- **Permisos**:
  - Gestionar su propio branding (Logo, Colores de la marca blanca).
  - Ver y gestionar todos sus empleados (**Admin**, **Staff**).
  - Gestionar sus propios **Clients**.
  - Ver todos los heatmaps generados bajo su agencia.

### 3. Admin (Gerente de Agencia)
- **Alcance**: Su propia Agencia.
- **Relación**: Un empleado de alto nivel dentro de la agencia del Owner.
- **Permisos**:
  - Similar al Owner, pero **sin acceso** a la gestión de la agencia (eliminar agencia, facturación, etc.).
  - Gestionar usuarios del nivel **Staff** y **Client**.

### 4. Staff (Empleado / Analista)
- **Alcance**: Su propia Agencia.
- **Relación**: Alguien que opera los mapas para los clientes de la agencia.
- **Permisos**:
  - Lanzar nuevos escaneos de Heatmaps.
  - Ver y descargar reportes de mapas de los clientes asignados.
  - **No puede** ver/crear otros empleados ni dueños.

### 5. Client (Cliente Final de la Agencia)
- **Alcance**: Sus propios Heatmaps asignados.
- **Relación**: El cliente final que quiere ver sus rankings locales.
- **Permisos**:
  - **Solo lectura**. Solo puede entrar para visualizar los resultados de sus mapas.
  - **No puede** lanzar nuevos escaneos o editar configuraciones.

---

## 🔒 Implementación Técnica (RLS)

La seguridad se garantiza a nivel de base de datos (`Row Level Security`) en Supabase utilizando la columna `role` y `agency_id` de la tabla `profiles`. 

- **Aislamiento**: Ninguna agencia puede ver datos de otra agencia.
- **Herencia**: El `SuperAdmin` tiene una política de bypass que le permite supervisar todo el sistema.
