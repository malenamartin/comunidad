'use client';

import { useEffect, useState } from 'react';

interface AdminBeta {
  id: number;
  name: string;
  description: string | null;
  status: string;
  max_testers: number | null;
  current_count: number;
  launch_date: string | null;
  order_index: number;
}

const initialForm = {
  name: '',
  description: '',
  status: 'soon',
  max_testers: '',
  current_count: '',
  launch_date: '',
  order_index: '0',
};

export default function AdminBetasPage() {
  const [betas, setBetas] = useState<AdminBeta[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/admin/betas').then((r) => r.json()).then((d) => setBetas(Array.isArray(d) ? d : []));
  }, []);

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      ...form,
      betaId: editingId ?? undefined,
      max_testers: form.max_testers ? Number(form.max_testers) : null,
      current_count: form.current_count ? Number(form.current_count) : 0,
      order_index: Number(form.order_index || 0),
      launch_date: form.launch_date || null,
    };

    const res = await fetch('/api/admin/betas', {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const saved = await res.json();

    if (editingId) setBetas((prev) => prev.map((b) => (b.id === editingId ? saved : b)));
    else setBetas((prev) => [saved, ...prev]);

    resetForm();
  }

  function edit(beta: AdminBeta) {
    setEditingId(beta.id);
    setForm({
      name: beta.name,
      description: beta.description ?? '',
      status: beta.status,
      max_testers: beta.max_testers ? String(beta.max_testers) : '',
      current_count: String(beta.current_count ?? 0),
      launch_date: beta.launch_date ? beta.launch_date.slice(0, 10) : '',
      order_index: String(beta.order_index ?? 0),
    });
  }

  async function remove(betaId: number) {
    if (!window.confirm('¿Eliminar esta beta?')) return;

    await fetch('/api/admin/betas', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ betaId }),
    });
    setBetas((prev) => prev.filter((b) => b.id !== betaId));
  }

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '32px 24px' }}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>PRODUCTO</p>
        <h1 style={{ fontSize: '22px', color: 'var(--fardo-color-text-primary)', marginBottom: '6px' }}>
          Gestión de betas
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--fardo-color-text-secondary)', marginBottom: '14px', lineHeight: 1.6 }}>
          Activá betas con criterio y mostrales a los miembros estado, cupos y fecha real de lanzamiento.
        </p>

        <form onSubmit={submit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <input value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Nombre de beta" required style={inputStyle} />
            <select value={form.status} onChange={(e) => setField('status', e.target.value)} style={inputStyle}>
              <option value="open">open</option>
              <option value="waitlist">waitlist</option>
              <option value="soon">soon</option>
              <option value="closed">closed</option>
            </select>
            <input value={form.order_index} onChange={(e) => setField('order_index', e.target.value)} placeholder="Orden" style={inputStyle} />
          </div>

          <textarea value={form.description} onChange={(e) => setField('description', e.target.value)} placeholder="Descripción" rows={2} style={{ ...inputStyle, marginBottom: '8px' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <input value={form.max_testers} onChange={(e) => setField('max_testers', e.target.value)} placeholder="Cupos máximos" style={inputStyle} />
            <input value={form.current_count} onChange={(e) => setField('current_count', e.target.value)} placeholder="Cupos tomados" style={inputStyle} />
            <input type="date" value={form.launch_date} onChange={(e) => setField('launch_date', e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={primaryBtn}>{editingId ? 'Guardar beta' : 'Crear beta'}</button>
            {editingId && (
              <button type="button" onClick={resetForm} style={ghostBtn}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
        {betas.map((beta) => (
          <article key={beta.id} style={cardStyle}>
            <p style={{ fontSize: '14px', color: 'var(--fardo-color-text-primary)', fontWeight: 600, marginBottom: '3px' }}>{beta.name}</p>
            <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-secondary)', marginBottom: '8px' }}>
              {beta.status} · {beta.current_count}/{beta.max_testers ?? '∞'} testers
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => edit(beta)} style={ghostBtn}>Editar</button>
              <button onClick={() => remove(beta.id)} style={dangerBtn}>Eliminar</button>
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
  width: '100%',
  background: 'var(--fardo-color-bg-subtle)',
  border: '1px solid var(--fardo-color-border-default)',
  color: 'var(--fardo-color-text-primary)',
  borderRadius: '8px',
  padding: '9px 10px',
  fontSize: '13px',
};

const primaryBtn: React.CSSProperties = {
  fontSize: '12px',
  borderRadius: '8px',
  border: '1px solid var(--fardo-orange-400)',
  padding: '8px 12px',
  background: 'var(--fardo-orange-400)',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 600,
};

const ghostBtn: React.CSSProperties = {
  fontSize: '12px',
  borderRadius: '8px',
  border: '1px solid var(--fardo-color-border-default)',
  padding: '8px 12px',
  background: 'transparent',
  color: 'var(--fardo-color-text-secondary)',
  cursor: 'pointer',
};

const dangerBtn: React.CSSProperties = {
  fontSize: '12px',
  borderRadius: '8px',
  border: '1px solid rgba(185,54,54,0.35)',
  padding: '8px 12px',
  background: 'var(--fardo-red-50)',
  color: 'var(--fardo-red-600)',
  cursor: 'pointer',
};
