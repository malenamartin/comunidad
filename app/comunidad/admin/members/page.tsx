'use client';

import { useState, useEffect } from 'react';

export default function AdminMembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/members').then(r => r.json()).then(d => { setMembers(d); setLoading(false); });
  }, []);

  async function toggleStatus(id: number, current: string) {
    const status = current === 'active' ? 'suspended' : 'active';
    await fetch('/api/admin/members', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ memberId: id, status }) });
    setMembers(ms => ms.map(m => m.id === id ? { ...m, status } : m));
  }

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: '#fff', opacity: 0.4 }}>Cargando...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>Miembros ({members.length})</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {members.map((m) => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '14px 18px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{m.name}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{m.email} · {m.company} · {m.job_title}</p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{Number(m.total_points).toLocaleString()} pts</span>
            <span style={{ fontSize: '11px', background: m.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: m.status === 'active' ? '#4ADE80' : '#F87171', borderRadius: '100px', padding: '3px 10px' }}>{m.status}</span>
            <button onClick={() => toggleStatus(m.id, m.status)} style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>
              {m.status === 'active' ? 'Suspender' : 'Activar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
