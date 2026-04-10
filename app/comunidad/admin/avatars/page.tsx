'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Preset = {
  id: string;
  image_url: string;
  label: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export default function AdminAvatarsPage() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [label, setLabel] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/preset-avatars');
      if (r.ok) {
        const data = await r.json();
        setPresets(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function addPreset(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    setSaving(true);
    try {
      const r = await fetch('/api/admin/preset-avatars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl.trim(), label: label.trim() || null }),
      });
      if (r.ok) {
        setImageUrl('');
        setLabel('');
        await load();
      }
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: string, is_active: boolean) {
    const r = await fetch('/api/admin/preset-avatars', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active }),
    });
    if (r.ok) await load();
  }

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
        Cargando…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/comunidad/admin"
          style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}
        >
          ← Panel admin
        </Link>
      </div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
        Avatares de comunidad
      </h1>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>
        Pegá la URL pública HTTPS de la imagen (por ejemplo subida a Cloudinary o almacenamiento propio).
        Los miembros pueden elegir estos avatares en Mi perfil.
      </p>

      <form
        onSubmit={addPreset}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '32px',
          padding: '20px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '6px' }}>
            URL de imagen (HTTPS)
          </label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(0,0,0,0.3)',
              color: '#fff',
              fontSize: '14px',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '6px' }}>
            Etiqueta (opcional)
          </label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Ej. Naranja, Equipo A"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(0,0,0,0.3)',
              color: '#fff',
              fontSize: '14px',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          style={{
            alignSelf: 'flex-start',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #FF6A00, #E05A00)',
            color: '#fff',
            fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Guardando…' : 'Añadir preset'}
        </button>
      </form>

      <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
        Presets ({presets.length})
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
        {presets.map((pr) => (
          <div
            key={pr.id}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '12px',
              opacity: pr.is_active ? 1 : 0.45,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pr.image_url}
              alt=""
              style={{
                width: '100%',
                aspectRatio: '1',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '8px',
              }}
            />
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
              {pr.label || 'Sin etiqueta'}
            </p>
            <button
              type="button"
              onClick={() => toggleActive(pr.id, !pr.is_active)}
              style={{
                width: '100%',
                fontSize: '11px',
                padding: '6px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'transparent',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              {pr.is_active ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
