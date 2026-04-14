'use client';

import { useState } from 'react';
import type { Beta } from '@/lib/community/betas';

const STATUS_CONFIG = {
  open: { label: 'ABIERTA', color: 'var(--fardo-green-600)', bg: 'var(--fardo-green-50)', btnLabel: 'Quiero entrar' },
  waitlist: { label: 'WAITLIST', color: 'var(--fardo-amber-600)', bg: 'var(--fardo-amber-50)', btnLabel: 'Sumarme a waitlist' },
  soon: { label: 'PRÓXIMAMENTE', color: 'var(--fardo-color-text-muted)', bg: 'var(--fardo-color-bg-subtle)', btnLabel: null },
  closed: { label: 'CERRADO', color: 'var(--fardo-color-text-muted)', bg: 'var(--fardo-color-bg-subtle)', btnLabel: null },
};

interface BetaCardProps {
  beta: Beta;
  onRequest: (betaId: string) => Promise<void>;
}

export function BetaCard({ beta, onRequest }: BetaCardProps) {
  const config = STATUS_CONFIG[beta.status] ?? STATUS_CONFIG.soon;
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(!!beta.user_access_status);
  const [accessStatus, setAccessStatus] = useState(beta.user_access_status ?? null);

  async function handleRequest() {
    setLoading(true);
    try {
      await onRequest(beta.id);
      setRequested(true);
      setAccessStatus(beta.status === 'open' ? 'approved' : 'waitlist');
    } finally {
      setLoading(false);
    }
  }

  return (
    <article
      style={{
        background: 'var(--fardo-color-bg-base)',
        border: '1px solid var(--fardo-color-border-default)',
        borderRadius: '18px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--fardo-color-text-primary)', marginBottom: '4px' }}>
            {beta.name}
          </h3>
          {beta.description && (
            <p style={{ fontSize: '13px', color: 'var(--fardo-color-text-secondary)', lineHeight: 1.5 }}>
              {beta.description}
            </p>
          )}
        </div>
        <span
          style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em',
            color: config.color, background: config.bg,
            border: '1px solid var(--fardo-color-border-default)',
            borderRadius: '999px', padding: '3px 9px', flexShrink: 0,
          }}
        >
          {config.label}
        </span>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        {beta.max_testers && (
          <span style={{ fontSize: '12px', color: 'var(--fardo-color-text-muted)' }}>
            {beta.current_count}/{beta.max_testers} testers
          </span>
        )}
        {requested ? (
          <span
            style={{
              fontSize: '12px', fontWeight: 500,
              color: accessStatus === 'approved' ? '#90C050' : '#C8A040',
              marginLeft: 'auto',
            }}
          >
            {accessStatus === 'approved' ? 'Listo, ya tenés acceso' : 'Quedaste en waitlist'}
          </span>
        ) : config.btnLabel ? (
          <button
            onClick={handleRequest}
            disabled={loading}
            style={{
              marginLeft: 'auto',
              padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--fardo-orange-400)',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '13px', fontWeight: 600, color: '#FFFFFF',
              background: loading ? 'var(--fardo-color-bg-subtle)' : 'var(--fardo-orange-400)',
            }}
          >
            {loading ? '...' : config.btnLabel}
          </button>
        ) : (
          <span style={{ fontSize: '12px', color: 'var(--fardo-color-text-muted)', marginLeft: 'auto' }}>
            No disponible por ahora
          </span>
        )}
      </div>
    </article>
  );
}
