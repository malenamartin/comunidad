# Fardo Components — CSS completo

## Reset base

```css
* { box-sizing: border-box; }

body {
  font-family: var(--fardo-font-body);
  background-color: var(--fardo-color-bg-page);
  color: var(--fardo-color-text-primary);
  line-height: 1.5;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}
```

---

## Buttons

### CSS

```css
/* Base */
.fardo-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1.5px solid transparent;
  cursor: pointer;
  font-family: var(--fardo-font-body);
  font-weight: var(--fardo-btn-font-weight);
  transition: var(--fardo-btn-transition);
  white-space: nowrap;
  line-height: 1.25;
  text-decoration: none;
}
.fardo-btn:focus-visible {
  outline: none;
  box-shadow: var(--fardo-btn-focus-ring);
}
.fardo-btn svg { flex-shrink: 0; }

/* Sizes */
.fardo-btn-sm {
  font-size: var(--fardo-btn-font-size-sm);
  padding: var(--fardo-btn-padding-y-sm) var(--fardo-btn-padding-x-sm);
  border-radius: var(--fardo-btn-radius-sm);
}
.fardo-btn-md {
  font-size: var(--fardo-btn-font-size-md);
  padding: var(--fardo-btn-padding-y-md) var(--fardo-btn-padding-x-md);
  border-radius: var(--fardo-btn-radius-md);
}
.fardo-btn-lg {
  font-size: var(--fardo-btn-font-size-lg);
  padding: var(--fardo-btn-padding-y-lg) var(--fardo-btn-padding-x-lg);
  border-radius: var(--fardo-btn-radius-lg);
}

/* Icon-only */
.fardo-btn-icon-sm { width: var(--fardo-btn-icon-size-sm); height: var(--fardo-btn-icon-size-sm); padding: 0; border-radius: var(--fardo-btn-radius-sm); }
.fardo-btn-icon-md { width: var(--fardo-btn-icon-size-md); height: var(--fardo-btn-icon-size-md); padding: 0; border-radius: var(--fardo-btn-radius-md); }
.fardo-btn-icon-lg { width: var(--fardo-btn-icon-size-lg); height: var(--fardo-btn-icon-size-lg); padding: 0; border-radius: var(--fardo-btn-radius-lg); }

/* Primary */
.fardo-btn-primary {
  background: var(--fardo-btn-primary-bg);
  color: var(--fardo-btn-primary-text);
  box-shadow: var(--fardo-btn-shadow);
}
.fardo-btn-primary:hover { background: var(--fardo-btn-primary-bg-hover); box-shadow: var(--fardo-btn-shadow-hover); }
.fardo-btn-primary:active { background: var(--fardo-btn-primary-bg-active); }
.fardo-btn-primary:disabled { background: var(--fardo-btn-primary-bg-disabled); color: var(--fardo-btn-primary-text-disabled); cursor: not-allowed; box-shadow: none; }

/* Secondary */
.fardo-btn-secondary {
  background: var(--fardo-btn-secondary-bg);
  color: var(--fardo-btn-secondary-text);
  border-color: var(--fardo-btn-secondary-border);
}
.fardo-btn-secondary:hover { background: var(--fardo-btn-secondary-bg-hover); border-color: var(--fardo-btn-secondary-border-hover); }
.fardo-btn-secondary:active { background: var(--fardo-btn-secondary-bg-active); }
.fardo-btn-secondary:disabled { color: var(--fardo-btn-secondary-text-disabled); border-color: var(--fardo-btn-secondary-border-disabled); cursor: not-allowed; }

/* Ghost */
.fardo-btn-ghost {
  background: var(--fardo-btn-ghost-bg);
  color: var(--fardo-btn-ghost-text);
}
.fardo-btn-ghost:hover { background: var(--fardo-btn-ghost-bg-hover); color: var(--fardo-btn-ghost-text-hover); }
.fardo-btn-ghost:active { background: var(--fardo-btn-ghost-bg-active); }

/* Gray */
.fardo-btn-gray {
  background: var(--fardo-btn-gray-bg);
  color: var(--fardo-btn-gray-text);
  border-color: var(--fardo-btn-gray-border);
}
.fardo-btn-gray:hover { background: var(--fardo-btn-gray-bg-hover); border-color: var(--fardo-btn-gray-border-hover); color: var(--fardo-btn-gray-text-hover); }
.fardo-btn-gray:disabled { color: var(--fardo-btn-gray-text-disabled); border-color: var(--fardo-gray-200); cursor: not-allowed; }

/* Danger */
.fardo-btn-danger {
  background: var(--fardo-btn-danger-bg);
  color: var(--fardo-btn-danger-text);
  box-shadow: var(--fardo-btn-shadow);
}
.fardo-btn-danger:hover { background: var(--fardo-btn-danger-bg-hover); }
.fardo-btn-danger:disabled { background: var(--fardo-gray-200); color: var(--fardo-gray-500); cursor: not-allowed; box-shadow: none; }
```

### HTML Examples

```html
<!-- Primary sizes -->
<button class="fardo-btn fardo-btn-primary fardo-btn-sm">Small</button>
<button class="fardo-btn fardo-btn-primary fardo-btn-md">Medium</button>
<button class="fardo-btn fardo-btn-primary fardo-btn-lg">Large</button>

<!-- Con ícono -->
<button class="fardo-btn fardo-btn-primary fardo-btn-md">
  <svg class="w-5 h-5" ...></svg>
  Guardar
</button>

<!-- Icon-only -->
<button class="fardo-btn fardo-btn-primary fardo-btn-icon-md">
  <svg ...></svg>
</button>

<!-- Disabled -->
<button class="fardo-btn fardo-btn-primary fardo-btn-md" disabled>Deshabilitado</button>
```

---

## Inputs

### CSS

```css
/* Field wrapper */
.fardo-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Label */
.fardo-label {
  font-size: var(--fardo-text-2);
  font-weight: var(--fardo-weight-medium);
  color: var(--fardo-input-label);
}

/* Input base */
.fardo-input {
  width: 100%;
  height: var(--fardo-input-height);
  padding: var(--fardo-input-padding-y) var(--fardo-input-padding-x);
  font-family: var(--fardo-font-body);
  font-size: var(--fardo-input-font-size);
  color: var(--fardo-input-text);
  background: var(--fardo-input-bg);
  border: 1.5px solid var(--fardo-input-border);
  border-radius: var(--fardo-input-radius);
  box-shadow: var(--fardo-input-shadow);
  transition: var(--fardo-input-transition);
  outline: none;
  appearance: none;
}
.fardo-input::placeholder { color: var(--fardo-input-text-placeholder); }
.fardo-input:hover { border-color: var(--fardo-input-border-hover); }
.fardo-input:focus {
  border-color: var(--fardo-input-border-focus);
  box-shadow: var(--fardo-input-shadow), var(--fardo-input-focus-ring);
}
.fardo-input--error { border-color: var(--fardo-input-border-error); }
.fardo-input:disabled {
  background: var(--fardo-input-bg-disabled);
  border-color: var(--fardo-input-border-disabled);
  color: var(--fardo-input-text-disabled);
  cursor: not-allowed;
}

/* Textarea */
.fardo-textarea {
  /* Hereda todo de .fardo-input */
  height: auto;
  min-height: 80px;
  resize: vertical;
}

/* Helper */
.fardo-helper {
  font-size: var(--fardo-text-1);
  color: var(--fardo-input-helper);
}
.fardo-helper--error { color: var(--fardo-input-helper-error); }

/* Select */
.fardo-select {
  /* Hereda de .fardo-input + */
  cursor: pointer;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23A9A4A0'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3e%3c/path%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
}
.fardo-select:focus { border-color: var(--fardo-input-border-focus); box-shadow: var(--fardo-input-shadow), var(--fardo-input-focus-ring); }
```

### HTML Examples

```html
<!-- Input estándar -->
<div class="fardo-field">
  <label class="fardo-label">Nombre</label>
  <input type="text" class="fardo-input" placeholder="Tu nombre">
</div>

<!-- Con helper -->
<div class="fardo-field">
  <label class="fardo-label">Email</label>
  <input type="email" class="fardo-input" placeholder="tu@email.com">
  <p class="fardo-helper">Te enviaremos un correo de confirmación</p>
</div>

<!-- Con error -->
<div class="fardo-field">
  <label class="fardo-label">Contraseña</label>
  <input type="password" class="fardo-input fardo-input--error">
  <p class="fardo-helper fardo-helper--error">La contraseña es requerida</p>
</div>

<!-- Select -->
<div class="fardo-field">
  <label class="fardo-label">País</label>
  <select class="fardo-input fardo-select">
    <option>Argentina</option>
    <option>México</option>
  </select>
</div>
```

---

## Cards

### CSS

```css
/* Card base */
.fardo-card {
  background: var(--fardo-card-bg);
  border: 1px solid var(--fardo-card-border);
  border-radius: var(--fardo-card-radius);
  box-shadow: var(--fardo-card-shadow);
  padding: var(--fardo-card-padding-md);
  transition: all 0.15s ease;
}

/* Sizes */
.fardo-card-sm { padding: var(--fardo-card-padding-sm); }
.fardo-card-lg { padding: var(--fardo-card-padding-lg); }

/* Hover */
.fardo-card--hoverable:hover {
  background: var(--fardo-card-bg-hover);
  border-color: var(--fardo-card-border-hover);
  box-shadow: var(--fardo-card-shadow-hover);
}

/* Selected */
.fardo-card--selected {
  border-color: var(--fardo-card-border-selected);
  box-shadow: var(--fardo-card-shadow-hover);
}

/* Elevated */
.fardo-card-elevated {
  border-color: var(--fardo-card-elevated-border);
  box-shadow: var(--fardo-card-elevated-shadow);
  border-radius: var(--fardo-card-elevated-radius);
}

/* State cards */
.fardo-card-info    { background: var(--fardo-card-info-bg);    border-color: var(--fardo-card-info-border); }
.fardo-card-success { background: var(--fardo-card-success-bg); border-color: var(--fardo-card-success-border); }
.fardo-card-warning { background: var(--fardo-card-warning-bg); border-color: var(--fardo-card-warning-border); }
.fardo-card-danger  { background: var(--fardo-card-danger-bg);  border-color: var(--fardo-card-danger-border); }
```

### HTML Examples

```html
<div class="fardo-card">Contenido estándar</div>
<div class="fardo-card fardo-card--hoverable">Card clickeable</div>
<div class="fardo-card fardo-card-elevated">Card destacada</div>
<div class="fardo-card fardo-card-success">Operación exitosa</div>
```

---

## Tags

```css
.fardo-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--fardo-radius-pill);
  font-size: var(--fardo-text-2);
  font-weight: var(--fardo-weight-medium);
  line-height: 1.4;
  border: 1px solid;
}
.fardo-tag-icon { margin-right: 6px; font-size: var(--fardo-icon-sm); }

.fardo-tag-info    { background: var(--fardo-blue-50);  color: var(--fardo-blue-700);  border-color: var(--fardo-blue-200); }
.fardo-tag-success { background: var(--fardo-green-50); color: var(--fardo-green-700); border-color: var(--fardo-green-200); }
.fardo-tag-warning { background: var(--fardo-amber-50); color: var(--fardo-amber-700); border-color: var(--fardo-amber-200); }
.fardo-tag-error   { background: var(--fardo-red-50);   color: var(--fardo-red-700);   border-color: var(--fardo-red-200); }
```

```html
<span class="fardo-tag fardo-tag-info">Info</span>
<span class="fardo-tag fardo-tag-success">
  <svg class="fardo-tag-icon" ...></svg>
  Activo
</span>
```

---

## Badges

```css
.fardo-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: var(--fardo-text-1);
  font-weight: var(--fardo-weight-medium);
  padding: 3px 10px;
  border-radius: var(--fardo-radius-pill);
}
.fardo-badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.fardo-badge-success { background: var(--fardo-green-50); color: var(--fardo-green-600); }
.fardo-badge-success .fardo-badge-dot { background: var(--fardo-green-500); }

.fardo-badge-warning { background: var(--fardo-amber-50); color: var(--fardo-amber-600); }
.fardo-badge-warning .fardo-badge-dot { background: var(--fardo-amber-500); }

.fardo-badge-danger { background: var(--fardo-red-50); color: var(--fardo-red-600); }
.fardo-badge-danger .fardo-badge-dot { background: var(--fardo-red-500); }

.fardo-badge-info { background: var(--fardo-blue-50); color: var(--fardo-blue-600); }
.fardo-badge-info .fardo-badge-dot { background: var(--fardo-blue-500); }

.fardo-badge-brand { background: var(--fardo-orange-50); color: var(--fardo-orange-600); }
.fardo-badge-brand .fardo-badge-dot { background: var(--fardo-orange-500); }

.fardo-badge-neutral { background: var(--fardo-gray-100); color: var(--fardo-gray-600); border: 1px solid var(--fardo-gray-200); }
.fardo-badge-neutral .fardo-badge-dot { background: var(--fardo-gray-500); }
```

```html
<span class="fardo-badge fardo-badge-success">
  <span class="fardo-badge-dot"></span>
  Online
</span>

<span class="fardo-badge fardo-badge-warning">
  <span class="fardo-badge-dot"></span>
  Pendiente
</span>
```

---

## Tipografía — Clases utilitarias

```css
/* Body */
.fardo-body-xs   { font-family: var(--fardo-font-body); font-size: var(--fardo-body-xs); line-height: 1.5; }
.fardo-body-sm   { font-family: var(--fardo-font-body); font-size: var(--fardo-body-sm); line-height: 1.5; }
.fardo-body-md   { font-family: var(--fardo-font-body); font-size: var(--fardo-body-md); line-height: 1.5; }
.fardo-body-lg   { font-family: var(--fardo-font-body); font-size: var(--fardo-body-lg); line-height: 1.5; }

/* Heading */
.fardo-heading-sm { font-family: var(--fardo-font-heading); font-size: var(--fardo-heading-sm); line-height: 1.3;  letter-spacing: -0.01em; }
.fardo-heading-md { font-family: var(--fardo-font-heading); font-size: var(--fardo-heading-md); line-height: 1.25; letter-spacing: -0.01em; }
.fardo-heading-lg { font-family: var(--fardo-font-heading); font-size: var(--fardo-heading-lg); line-height: 1.2;  letter-spacing: -0.015em; }
.fardo-heading-xl { font-family: var(--fardo-font-heading); font-size: var(--fardo-heading-xl); line-height: 1.15; letter-spacing: -0.02em; }

/* Display */
.fardo-display-sm { font-family: var(--fardo-font-display); font-size: var(--fardo-display-sm); line-height: 1.1;  letter-spacing: -0.02em; }
.fardo-display-md { font-family: var(--fardo-font-display); font-size: var(--fardo-display-md); line-height: 1.05; letter-spacing: -0.025em; }
.fardo-display-lg { font-family: var(--fardo-font-display); font-size: var(--fardo-display-lg); line-height: 1;    letter-spacing: -0.03em; }

/* Weights */
.fardo-weight-regular  { font-weight: var(--fardo-weight-regular); }
.fardo-weight-medium   { font-weight: var(--fardo-weight-medium); }
.fardo-weight-semibold { font-weight: var(--fardo-weight-semibold); }
.fardo-weight-bold     { font-weight: var(--fardo-weight-bold); }
```

---

## Select con chevron personalizado

```css
.fardo-select-wrapper { position: relative; }
.fardo-dropdown-chevron {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--fardo-select-icon-color);
  transition: transform 0.2s ease;
}
.fardo-dropdown.open .fardo-dropdown-chevron {
  transform: translateY(-50%) rotate(180deg);
}
```

---

## React — Patrón de componentes

```tsx
// Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gray' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}

export function Button({ variant = 'primary', size = 'md', children, ...props }: ButtonProps) {
  return (
    <button
      className={`fardo-btn fardo-btn-${variant} fardo-btn-${size}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Input.tsx
export function Input({ label, helper, error, ...props }) {
  return (
    <div className="fardo-field">
      {label && <label className="fardo-label">{label}</label>}
      <input className={`fardo-input${error ? ' fardo-input--error' : ''}`} {...props} />
      {(helper || error) && (
        <p className={`fardo-helper${error ? ' fardo-helper--error' : ''}`}>
          {error || helper}
        </p>
      )}
    </div>
  )
}
```
