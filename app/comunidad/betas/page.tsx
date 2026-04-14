'use client';

import useSWR from 'swr';
import { BetaCard } from '@/components/community/BetaCard';
import type { Beta } from '@/lib/community/betas';
import { mockBetas } from '@/lib/community/mockData';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function BetasPage() {
  const { data: betas, isLoading, mutate } = useSWR<Beta[]>('/api/community/betas', fetcher);
  const displayBetas = betas?.length ? betas : mockBetas;
  const openCount = displayBetas.filter((b) => b.status === 'open').length;
  const waitlistCount = displayBetas.filter((b) => b.status === 'waitlist').length;

  async function handleRequest(betaId: string) {
    await fetch(`/api/community/betas/${betaId}/request`, { method: 'POST' });
    mutate();
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 24px' }}>
      <section
        style={{
          background: 'var(--fardo-color-bg-base)',
          border: '1px solid var(--fardo-color-border-default)',
          borderRadius: '20px',
          padding: '18px',
          marginBottom: '14px',
        }}
      >
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--fardo-orange-500)', marginBottom: '8px' }}>
          BETAS DE PRODUCTO
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fardo-color-text-primary)', marginBottom: '4px' }}>
          Early access para cómplices FARDO
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--fardo-color-text-secondary)', lineHeight: 1.6 }}>
          Probá features antes del lanzamiento y meté feedback que impacta directo en roadmap.
        </p>
      </section>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '10px',
          marginBottom: '14px',
        }}
      >
        <div style={statCardStyle}>
          <p style={statLabelStyle}>Betas abiertas</p>
          <p style={statValueStyle}>{openCount}</p>
        </div>
        <div style={statCardStyle}>
          <p style={statLabelStyle}>En waitlist</p>
          <p style={statValueStyle}>{waitlistCount}</p>
        </div>
        <div style={statCardStyle}>
          <p style={statLabelStyle}>Total visibles</p>
          <p style={statValueStyle}>{displayBetas.length}</p>
        </div>
      </div>

      {!betas?.length && !isLoading && (
        <div style={{ fontSize: '12px', color: 'var(--fardo-orange-500)', marginBottom: '10px', fontWeight: 600 }}>
          Mostrando datos demo para visualizar la experiencia de betas.
        </div>
      )}

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ height: '120px', background: 'var(--fardo-color-bg-base)', border: '1px solid var(--fardo-color-border-default)', borderRadius: '18px' }} />
          ))}
        </div>
      ) : !displayBetas?.length ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--fardo-color-text-muted)' }}>
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</p>
          <p style={{ fontSize: '15px' }}>No hay betas abiertas ahora. Apenas salga una, la vas a ver acá.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {displayBetas.map((beta) => (
            <BetaCard key={beta.id} beta={beta} onRequest={handleRequest} />
          ))}
        </div>
      )}
    </div>
  );
}

const statCardStyle: React.CSSProperties = {
  background: 'var(--fardo-color-bg-base)',
  border: '1px solid var(--fardo-color-border-default)',
  borderRadius: '16px',
  padding: '12px',
};

const statLabelStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--fardo-color-text-muted)',
  marginBottom: '6px',
};

const statValueStyle: React.CSSProperties = {
  fontSize: '24px',
  color: 'var(--fardo-color-text-primary)',
  fontWeight: 700,
  lineHeight: 1,
};
