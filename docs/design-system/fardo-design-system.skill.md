---
name: fardo-design-system
description: >
  Aplica el Fardo Design System v1.4 a todo output de código frontend. SIEMPRE usar este skill cuando se genere
  cualquier componente, página, UI, artifact, HTML, CSS, JSX, o Next.js para Fardo o la plataforma platform-fardo.com.
  También activar cuando el usuario pida "usar el design system", "aplicar tokens", "con los colores de Fardo",
  o cuando se construya cualquier interfaz que sea parte del ecosistema Fardo. Este skill garantiza consistencia
  visual total: colores, tipografía, espaciado, radio, sombras y componentes siempre alineados al DS oficial.
---

# Fardo Design System — Skill v1.4

Antes de escribir cualquier línea de código frontend para Fardo, leer este skill completo.
Para detalles de tokens completos, leer `references/tokens.md`.
Para componentes con código, leer `references/components.md`.

---

## Reglas absolutas

1. **Nunca usar colores hardcodeados** — siempre tokens `--fardo-*`
2. **Nunca usar primitivos en componentes** — solo tokens semánticos (ej: `--fardo-color-text-primary`, no `--fardo-gray-900`)
3. **Fuente siempre Satoshi** — importar desde `https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700,900&display=swap`
4. **Iconos solo Heroicons outline** — tamaños con `--fardo-icon-*`
5. **Incluir siempre el CSS base** de tokens al inicio de cada archivo (ver sección CSS Base abajo)

---

## CSS Base (incluir siempre)

```html
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700,900&display=swap">
```

```css
/* Incluir fardo-design-tokens.css o pegar tokens inline */
```

Para React/Next.js: importar `fardo-design-tokens.css` en `_app.tsx` o `layout.tsx`.

---

## Tokens — Resumen ejecutivo

### Colores semánticos (usar estos, no los primitivos)

| Token | Uso |
|---|---|
| `--fardo-color-bg-page` | Fondo de página (`#FAF9F8`) |
| `--fardo-color-bg-base` | Fondo de paneles/cards (`#fff`) |
| `--fardo-color-bg-subtle` | Fondo sutil (`#F2F0EE`) |
| `--fardo-color-bg-brand` | Fondo naranja brand |
| `--fardo-color-text-primary` | Texto principal (`gray-900`) |
| `--fardo-color-text-secondary` | Texto secundario (`gray-700`) |
| `--fardo-color-text-muted` | Texto muted (`gray-600`) |
| `--fardo-color-text-brand` | Texto naranja brand |
| `--fardo-color-border-default` | Borde estándar (`gray-200`) |
| `--fardo-color-border-brand` | Borde naranja |

**Brand**: Orange `#FF6A00` (400) / `#E05A00` (500) — es el único color de acción primaria.

### Tipografía

```css
/* Body */
.fardo-body-xs   /* 12px */
.fardo-body-sm   /* 14px */
.fardo-body-md   /* 16px — default */
.fardo-body-lg   /* 18px */

/* Heading */
.fardo-heading-sm  /* 20px */
.fardo-heading-md  /* 24px */
.fardo-heading-lg  /* 28px */
.fardo-heading-xl  /* 36px */

/* Display */
.fardo-display-sm  /* 48px */
.fardo-display-md  /* 64px */
.fardo-display-lg  /* 96px */

/* Weights — siempre combinar con los de arriba */
.fardo-weight-regular    /* 400 */
.fardo-weight-medium     /* 500 */
.fardo-weight-semibold   /* 600 */
.fardo-weight-bold       /* 700 */
```

Ejemplo: `<h2 class="fardo-heading-md fardo-weight-semibold">Título</h2>`

### Espaciado

```
xxs: 2px | xs: 4px | sm: 8px | md: 12px | lg: 16px
xl: 20px | 2xl: 24px | 3xl: 32px | 4xl: 40px | 5xl: 60px
```

### Radius

```
sm: 4px | md: 8px | lg: 12px | xl: 16px | 2xl: 24px | pill: 9999px
```

### Sombras

```
xs: sutil elevación mínima (inputs, botones)
sm: cards estándar
md: dropdowns, popovers
lg: modals, drawers
xl: hero elements
```

---

## Componentes — Referencia rápida

### Botones

5 variantes: `primary`, `secondary`, `ghost`, `gray`, `danger`
3 tamaños: `sm` (32px), `md` (40px), `lg` (48px)

```html
<!-- Primary -->
<button class="fardo-btn fardo-btn-primary fardo-btn-md">Acción</button>

<!-- Secondary -->
<button class="fardo-btn fardo-btn-secondary fardo-btn-md">Ver más</button>

<!-- Ghost -->
<button class="fardo-btn fardo-btn-ghost fardo-btn-sm">Cancelar</button>

<!-- Danger -->
<button class="fardo-btn fardo-btn-danger fardo-btn-md">Eliminar</button>
```

CSS clave:
```css
.fardo-btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: 6px; border: 1.5px solid transparent; cursor: pointer;
  font-family: var(--fardo-font-body); font-weight: var(--fardo-weight-medium);
  transition: var(--fardo-btn-transition); white-space: nowrap;
}
.fardo-btn:focus-visible { box-shadow: var(--fardo-btn-focus-ring); outline: none; }
.fardo-btn-primary { background: var(--fardo-btn-primary-bg); color: var(--fardo-btn-primary-text); }
.fardo-btn-primary:hover { background: var(--fardo-btn-primary-bg-hover); }
```

Para código completo → `references/components.md#buttons`

### Inputs

```html
<div class="fardo-field">
  <label class="fardo-label">Email</label>
  <input type="email" class="fardo-input" placeholder="tu@email.com">
  <p class="fardo-helper">Texto de ayuda opcional</p>
</div>
```

Estado error: agregar `.fardo-input--error` al input y `.fardo-helper--error` al helper.

### Cards

```html
<!-- Card estándar -->
<div class="fardo-card">Contenido</div>

<!-- Card elevated -->
<div class="fardo-card fardo-card-elevated">Contenido destacado</div>

<!-- State cards -->
<div class="fardo-card fardo-card-info">Información</div>
<div class="fardo-card fardo-card-success">Éxito</div>
<div class="fardo-card fardo-card-warning">Advertencia</div>
<div class="fardo-card fardo-card-danger">Error</div>
```

### Tags

```html
<span class="fardo-tag fardo-tag-info">Info</span>
<span class="fardo-tag fardo-tag-success">Activo</span>
<span class="fardo-tag fardo-tag-warning">Pendiente</span>
<span class="fardo-tag fardo-tag-error">Error</span>
```

### Badges

```html
<span class="fardo-badge fardo-badge-success">
  <span class="fardo-badge-dot"></span> Online
</span>
```

Variantes: `success`, `warning`, `danger`, `info`, `brand`, `neutral`

---

## Patrones de uso por stack

### HTML/CSS vanilla
- Importar Satoshi vía `<link>`
- Pegar tokens CSS en `<style>` o en archivo externo
- Usar clases `fardo-*` directamente

### React / JSX
```jsx
// En el componente o en index.css
import './fardo-design-tokens.css'

// Inline styles con tokens
<div style={{ background: 'var(--fardo-color-bg-base)', padding: 'var(--fardo-space-2xl)' }}>
```

### Next.js
```tsx
// app/layout.tsx o pages/_app.tsx
import '../styles/fardo-design-tokens.css'
```

Para Tailwind: NO usar clases utilitarias de color/spacing de Tailwind — usar tokens CSS de Fardo directamente en `style` prop o en CSS modules.

---

## Jerarquía visual — Guía rápida

- **Página**: `bg-page` → `bg-base` (cards) → contenido
- **Acciones primarias**: siempre `btn-primary` (naranja) — una sola por sección
- **Acciones secundarias**: `btn-secondary` o `btn-gray`
- **Destructivas**: siempre `btn-danger`, nunca usar naranja para destruir
- **Estados**: usar color semántico correcto (success=verde, warning=amber, danger=rojo, info=azul)
- **Texto**: primary para contenido principal, secondary para subtítulos, muted para metadata

---

## Referencias adicionales

- `references/tokens.md` — Listado completo de todos los tokens CSS primitivos y semánticos
- `references/components.md` — CSS completo de todos los componentes con todos sus estados
