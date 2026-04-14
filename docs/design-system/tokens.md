# Fardo Design Tokens — Referencia completa

## 1. Primitivos de color

```css
:root {
  /* Absolutos */
  --color-white: #FFFFFF;
  --color-black: #000000;

  /* Orange (11 pasos) — color brand principal */
  --fardo-orange-50:  #FFF3EB;
  --fardo-orange-100: #FFD6B0;
  --fardo-orange-200: #FFB878;  /* border secondary */
  --fardo-orange-300: #FF9040;
  --fardo-orange-400: #FF6A00;  /* ★ brand primary */
  --fardo-orange-500: #E05A00;  /* hover */
  --fardo-orange-600: #B84A00;  /* active */
  --fardo-orange-700: #8C3600;
  --fardo-orange-800: #602400;
  --fardo-orange-900: #3D1500;
  --fardo-orange-950: #200A00;

  /* Gray warm (11 pasos) */
  --fardo-gray-50:  #FAF9F8;  /* bg-page */
  --fardo-gray-100: #F2F0EE;  /* bg-subtle, borders sutiles */
  --fardo-gray-200: #E6E3E0;  /* borders default */
  --fardo-gray-300: #D5D1CD;  /* border inputs */
  --fardo-gray-400: #C2BDB8;  /* placeholder */
  --fardo-gray-500: #A9A4A0;  /* icons muted */
  --fardo-gray-600: #898480;  /* text muted */
  --fardo-gray-700: #67635F;  /* text secondary */
  --fardo-gray-800: #474441;  /* fg muted */
  --fardo-gray-900: #2C2A28;  /* text primary */
  --fardo-gray-950: #191817;

  /* Blue (11 pasos) */
  --fardo-blue-50:  #EBF4FF;
  --fardo-blue-100: #C0DAFB;
  --fardo-blue-200: #85BBF8;
  --fardo-blue-300: #3D96F5;
  --fardo-blue-400: #0577FD;  /* ★ brand blue */
  --fardo-blue-500: #0462D4;
  --fardo-blue-600: #034EAB;
  --fardo-blue-700: #033F8C;
  --fardo-blue-800: #022F69;
  --fardo-blue-900: #021F46;
  --fardo-blue-950: #01142E;
  /* Extras */
  --fardo-blue-deep: #2A4A6A;
  --fardo-blue-dark: #15313D;

  /* Purple (11 pasos) */
  --fardo-purple-50:  #F5EEFF;
  --fardo-purple-100: #DFC8F5;
  --fardo-purple-200: #B890E8;
  --fardo-purple-300: #8A56CC;
  --fardo-purple-400: #6B30AA;
  --fardo-purple-500: #562888;
  --fardo-purple-600: #4A2A5A;  /* ★ */
  --fardo-purple-700: #351A42;
  --fardo-purple-800: #220E2C;
  --fardo-purple-900: #150820;
  --fardo-purple-950: #0A0414;

  /* Green / Success */
  --fardo-green-50:  #EAF6EF;
  --fardo-green-100: #C8E9D5;
  --fardo-green-200: #A3D5C3;
  --fardo-green-300: #5BB58A;
  --fardo-green-400: #2E9B68;
  --fardo-green-500: #1F8556;
  --fardo-green-600: #276A43;
  --fardo-green-700: #1D4F32;
  --fardo-green-800: #113421;
  --fardo-green-900: #081D12;
  --fardo-green-950: #030E09;

  /* Amber / Warning */
  --fardo-amber-50:  #FFF6E4;
  --fardo-amber-100: #FDEDC2;
  --fardo-amber-200: #FFD282;
  --fardo-amber-300: #F5A623;
  --fardo-amber-400: #D98B00;
  --fardo-amber-500: #BF7617;
  --fardo-amber-600: #A6630F;
  --fardo-amber-700: #7A4A09;
  --fardo-amber-800: #4F3005;
  --fardo-amber-900: #2A1A02;
  --fardo-amber-950: #150D01;

  /* Red / Danger */
  --fardo-red-50:  #FDEBEC;
  --fardo-red-100: #F9CECE;
  --fardo-red-200: #F7BDC0;
  --fardo-red-300: #F08080;
  --fardo-red-400: #E05050;
  --fardo-red-500: #D64545;
  --fardo-red-600: #B93636;
  --fardo-red-700: #9C2727;
  --fardo-red-800: #6E1A1A;
  --fardo-red-900: #400E0E;
  --fardo-red-950: #220707;
}
```

---

## 2. Tokens semánticos — Light Mode

```css
:root {
  /* Background */
  --fardo-color-bg-page:     var(--fardo-gray-50);
  --fardo-color-bg-base:     var(--color-white);
  --fardo-color-bg-subtle:   var(--fardo-gray-100);
  --fardo-color-bg-elevated: var(--color-white);
  --fardo-color-bg-overlay:  rgba(0, 0, 0, 0.45);
  --fardo-color-bg-brand:    var(--fardo-orange-400);
  --fardo-color-bg-info:     var(--fardo-blue-50);
  --fardo-color-bg-success:  var(--fardo-green-50);
  --fardo-color-bg-warning:  var(--fardo-amber-50);
  --fardo-color-bg-danger:   var(--fardo-red-50);

  /* Foreground */
  --fardo-color-fg-default:  var(--fardo-gray-800);
  --fardo-color-fg-muted:    var(--fardo-gray-600);
  --fardo-color-fg-subtle:   var(--fardo-gray-400);
  --fardo-color-fg-brand:    var(--fardo-orange-400);
  --fardo-color-fg-on-brand: var(--color-white);
  --fardo-color-fg-info:     var(--fardo-blue-500);
  --fardo-color-fg-success:  var(--fardo-green-500);
  --fardo-color-fg-warning:  var(--fardo-amber-500);
  --fardo-color-fg-danger:   var(--fardo-red-500);

  /* Border */
  --fardo-color-border-default: var(--fardo-gray-200);
  --fardo-color-border-subtle:  var(--fardo-gray-100);
  --fardo-color-border-strong:  var(--fardo-gray-500);
  --fardo-color-border-brand:   var(--fardo-orange-400);
  --fardo-color-border-info:    var(--fardo-blue-400);
  --fardo-color-border-success: var(--fardo-green-500);
  --fardo-color-border-warning: var(--fardo-amber-500);
  --fardo-color-border-danger:  var(--fardo-red-500);

  /* Text */
  --fardo-color-text-primary:   var(--fardo-gray-900);
  --fardo-color-text-secondary: var(--fardo-gray-700);
  --fardo-color-text-muted:     var(--fardo-gray-600);
  --fardo-color-text-disabled:  var(--fardo-gray-400);
  --fardo-color-text-brand:     var(--fardo-orange-500);
  --fardo-color-text-on-brand:  var(--color-white);
  --fardo-color-text-info:      var(--fardo-blue-500);
  --fardo-color-text-success:   var(--fardo-green-600);
  --fardo-color-text-warning:   var(--fardo-amber-600);
  --fardo-color-text-danger:    var(--fardo-red-600);
}
```

---

## 3. Sombras

```css
:root {
  --fardo-shadow-none: none;
  --fardo-shadow-xs:   0px 1px 2px rgba(0, 0, 0, 0.06);
  --fardo-shadow-sm:   0px 1px 4px rgba(0, 0, 0, 0.08), 0px 0px 0px 1px rgba(0, 0, 0, 0.05);
  --fardo-shadow-md:   0px 4px 12px rgba(0, 0, 0, 0.10), 0px 0px 0px 1px rgba(0, 0, 0, 0.06);
  --fardo-shadow-lg:   0px 8px 24px rgba(0, 0, 0, 0.12), 0px 0px 0px 1px rgba(0, 0, 0, 0.06);
  --fardo-shadow-xl:   0px 16px 48px rgba(0, 0, 0, 0.14), 0px 0px 0px 1px rgba(0, 0, 0, 0.06);
}
```

---

## 4. Espaciado

```css
:root {
  --fardo-space-none: 0;
  --fardo-space-xxs:  2px;
  --fardo-space-xs:   4px;
  --fardo-space-sm:   8px;
  --fardo-space-md:   12px;
  --fardo-space-lg:   16px;
  --fardo-space-xl:   20px;
  --fardo-space-2xl:  24px;
  --fardo-space-3xl:  32px;
  --fardo-space-4xl:  40px;
  --fardo-space-5xl:  60px;
  --fardo-space-6xl:  80px;
  --fardo-space-7xl:  120px;
}
```

---

## 5. Radius

```css
:root {
  --fardo-radius-sm:   4px;
  --fardo-radius-md:   8px;
  --fardo-radius-lg:   12px;
  --fardo-radius-xl:   16px;
  --fardo-radius-2xl:  24px;
  --fardo-radius-pill: 9999px;
}
```

---

## 6. Tipografía

```css
:root {
  --fardo-font-body:    "Satoshi", sans-serif;
  --fardo-font-heading: "Satoshi", sans-serif;
  --fardo-font-display: "Satoshi", sans-serif;

  /* Weights */
  --fardo-weight-regular:        400;
  --fardo-weight-medium:         500;
  --fardo-weight-semibold:       600;
  --fardo-weight-bold:           700;
  --fardo-weight-body:           var(--fardo-weight-regular);
  --fardo-weight-heading:        var(--fardo-weight-medium);
  --fardo-weight-heading-strong: var(--fardo-weight-semibold);
  --fardo-weight-display:        var(--fardo-weight-bold);

  /* Font sizes */
  --fardo-text-1:  12px;
  --fardo-text-2:  14px;
  --fardo-text-3:  16px;
  --fardo-text-4:  18px;
  --fardo-text-5:  20px;
  --fardo-text-6:  24px;
  --fardo-text-7:  28px;
  --fardo-text-8:  36px;
  --fardo-text-9:  48px;
  --fardo-text-10: 64px;
  --fardo-text-11: 96px;

  /* Semantic */
  --fardo-body-xs: var(--fardo-text-1);
  --fardo-body-sm: var(--fardo-text-2);
  --fardo-body-md: var(--fardo-text-3);
  --fardo-body-lg: var(--fardo-text-4);

  --fardo-heading-sm: var(--fardo-text-5);
  --fardo-heading-md: var(--fardo-text-6);
  --fardo-heading-lg: var(--fardo-text-7);
  --fardo-heading-xl: var(--fardo-text-8);

  --fardo-display-sm: var(--fardo-text-9);
  --fardo-display-md: var(--fardo-text-10);
  --fardo-display-lg: var(--fardo-text-11);

  --fardo-tracking-tight:  -0.02em;
  --fardo-tracking-normal: 0;
}
```

---

## 7. Iconos

Solo iconos **Heroicons outline**. Nunca filled excepto excepción explícita.

```css
:root {
  --fardo-icon-xs: 16px;
  --fardo-icon-sm: 20px;
  --fardo-icon-md: 24px;
  --fardo-icon-lg: 32px;
  --fardo-icon-xl: 40px;
}
```

---

## 8. Gradientes

```css
:root {
  --fardo-gradient-brand:  linear-gradient(90deg, #FF3B1D 0%, #FE800F 100%);
  --fardo-gradient-orange: linear-gradient(90deg, #FF3B1D 0%, #FE800F 100%);
  --fardo-gradient-purple: linear-gradient(135deg, #1A1A1A 0%, #2A1A3A 100%);
  --fardo-gradient-blue:   linear-gradient(135deg, #1A1A1A 0%, #1A2A4A 100%);
}
```

---

## 9. Tokens de componentes

```css
:root {
  /* Buttons */
  --fardo-btn-transition:   all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --fardo-btn-focus-ring:   0 0 0 3px rgba(255, 106, 0, 0.25);
  --fardo-btn-shadow:       var(--fardo-shadow-xs);
  --fardo-btn-shadow-hover: var(--fardo-shadow-sm);

  /* Primary */
  --fardo-btn-primary-bg:          var(--fardo-orange-400);
  --fardo-btn-primary-bg-hover:    var(--fardo-orange-500);
  --fardo-btn-primary-bg-active:   var(--fardo-orange-600);
  --fardo-btn-primary-bg-disabled: var(--fardo-gray-200);
  --fardo-btn-primary-text:        var(--color-white);
  --fardo-btn-primary-text-disabled: var(--fardo-gray-500);

  /* Secondary */
  --fardo-btn-secondary-bg:              transparent;
  --fardo-btn-secondary-bg-hover:        var(--fardo-orange-50);
  --fardo-btn-secondary-bg-active:       var(--fardo-orange-100);
  --fardo-btn-secondary-text:            var(--fardo-orange-500);
  --fardo-btn-secondary-text-disabled:   var(--fardo-gray-400);
  --fardo-btn-secondary-border:          var(--fardo-orange-200);
  --fardo-btn-secondary-border-hover:    var(--fardo-orange-400);
  --fardo-btn-secondary-border-disabled: var(--fardo-gray-200);

  /* Ghost */
  --fardo-btn-ghost-bg:         transparent;
  --fardo-btn-ghost-bg-hover:   var(--fardo-gray-100);
  --fardo-btn-ghost-bg-active:  var(--fardo-gray-200);
  --fardo-btn-ghost-text:       var(--fardo-gray-700);
  --fardo-btn-ghost-text-hover: var(--fardo-gray-900);

  /* Gray */
  --fardo-btn-gray-bg:              transparent;
  --fardo-btn-gray-bg-hover:        var(--fardo-gray-50);
  --fardo-btn-gray-text:            var(--fardo-gray-700);
  --fardo-btn-gray-text-hover:      var(--fardo-gray-900);
  --fardo-btn-gray-border:          var(--fardo-gray-300);
  --fardo-btn-gray-border-hover:    var(--fardo-gray-600);

  /* Danger */
  --fardo-btn-danger-bg:       var(--fardo-red-500);
  --fardo-btn-danger-bg-hover: var(--fardo-red-600);
  --fardo-btn-danger-text:     var(--color-white);

  /* Sizes */
  --fardo-btn-padding-y-sm: 6px;   --fardo-btn-padding-x-sm: 12px;
  --fardo-btn-padding-y-md: 10px;  --fardo-btn-padding-x-md: 16px;
  --fardo-btn-padding-y-lg: 14px;  --fardo-btn-padding-x-lg: 24px;
  --fardo-btn-radius-sm: var(--fardo-radius-sm);
  --fardo-btn-radius-md: var(--fardo-radius-md);
  --fardo-btn-radius-lg: var(--fardo-radius-lg);
  --fardo-btn-font-size-sm: var(--fardo-text-2);
  --fardo-btn-font-size-md: var(--fardo-text-3);
  --fardo-btn-font-size-lg: var(--fardo-text-4);
  --fardo-btn-font-weight:  var(--fardo-weight-medium);
  --fardo-btn-icon-size-sm: 32px;
  --fardo-btn-icon-size-md: 40px;
  --fardo-btn-icon-size-lg: 48px;

  /* Cards */
  --fardo-card-bg:              var(--color-white);
  --fardo-card-bg-hover:        var(--fardo-gray-50);
  --fardo-card-border:          var(--fardo-gray-200);
  --fardo-card-border-hover:    var(--fardo-gray-300);
  --fardo-card-border-selected: var(--fardo-orange-400);
  --fardo-card-radius:          var(--fardo-radius-lg);
  --fardo-card-shadow:          var(--fardo-shadow-sm);
  --fardo-card-shadow-hover:    var(--fardo-shadow-md);
  --fardo-card-padding-sm:      var(--fardo-space-lg);
  --fardo-card-padding-md:      var(--fardo-space-2xl);
  --fardo-card-padding-lg:      var(--fardo-space-3xl);
  --fardo-card-elevated-shadow: var(--fardo-shadow-lg);
  --fardo-card-elevated-radius: var(--fardo-radius-xl);

  /* Inputs */
  --fardo-input-bg:               var(--color-white);
  --fardo-input-bg-disabled:      var(--fardo-gray-50);
  --fardo-input-border:           var(--fardo-gray-300);
  --fardo-input-border-hover:     var(--fardo-gray-500);
  --fardo-input-border-focus:     var(--fardo-orange-400);
  --fardo-input-border-error:     var(--fardo-red-500);
  --fardo-input-border-disabled:  var(--fardo-gray-200);
  --fardo-input-text:             var(--fardo-gray-900);
  --fardo-input-text-placeholder: var(--fardo-gray-400);
  --fardo-input-text-disabled:    var(--fardo-gray-400);
  --fardo-input-label:            var(--fardo-gray-800);
  --fardo-input-helper:           var(--fardo-gray-600);
  --fardo-input-helper-error:     var(--fardo-red-600);
  --fardo-input-radius:           var(--fardo-radius-md);
  --fardo-input-padding-y:        10px;
  --fardo-input-padding-x:        12px;
  --fardo-input-font-size:        var(--fardo-text-3);
  --fardo-input-height:           40px;
  --fardo-input-focus-ring:       0 0 0 3px rgba(255, 106, 0, 0.20);
  --fardo-input-shadow:           var(--fardo-shadow-xs);
  --fardo-input-transition:       all 0.15s cubic-bezier(0.4, 0, 0.2, 1);

  /* Select/Dropdown */
  --fardo-select-icon-color:  var(--fardo-gray-500);
  --fardo-option-bg-hover:    var(--fardo-gray-50);
  --fardo-option-bg-active:   var(--fardo-orange-50);
  --fardo-option-text-active: var(--fardo-orange-600);
  --fardo-dropdown-shadow:    var(--fardo-shadow-md);
  --fardo-dropdown-radius:    var(--fardo-radius-md);
}
```
