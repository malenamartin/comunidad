'use client';

import { useState, useEffect, useRef } from 'react';
import { useSWRConfig } from 'swr';
import type { PostType } from '@/lib/community/types';

const POST_TYPES: { value: PostType; label: string; color: string }[] = [
  { value: 'discusion',  label: 'Discusión',  color: 'var(--fardo-color-text-secondary)' },
  { value: 'benchmark',  label: 'Benchmark',  color: '#E07050' },
  { value: 'beta',       label: 'Beta',        color: '#90C050' },
  { value: 'educacion',  label: 'Educación',   color: '#C8A040' },
  { value: 'evento',     label: 'Evento',      color: '#8090E0' },
  { value: 'anuncio',    label: 'Anuncio',     color: 'var(--fardo-orange-400)' },
];

interface Props {
  onClose: () => void;
}

export function NewPostModal({ onClose }: Props) {
  const { mutate } = useSWRConfig();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [postType, setPostType] = useState<PostType>('discusion');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    // lock body scroll
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Necesitamos título y contenido para publicar.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), post_type: postType }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'No pudimos publicar. Probá de nuevo.');
        return;
      }
      // Invalidate all post caches
      await mutate((key: unknown) => typeof key === 'string' && key.startsWith('/api/community/posts'));
      onClose();
    } catch {
      setError('Se cayó la conexión. Probá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  const selectedType = POST_TYPES.find((t) => t.value === postType)!;

  return (
    /* Backdrop */
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Modal */}
      <div
        style={{
          background: 'var(--fardo-color-bg-base)',
          border: '1px solid var(--fardo-color-border-default)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '600px',
          padding: '28px',
          boxShadow: 'var(--fardo-shadow-md)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--fardo-color-text-primary)', margin: 0 }}>Crear post</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--fardo-color-text-muted)',
              cursor: 'pointer',
              fontSize: '22px',
              lineHeight: 1,
              padding: '2px 6px',
              borderRadius: '6px',
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Post type */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--fardo-color-text-muted)', letterSpacing: '0.08em', marginBottom: '8px' }}>
              TIPO
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {POST_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setPostType(t.value)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    border: postType === t.value ? `1.5px solid ${t.color}` : '1.5px solid var(--fardo-color-border-default)',
                    background: postType === t.value ? `${t.color}22` : 'var(--fardo-color-bg-subtle)',
                    color: postType === t.value ? t.color : 'var(--fardo-color-text-secondary)',
                    fontSize: '13px',
                    fontWeight: postType === t.value ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--fardo-color-text-muted)', letterSpacing: '0.08em', marginBottom: '8px' }}>
              TÍTULO
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="¿Qué señal querés compartir?"
              maxLength={200}
              style={{
                width: '100%',
                background: 'var(--fardo-color-bg-subtle)',
                border: '1px solid var(--fardo-color-border-default)',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: '15px',
                color: 'var(--fardo-color-text-primary)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Body */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--fardo-color-text-muted)', letterSpacing: '0.08em', marginBottom: '8px' }}>
              CONTENIDO
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Sumá contexto, dato, insight y próxima acción..."
              rows={6}
              style={{
                width: '100%',
                background: 'var(--fardo-color-bg-subtle)',
                border: '1px solid var(--fardo-color-border-default)',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: '14px',
                color: 'var(--fardo-color-text-primary)',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                lineHeight: 1.6,
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <p style={{ fontSize: '13px', color: '#E07070', marginBottom: '16px' }}>{error}</p>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'var(--fardo-color-bg-base)',
                color: 'var(--fardo-color-text-secondary)',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim() || !body.trim()}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                background: submitting || !title.trim() || !body.trim()
                  ? 'rgba(255,106,0,0.4)'
                  : 'linear-gradient(135deg, var(--fardo-orange-400), var(--fardo-orange-500))',
                color: 'var(--color-white)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: submitting || !title.trim() || !body.trim() ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {submitting ? 'Publicando...' : (
                <>
                  <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span>
                  Publicar ahora
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: selectedType.color,
                    background: `${selectedType.color}22`,
                    padding: '1px 6px',
                    borderRadius: '4px',
                  }}>
                    {selectedType.label}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
