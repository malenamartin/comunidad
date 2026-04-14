'use client';

import { useEffect, useMemo, useState } from 'react';

interface AdminPost {
  id: number;
  content?: string;
  title?: string;
  body?: string;
  created_at: string;
  is_pinned: boolean;
  is_published?: boolean;
  author_name: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  useEffect(() => {
    fetch('/api/admin/posts')
      .then((r) => r.json())
      .then((d) => {
        setPosts(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar los posts');
        setLoading(false);
      });
  }, []);

  async function togglePin(postId: number, pinned: boolean) {
    await fetch('/api/admin/posts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, pinned }),
    });
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, is_pinned: pinned } : p)));
  }

  async function remove(postId: number) {
    const ok = window.confirm('¿Eliminar este post? Esta acción no se puede deshacer.');
    if (!ok) return;

    await fetch('/api/admin/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (showPinnedOnly && !post.is_pinned) return false;
      if (!q) return true;
      return [post.title ?? '', post.content ?? '', post.body ?? '', post.author_name ?? ''].some((v) =>
        v.toLowerCase().includes(q),
      );
    });
  }, [posts, query, showPinnedOnly]);

  const pinnedCount = posts.filter((p) => p.is_pinned).length;

  if (loading) {
    return <div style={{ padding: '48px', color: 'var(--fardo-color-text-muted)' }}>Cargando posts...</div>;
  }

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '32px 24px' }}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>MODERACION</p>
        <h1 style={{ fontSize: '22px', color: 'var(--fardo-color-text-primary)', marginBottom: '6px' }}>
          Moderación de posts
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--fardo-color-text-secondary)', marginBottom: '14px', lineHeight: 1.6 }}>
          {posts.length} posts totales · {pinnedCount} fijados. Fijá lo que aporta señal; el resto, afuera del foco.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por autor, título o contenido"
            style={inputStyle}
          />
          <button onClick={() => setShowPinnedOnly((v) => !v)} style={ghostBtn}>
            {showPinnedOnly ? 'Ver todos' : 'Solo fijados'}
          </button>
        </div>
      </section>

      {error && <p style={{ color: 'var(--fardo-red-600)', margin: '12px 0' }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
        {filtered.map((post) => (
          <article key={post.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', marginBottom: '9px' }}>
              <div>
                <p style={{ fontSize: '14px', color: 'var(--fardo-color-text-primary)', fontWeight: 600, marginBottom: '2px' }}>
                  {post.title ?? post.content ?? 'Post sin título'}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-secondary)' }}>
                  {post.author_name} · {new Date(post.created_at).toLocaleDateString('es-AR')}
                </p>
              </div>
              {post.is_pinned && (
                <span style={{ fontSize: '11px', color: 'var(--fardo-amber-600)', fontWeight: 700 }}>
                  FIJADO
                </span>
              )}
            </div>

            <p style={{ fontSize: '13px', color: 'var(--fardo-color-text-secondary)', marginBottom: '10px', lineHeight: 1.55 }}>
              {(post.body ?? post.content ?? '').slice(0, 210) || 'Sin contenido'}
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => togglePin(post.id, !post.is_pinned)} style={ghostBtn}>
                {post.is_pinned ? 'Quitar fijado' : 'Fijar'}
              </button>
              <button onClick={() => remove(post.id)} style={dangerBtn}>
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
