'use client';

export default function ComunidadError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '32px',
        textAlign: 'center',
      }}
    >
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', maxWidth: '600px', wordBreak: 'break-word' }}>
        {error.message}
      </p>
      <button
        onClick={reset}
        style={{
          padding: '10px 24px',
          borderRadius: '8px',
          border: 'none',
          background: 'linear-gradient(135deg, #D44A30, #C27A28)',
          color: '#fff',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Reintentar
      </button>
      <a href="/comunidad" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
        Volver al inicio
      </a>
    </div>
  );
}
