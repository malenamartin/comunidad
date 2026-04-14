# Comunidad Fardo

Aplicación Next.js para la comunidad de CMOs y equipos de marketing de Fardo.

## Requisitos

- Node.js 20+
- `DATABASE_URL` apuntando a Postgres
- Clerk configurado (`NEXT_PUBLIC_CLERK_*`, `CLERK_SECRET_KEY`)

## Setup

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Migraciones

Ejecutar en orden:

- `migrations/000_full_schema.sql` (en base limpia) o las que falten en tu base existente
- `migrations/004_avatar_presets.sql` para presets de avatares gestionables por admin

## Seed de demo

Para poblar contenido de prueba (miembros, videos, posts, comentarios, reacciones, betas y eventos):

```bash
npm run seed:demo
```

## Módulos admin

- `/comunidad/admin/members`: activar/suspender/eliminar miembros
- `/comunidad/admin/requests`: aprobar/rechazar solicitudes
- `/comunidad/admin/invite-codes`: códigos de invitación
- `/comunidad/admin/posts`: moderación de feed
- `/comunidad/admin/videos`: CRUD de videos de aprendizaje
- `/comunidad/admin/betas`: gestión de betas de producto
- `/comunidad/admin/avatars`: presets de avatar para usuarios

## Design System y UX docs

- Design System guardado en `docs/design-system/`
  - `fardo-design-guideline-v1.4.html`
  - `fardo-design-system.skill.md`
  - `tokens.md`
  - `components.md`
- Propuesta UX para CMO: `docs/ux-improvements-cmo.md`
