'use client';

import { useEffect, useState } from 'react';

interface AdminVideo {
  id: number;
  title: string;
  description: string | null;
  category: string;
  level: string;
  duration_min: number | null;
  vimeo_id: string | null;
  thumbnail_url: string | null;
  order_index: number;
  is_published: boolean;
}

const emptyForm = {
  title: '',
  description: '',
  category: 'aeo',
  level: 'intro',
  duration_min: '',
  vimeo_id: '',
  thumbnail_url: '',
  order_index: '0',
  is_published: true,
};

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetch('/api/admin/videos')
      .then((r) => r.json())
      .then((d) => {
        setVideos(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, []);

  function onChange<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      ...form,
      duration_min: form.duration_min ? Number(form.duration_min) : null,
      order_index: Number(form.order_index || 0),
      videoId: editingId ?? undefined,
    };

    const res = await fetch('/api/admin/videos', {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const saved = await res.json();

    if (editingId) setVideos((prev) => prev.map((v) => (v.id === editingId ? saved : v)));
    else setVideos((prev) => [saved, ...prev]);

    resetForm();
  }

  async function remove(videoId: number) {
    if (!window.confirm('¿Eliminar este video?')) return;

    await fetch('/api/admin/videos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId }),
    });
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
  }

  function startEdit(video: AdminVideo) {
    setEditingId(video.id);
    setForm({
      title: video.title,
      description: video.description ?? '',
      category: video.category,
      level: video.level,
      duration_min: video.duration_min ? String(video.duration_min) : '',
      vimeo_id: video.vimeo_id ?? '',
      thumbnail_url: video.thumbnail_url ?? '',
      order_index: String(video.order_index),
      is_published: video.is_published,
    });
  }

  if (loading) {
    return <div style={{ padding: '40px', color: 'var(--fardo-color-text-muted)' }}>Cargando videos...</div>;
  }

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '32px 24px' }}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>ACADEMIA</p>
        <h1 style={{ fontSize: '22px', color: 'var(--fardo-color-text-primary)', marginBottom: '6px' }}>
          Gestión de videos
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--fardo-color-text-secondary)', marginBottom: '14px', lineHeight: 1.6 }}>
          Publicá contenido accionable y mantenelo ordenado por categoría, nivel e impacto.
        </p>

        <form onSubmit={submit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <input value={form.title} onChange={(e) => onChange('title', e.target.value)} placeholder="Título" required style={inputStyle} />
            <select value={form.category} onChange={(e) => onChange('category', e.target.value)} style={inputStyle}>
              <option value="aeo">AEO</option>
              <option value="geo">GEO</option>
              <option value="llmo">LLMO</option>
              <option value="estrategia">Estrategia</option>
            </select>
            <select value={form.level} onChange={(e) => onChange('level', e.target.value)} style={inputStyle}>
              <option value="intro">Intro</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>

          <textarea
            value={form.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Descripción"
            rows={3}
            style={{ ...inputStyle, marginBottom: '10px' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.8fr 0.8fr auto', gap: '10px', marginBottom: '10px' }}>
            <input value={form.vimeo_id} onChange={(e) => onChange('vimeo_id', e.target.value)} placeholder="Vimeo ID" style={inputStyle} />
            <input value={form.duration_min} onChange={(e) => onChange('duration_min', e.target.value)} placeholder="Duración (min)" style={inputStyle} />
            <input value={form.order_index} onChange={(e) => onChange('order_index', e.target.value)} placeholder="Orden" style={inputStyle} />
            <label style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <input type="checkbox" checked={form.is_published} onChange={(e) => onChange('is_published', e.target.checked)} />
              Publicado
            </label>
          </div>

          <input
            value={form.thumbnail_url}
            onChange={(e) => onChange('thumbnail_url', e.target.value)}
            placeholder="URL thumbnail"
            style={{ ...inputStyle, marginBottom: '10px' }}
          />

          <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={primaryBtn}>{editingId ? 'Guardar cambios' : 'Crear video'}</button>
              {editingId && (
                <button type="button" onClick={resetForm} style={ghostBtn}>
                  Cancelar edición
                </button>
              )}
          </div>
        </form>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
        {videos.map((video) => (
          <article key={video.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
              <div>
                <p style={{ color: 'var(--fardo-color-text-primary)', fontSize: '14px', fontWeight: 600 }}>{video.title}</p>
                <p style={{ color: 'var(--fardo-color-text-secondary)', fontSize: '12px' }}>
                  {video.category} · {video.level} · orden {video.order_index}
                </p>
              </div>
              <span style={{ fontSize: '11px', color: video.is_published ? 'var(--fardo-green-600)' : 'var(--fardo-amber-600)', fontWeight: 700 }}>
                {video.is_published ? 'PUBLICADO' : 'BORRADOR'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => startEdit(video)} style={ghostBtn}>Editar</button>
              <button
                type="button"
                onClick={async () => {
                  const res = await fetch('/api/admin/videos', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ videoId: video.id, is_published: !video.is_published }),
                  });
                  const updated = await res.json();
                  setVideos((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
                }}
                style={ghostBtn}
              >
                {video.is_published ? 'Despublicar' : 'Publicar'}
              </button>
              <button type="button" onClick={() => remove(video.id)} style={dangerBtn}>Eliminar</button>
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
