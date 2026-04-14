'use client';

import { useEffect, useMemo, useState } from 'react';

type RequestItem = {
  id: number;
  name: string;
  email: string;
  company: string | null;
  job_title: string | null;
  linkedin_url: string | null;
  created_at: string;
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/api/admin/requests')
      .then((r) => r.json())
      .then((d) => {
        setRequests(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, []);

  async function resolve(id: number, action: 'approve' | 'reject') {
    await fetch('/api/admin/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: id, action }),
    });
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter((r) =>
      [r.name, r.email, r.company ?? '', r.job_title ?? ''].some((v) => v.toLowerCase().includes(q)),
    );
  }, [requests, query]);

  if (loading) {
    return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--fardo-color-text-muted)' }}>Cargando solicitudes...</div>;
  }

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '32px 24px' }}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>ACCESO</p>
        <h1 style={{ fontSize: '22px', color: 'var(--fardo-color-text-primary)', marginBottom: '6px' }}>
          Ingresos pendientes ({requests.length})
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--fardo-color-text-secondary)', marginBottom: '12px', lineHeight: 1.6 }}>
          Revisá fit de rol y empresa. Cada aprobación define la calidad de la comunidad.
        </p>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, email, empresa o cargo"
          style={{ ...inputStyle, width: '100%' }}
        />
      </section>

      {filtered.length === 0 ? (
        <div style={{ ...cardStyle, marginTop: '12px', textAlign: 'center', color: 'var(--fardo-color-text-muted)' }}>
          No hay solicitudes pendientes con ese filtro.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
          {filtered.map((r) => (
            <article key={r.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--fardo-color-text-primary)', marginBottom: '2px' }}>
                    {r.name}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--fardo-color-text-secondary)', marginBottom: '4px' }}>
                    {r.email} · {r.company ?? 'Sin empresa'} · {r.job_title ?? 'Sin cargo'}
                  </p>
                  {r.linkedin_url && (
                    <a href={r.linkedin_url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--fardo-blue-500)' }}>
                      Perfil de LinkedIn
                    </a>
                  )}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--fardo-color-text-muted)' }}>
                  {new Date(r.created_at).toLocaleDateString('es-AR')}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button onClick={() => resolve(r.id, 'approve')} style={primaryBtn}>
                  Aprobar ingreso
                </button>
                <button onClick={() => resolve(r.id, 'reject')} style={ghostBtn}>
                  Rechazar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: 'var(--fardo-color-bg-base)',
  border: '1px solid var(--fardo-color-border-default)',
  borderRadius: '12px',
  padding: '16px',
};

const eyebrowStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: 'var(--fardo-orange-500)',
  marginBottom: '8px',
};

const inputStyle: React.CSSProperties = {
  background: 'var(--fardo-color-bg-subtle)',
  border: '1px solid var(--fardo-color-border-default)',
  color: 'var(--fardo-color-text-primary)',
  borderRadius: '8px',
  padding: '9px 10px',
  fontSize: '13px',
};

const primaryBtn: React.CSSProperties = {
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid var(--fardo-orange-400)',
  background: 'var(--fardo-orange-400)',
  color: '#fff',
  fontWeight: 600,
  fontSize: '13px',
  cursor: 'pointer',
};

const ghostBtn: React.CSSProperties = {
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid var(--fardo-color-border-default)',
  background: 'transparent',
  color: 'var(--fardo-color-text-secondary)',
  fontWeight: 600,
  fontSize: '13px',
  cursor: 'pointer',
};
