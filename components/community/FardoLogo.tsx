interface Props {
  /** Color of the wordmark. Defaults to the official gray. */
  color?: string;
  /** Height in px. Width scales proportionally. */
  height?: number;
  className?: string;
}

/**
 * Official Fardo wordmark — rounded bold sans-serif with ® mark.
 * Uses the CSS variable --font-nunito loaded in the root layout.
 */
export function FardoLogo({ color = '#CCCCCC', height = 40, className }: Props) {
  const fontSize = height * 0.85;
  const regSize = height * 0.28;
  const width = height * 3.6;

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        lineHeight: 1,
        gap: '2px',
      }}
    >
      <span
        style={{
          fontFamily: '"Nunito", "Arial Rounded MT Bold", "Helvetica Rounded", sans-serif',
          fontWeight: 900,
          fontSize: `${fontSize}px`,
          color,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        fardo
      </span>
      <span
        style={{
          fontFamily: 'serif',
          fontSize: `${regSize}px`,
          color,
          lineHeight: 1,
          verticalAlign: 'super',
          opacity: 0.75,
        }}
      >
        ®
      </span>
    </span>
  );
}
