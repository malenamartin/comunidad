'use client';

import { useState, useEffect } from 'react';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/requests').then(r => r.json()).then(d => { setRequests(d); setLoading(false); });
  }, []);

  async function resolve(id: number, action: 'approve' | 'reject') {
    await fetch('/api/admin/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestId: id, action }) });
    setRequests(rs => rs.filter(r => r.id !== id));
  }

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: '#fff', opacity: 0.4 }}>Cargando...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>Solicitudes pendientes ({requests.length})</h1>
      {requests.length === 0
        ? <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '48px' }}>No hay solicitudes pendientes.</p>
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.map((r) => (
              <div key={r.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{r.name}</p>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{r.email} · {r.company} · {r.job_title}</p>
                    {r.linkedin_url && <a href={r.linkedin_url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#60A5FA' }}>{r.linkedin_url}</a>}
                  </div>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{new Date(r.created_at).toLocaleDateString('es-AR')}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => resolve(r.id, 'approve')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#FF6A00,#E05A00)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                    Aprobar
                  </button>
                  <button onClick={() => resolve(r.id, 'reject')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '13px' }}>
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
