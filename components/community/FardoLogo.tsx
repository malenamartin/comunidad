interface Props {
  /** 'gray' = #D9D9D9 (oficial), 'dark' = negro, 'light' = blanco */
  variant?: 'gray' | 'dark' | 'light';
  height?: number;
  className?: string;
}

const FILTERS: Record<string, string> = {
  // Negro puro
  dark:  'brightness(0)',
  // Blanco puro
  light: 'brightness(0) invert(1)',
  // Gris #D9D9D9 — el SVG ya trae ese color como default (currentColor = negro),
  // lo llevamos a gris multiplicando la luminancia
  gray:  'brightness(0) opacity(0.15)',
};

export function FardoLogo({ variant = 'gray', height = 40, className }: Props) {
  // viewBox: 1068 × 324  →  aspect ratio ≈ 3.296
  const width = Math.round(height * (1068 / 324));

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/fardo-logo.svg"
      alt="fardo"
      width={width}
      height={height}
      className={className}
      style={{
        display: 'block',
        filter: FILTERS[variant] ?? FILTERS.gray,
        userSelect: 'none',
      }}
    />
  );
}
