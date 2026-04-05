'use client';

import useSWR from 'swr';
import { BetaCard } from '@/components/community/BetaCard';
import type { Beta } from '@/lib/community/betas';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function BetasPage() {
  const { data: betas, isLoading, mutate } = useSWR<Beta[]>('/api/community/betas', fetcher);

  async function handleRequest(betaId: string) {
    await fetch(`/api/community/betas/${betaId}/request`, { method: 'POST' });
    mutate();
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: '4px' }}>
          Betas
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
          Acceso anticipado a las nuevas features de Fardo
        </p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ height: '100px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '12px' }} />
          ))}
        </div>
      ) : !betas?.length ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'rgba(255,255,255,0.3)' }}>
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</p>
          <p style={{ fontSize: '15px' }}>No hay betas disponibles por ahora.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {betas.map((beta) => (
            <BetaCard key={beta.id} beta={beta} onRequest={handleRequest} />
          ))}
        </div>
      )}
    </div>
  );
}
