# Fardo Comunidad

App **Next.js** (comunidad, feed, admin, Clerk, PostgreSQL).

## Requisitos

- Node 20+
- Cuenta [Clerk](https://clerk.com) (auth)
- Base **PostgreSQL** (recomendado: [Railway](https://railway.app))

## Setup local

```bash
npm install
cp .env.example .env.local
```

Completá `.env.local`: claves Clerk y **`DATABASE_URL`** (ver abajo).

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Base de datos (Railway + migraciones)

### 1. Crear Postgres en Railway

1. [railway.app](https://railway.app) → **New project** → **Empty project**.
2. **+ Add service** → **Database** → **PostgreSQL**.
3. Abrí el servicio Postgres → **Variables** (o **Connect**).
4. Copiá **`DATABASE_URL`** (cadena `postgresql://...`).

### 2. Conectar el proyecto local

Pegá la URL en `.env.local`:

```bash
DATABASE_URL=postgresql://...
```

### 3. Aplicar migraciones

Desde la raíz del repo (con `DATABASE_URL` disponible):

```bash
npm run db:migrate
```

Este comando ejecuta en orden:

- `migrations/001_community_tables.sql`
- `migrations/002_phase2_tables.sql`
- `migrations/004_avatars_and_admin_fixes.sql`

**Nota:** no uses `000_full_schema.sql` junto con `001` (son esquemas distintos). `003_phase3_tables.sql` asume IDs enteros en miembros; el código actual usa **UUID** (`001`), así que esa fase queda fuera hasta unificar el esquema.

### 4. Vercel (producción)

En el proyecto de Vercel → **Settings** → **Environment Variables** → añadí **`DATABASE_URL`** con el mismo valor que en Railway (o la variable referenciada según tu setup). Volvé a desplegar.

Opcional: `vercel env pull .env.local` si usás la CLI.

## Scripts

| Script        | Descripción              |
|---------------|--------------------------|
| `npm run dev` | Servidor de desarrollo   |
| `npm run build` | Build de producción    |
| `npm run start` | Servidor tras build    |
| `npm run db:migrate` | SQL migrations (requiere `DATABASE_URL`) |

## Documentación

- [Next.js](https://nextjs.org/docs)
- [Vercel](https://vercel.com/docs)
