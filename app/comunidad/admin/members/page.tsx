'use client';

import { useEffect, useMemo, useState } from 'react';

type Member = {
  id: number;
  name: string;
  email: string;
  company: string | null;
  job_title: string | null;
  total_points: number;
  status: 'active' | 'suspended';
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  useEffect(() => {
    fetch('/api/admin/members')
      .then((r) => r.json())
      .then((d) => {
        setMembers(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, []);

  async function toggleStatus(id: number, current: string) {
    const status = current === 'active' ? 'suspended' : 'active';
    await fetch('/api/admin/members', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId: id, status }),
    });
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  }

  async function removeMember(id: number) {
    const ok = window.confirm('¿Eliminar este miembro? También se borra su contenido asociado.');
    if (!ok) return;

    await fetch('/api/admin/members', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId: id }),
    });
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      const matchStatus = statusFilter === 'all' ? true : m.status === statusFilter;
      if (!matchStatus) return false;
      if (!q) return true;
      return [m.name, m.email, m.company ?? '', m.job_title ?? ''].some((v) =>
        v.toLowerCase().includes(q),
      );
    });
  }, [members, query, statusFilter]);

  const activeCount = members.filter((m) => m.status === 'active').length;

  if (loading) {
    return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--fardo-color-text-muted)' }}>Cargando miembros...</div>;
  }

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '32px 24px' }}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>MIEMBROS</p>
        <h1 style={{ fontSize: '22px', color: 'var(--fardo-color-text-primary)', marginBottom: '6px' }}>
          Gestión de miembros
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--fardo-color-text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
          Estado actual: {activeCount} activos de {members.length}. Si no suma a la conversación, se corrige.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '8px' }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, empresa, email o cargo"
            style={inputStyle}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'suspended')}
            style={inputStyle}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="suspended">Suspendidos</option>
          </select>
        </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
        {filtered.map((m) => (
          <article key={m.id} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--fardo-color-text-primary)', marginBottom: '3px' }}>
                  {m.name}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-secondary)' }}>
                  {m.email} · {m.company ?? 'Sin empresa'} · {m.job_title ?? 'Sin cargo'}
                </p>
              </div>

              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fardo-color-text-secondary)' }}>
                {Number(m.total_points).toLocaleString('es-AR')} pts
              </span>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  borderRadius: '999px',
                  padding: '4px 10px',
                  border: m.status === 'active'
                    ? '1px solid rgba(39,106,67,0.24)'
                    : '1px solid rgba(185,54,54,0.24)',
                  background: m.status === 'active' ? 'var(--fardo-green-50)' : 'var(--fardo-red-50)',
                  color: m.status === 'active' ? 'var(--fardo-green-600)' : 'var(--fardo-red-600)',
                }}
              >
                {m.status === 'active' ? 'Activo' : 'Suspendido'}
              </span>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => toggleStatus(m.id, m.status)} style={ghostBtn}>
                  {m.status === 'active' ? 'Suspender' : 'Reactivar'}
                </button>
                <button onClick={() => removeMember(m.id)} style={dangerBtn}>
                  Eliminar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: 'var(--fardo-color-bg-base)',
  border: '1px solid var(--fardo-color-border-default)',
  borderRadius: '12px',
  padding: '14px 16px',
};

const eyebrowStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: 'var(--fardo-orange-500)',
  marginBottom: '8px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--fardo-color-bg-subtle)',
  border: '1px solid var(--fardo-color-border-default)',
  color: 'var(--fardo-color-text-primary)',
  borderRadius: '8px',
  padding: '9px 10px',
  fontSize: '13px',
};

const ghostBtn: React.CSSProperties = {
  fontSize: '12px',
  borderRadius: '8px',
  border: '1px solid var(--fardo-color-border-default)',
  padding: '8px 10px',
  background: 'transparent',
  color: 'var(--fardo-color-text-secondary)',
  cursor: 'pointer',
};

const dangerBtn: React.CSSProperties = {
  fontSize: '12px',
  borderRadius: '8px',
  border: '1px solid rgba(185,54,54,0.35)',
  padding: '8px 10px',
  background: 'var(--fardo-red-50)',
  color: 'var(--fardo-red-600)',
  cursor: 'pointer',
};
