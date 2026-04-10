'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type AdminPost = {
  id: string;
  title: string;
  body: string;
  post_type: string;
  created_at: string;
  is_pinned: boolean;
  is_published: boolean;
  author_name: string;
  comment_count: number;
  reaction_count: number;
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const r = await fetch('/api/admin/posts');
      if (!r.ok) {
        setError('No autorizado o error al cargar');
        setPosts([]);
        return;
      }
      const data = await r.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function removePost(id: string) {
    if (!confirm('¿Eliminar este post permanentemente?')) return;
    const r = await fetch('/api/admin/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: id }),
    });
    if (r.ok) setPosts((p) => p.filter((x) => x.id !== id));
  }

  async function patchPost(id: string, body: { pinned?: boolean; published?: boolean }) {
    const r = await fetch('/api/admin/posts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: id, ...body }),
    });
    if (r.ok) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                ...(body.pinned !== undefined ? { is_pinned: body.pinned } : {}),
                ...(body.published !== undefined ? { is_published: body.published } : {}),
              }
            : p,
        ),
      );
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
        Cargando posts…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/comunidad/admin"
          style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}
        >
          ← Panel admin
        </Link>
      </div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
        Moderar posts
      </h1>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '28px' }}>
        Ocultar en el feed, fijar o eliminar contenido.
      </p>

      {error && (
        <p style={{ color: '#E07050', marginBottom: '16px', fontSize: '14px' }}>{error}</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {posts.map((p) => (
          <div
            key={p.id}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '16px 18px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
                  {p.is_pinned && <span style={{ color: '#FF6A00', marginRight: '6px' }}>📌</span>}
                  {!p.is_published && (
                    <span
                      style={{
                        fontSize: '10px',
                        background: 'rgba(239,68,68,0.2)',
                        color: '#F87171',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        marginRight: '8px',
                        verticalAlign: 'middle',
                      }}
                    >
                      OCULTO
                    </span>
                  )}
                  {p.title}
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>
                  {p.author_name} · {p.post_type} · {new Date(p.created_at).toLocaleString('es-AR')} · 💬{' '}
                  {p.comment_count} · ❤️ {p.reaction_count}
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.45)',
                    lineHeight: 1.5,
                    maxHeight: '4.5em',
                    overflow: 'hidden',
                  }}
                >
                  {p.body.slice(0, 220)}
                  {p.body.length > 220 ? '…' : ''}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                <Link
                  href={`/comunidad/${p.id}`}
                  style={{ fontSize: '12px', color: '#FF6A00', textDecoration: 'none' }}
                >
                  Ver →
                </Link>
                <button
                  type="button"
                  onClick={() => patchPost(p.id, { published: !p.is_published })}
                  style={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {p.is_published ? 'Ocultar del feed' : 'Publicar'}
                </button>
                <button
                  type="button"
                  onClick={() => patchPost(p.id, { pinned: !p.is_pinned })}
                  style={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {p.is_pinned ? 'Quitar fijado' : 'Fijar'}
                </button>
                <button
                  type="button"
                  onClick={() => removePost(p.id)}
                  style={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(239,68,68,0.4)',
                    background: 'rgba(239,68,68,0.08)',
                    color: '#F87171',
                    cursor: 'pointer',
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && !error && (
          <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '40px' }}>
            No hay posts.
          </p>
        )}
      </div>
    </div>
  );
}
