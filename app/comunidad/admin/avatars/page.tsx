'use client';

import { useEffect, useState } from 'react';

interface AvatarPreset {
  id: number;
  name: string;
  image_url: string;
  order_index: number;
  is_active: boolean;
}

export default function AdminAvatarsPage() {
  const [avatars, setAvatars] = useState<AvatarPreset[]>([]);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState('0');

  useEffect(() => {
    fetch('/api/admin/avatars').then((r) => r.json()).then((d) => setAvatars(Array.isArray(d) ? d : []));
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('/api/admin/avatars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        image_url: imageUrl,
        order_index: Number(orderIndex || 0),
        is_active: true,
      }),
    });

    const created = await res.json();
    setAvatars((prev) => [created, ...prev]);
    setName('');
    setImageUrl('');
    setOrderIndex('0');
  }

  async function toggle(avatar: AvatarPreset) {
    const res = await fetch('/api/admin/avatars', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatarId: avatar.id, is_active: !avatar.is_active }),
    });

    const updated = await res.json();
    setAvatars((prev) => prev.map((item) => (item.id === avatar.id ? updated : item)));
  }

  async function remove(avatarId: number) {
    if (!window.confirm('¿Eliminar este avatar?')) return;

    await fetch('/api/admin/avatars', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatarId }),
    });
    setAvatars((prev) => prev.filter((item) => item.id !== avatarId));
  }

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '32px 24px' }}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>IDENTIDAD</p>
        <h1 style={{ fontSize: '22px', color: 'var(--fardo-color-text-primary)', marginBottom: '6px' }}>
          Gestión de avatares
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--fardo-color-text-secondary)', marginBottom: '14px', lineHeight: 1.6 }}>
          Cargá avatares oficiales para que el onboarding de nuevos miembros sea más rápido y consistente.
        </p>

        <form onSubmit={create} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 120px 150px', gap: '8px' }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" required style={inputStyle} />
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL de imagen" required style={inputStyle} />
          <input value={orderIndex} onChange={(e) => setOrderIndex(e.target.value)} placeholder="Orden" style={inputStyle} />
          <button type="submit" style={primaryBtn}>Agregar avatar</button>
        </form>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', marginTop: '12px' }}>
        {avatars.map((avatar) => (
          <article key={avatar.id} style={cardStyle}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar.image_url}
              alt={avatar.name}
              style={{ width: '64px', height: '64px', borderRadius: '999px', objectFit: 'cover', marginBottom: '8px' }}
            />
            <p style={{ color: 'var(--fardo-color-text-primary)', fontSize: '13px', fontWeight: 600 }}>{avatar.name}</p>
            <p style={{ color: 'var(--fardo-color-text-secondary)', fontSize: '11px', marginBottom: '8px' }}>orden {avatar.order_index}</p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => toggle(avatar)} style={ghostBtn}>
                {avatar.is_active ? 'Desactivar' : 'Activar'}
              </button>
              <button onClick={() => remove(avatar.id)} style={dangerBtn}>
                Eliminar
              </button>
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
  padding: '14px',
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
  fontSize: '11px',
  borderRadius: '8px',
  border: '1px solid var(--fardo-color-border-default)',
  padding: '7px 10px',
  background: 'transparent',
  color: 'var(--fardo-color-text-secondary)',
  cursor: 'pointer',
};

const dangerBtn: React.CSSProperties = {
  fontSize: '11px',
  borderRadius: '8px',
  border: '1px solid rgba(185,54,54,0.35)',
  padding: '7px 10px',
  background: 'var(--fardo-red-50)',
  color: 'var(--fardo-red-600)',
  cursor: 'pointer',
};
