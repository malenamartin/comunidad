'use client';

import { useState } from 'react';
import type { Beta } from '@/lib/community/betas';

const STATUS_CONFIG = {
  open:     { label: 'ABIERTO',        color: '#90C050', bg: 'rgba(120,180,60,0.15)',  btnLabel: 'Solicitar acceso' },
  waitlist: { label: 'LISTA DE ESPERA', color: '#C8A040', bg: 'rgba(180,130,40,0.15)', btnLabel: 'Anotarme en lista' },
  soon:     { label: 'PRÓXIMAMENTE',   color: 'rgba(255,255,255,0.35)', bg: 'rgba(255,255,255,0.06)', btnLabel: null },
  closed:   { label: 'CERRADO',        color: 'rgba(255,255,255,0.25)', bg: 'rgba(255,255,255,0.04)', btnLabel: null },
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
        background: 'rgba(255,255,255,0.03)',
        border: '0.5px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
            {beta.name}
          </h3>
          {beta.description && (
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
              {beta.description}
            </p>
          )}
        </div>
        <span
          style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em',
            color: config.color, background: config.bg,
            borderRadius: '4px', padding: '3px 8px', flexShrink: 0,
          }}
        >
          {config.label}
        </span>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        {beta.max_testers && (
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
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
            {accessStatus === 'approved' ? '✓ Acceso aprobado' : '⏳ En lista de espera'}
          </span>
        ) : config.btnLabel ? (
          <button
            onClick={handleRequest}
            disabled={loading}
            style={{
              marginLeft: 'auto',
              padding: '7px 16px', borderRadius: '8px', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '13px', fontWeight: 600, color: '#FFFFFF',
              background: loading ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #FF6A00, #E05A00)',
            }}
          >
            {loading ? '...' : config.btnLabel}
          </button>
        ) : (
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginLeft: 'auto' }}>
            No disponible
          </span>
        )}
      </div>
    </article>
  );
}
