'use client';

import { useState, useEffect } from 'react';

export default function AdminInviteCodesPage() {
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: '', maxUses: '1', expiresAt: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch('/api/admin/invite-codes').then(r => r.json()).then(d => { setCodes(d); setLoading(false); });
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch('/api/admin/invite-codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: form.code.toUpperCase(), maxUses: Number(form.maxUses), expiresAt: form.expiresAt || null }),
    });
    const created = await res.json();
    setCodes(c => [created, ...c]);
    setForm({ code: '', maxUses: '1', expiresAt: '' });
    setCreating(false);
  }

  async function toggle(id: number, active: boolean) {
    await fetch('/api/admin/invite-codes', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codeId: id, active: !active }) });
    setCodes(cs => cs.map(c => c.id === id ? { ...c, is_active: !active } : c));
  }

  const inputStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', width: '100%' };

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: '#fff', opacity: 0.4 }}>Cargando...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>Códigos de invitación</h1>

      <form onSubmit={create} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '160px' }}>
          <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '6px' }}>Código</label>
          <input style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '0.08em' }} placeholder="FARDO-CMO-ARG-001" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} required />
        </div>
        <div style={{ flex: 1, minWidth: '80px' }}>
          <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '6px' }}>Usos máx.</label>
          <input style={inputStyle} type="number" min="1" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} />
        </div>
        <div style={{ flex: 2, minWidth: '140px' }}>
          <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '6px' }}>Expira (opcional)</label>
          <input style={inputStyle} type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
        </div>
        <button disabled={creating} type="submit" style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#D44A30,#C27A28)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}>
          {creating ? '...' : 'Crear código'}
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {codes.map((c) => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '14px 18px' }}>
            <code style={{ flex: 1, fontSize: '13px', color: '#fff', letterSpacing: '0.06em' }}>{c.code}</code>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{c.used_count}/{c.max_uses} usos</span>
            {c.expires_at && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>exp. {new Date(c.expires_at).toLocaleDateString('es-AR')}</span>}
            <span style={{ fontSize: '11px', background: c.is_active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: c.is_active ? '#4ADE80' : '#F87171', borderRadius: '100px', padding: '3px 10px' }}>
              {c.is_active ? 'Activo' : 'Inactivo'}
            </span>
            <button onClick={() => toggle(c.id, c.is_active)} style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>
              {c.is_active ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
