'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { VideoCard } from '@/components/community/VideoCard';
import type { Video } from '@/lib/community/types';
import { mockVideos } from '@/lib/community/mockData';

const CATEGORIES = [
  { value: '', label: 'Todo' },
  { value: 'aeo', label: 'AEO' },
  { value: 'geo', label: 'GEO' },
  { value: 'llmo', label: 'LLMO' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'estrategia', label: 'Estrategia' },
  { value: 'casos', label: 'Casos' },
];

const LEVELS = [
  { value: '', label: 'Todos los niveles' },
  { value: 'intro', label: 'Intro' },
  { value: 'intermedio', label: 'Intermedio' },
  { value: 'avanzado', label: 'Avanzado' },
];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AprendePage() {
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');

  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (level) params.set('level', level);
  const url = `/api/community/videos${params.toString() ? `?${params}` : ''}`;

  const { data: videos, isLoading } = useSWR<Video[]>(url, fetcher);
  const displayVideos = videos?.length ? videos : mockVideos.filter((video) => {
    if (category && video.category !== category) return false;
    if (level && video.level !== level) return false;
    return true;
  });

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 14px',
    borderRadius: '999px',
    border: active ? '1px solid var(--fardo-orange-200)' : '1px solid var(--fardo-color-border-default)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: active ? 600 : 500,
    color: active ? 'var(--fardo-orange-500)' : 'var(--fardo-color-text-secondary)',
    background: active ? 'var(--fardo-orange-50)' : 'var(--fardo-color-bg-subtle)',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
    transition: 'all 0.15s',
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      <section
        style={{
          background: 'var(--fardo-color-bg-base)',
          border: '1px solid var(--fardo-color-border-default)',
          borderRadius: '20px',
          padding: '18px',
          marginBottom: '14px',
        }}
      >
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--fardo-orange-500)', marginBottom: '8px' }}>
          APRENDE
        </p>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--fardo-color-text-primary)',
            marginBottom: '4px',
          }}
        >
          Academia FARDO para equipos de marketing
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--fardo-color-text-secondary)', lineHeight: 1.6 }}>
          Clases cortas para ejecutar hoy: AEO, GEO, LLMO y visibilidad de marca sin palabrerío.
        </p>
      </section>

      <section
        style={{
          background: 'var(--fardo-color-bg-base)',
          border: '1px solid var(--fardo-color-border-default)',
          borderRadius: '20px',
          padding: '14px',
          marginBottom: '14px',
        }}
      >
        <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-muted)', marginBottom: '8px' }}>Filtrar clases</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {CATEGORIES.map((c) => (
              <button key={c.value} onClick={() => setCategory(c.value)} style={tabStyle(category === c.value)}>
                {c.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {LEVELS.map((l) => (
              <button key={l.value} onClick={() => setLevel(l.value)} style={tabStyle(level === l.value)}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {!videos?.length && !isLoading && (
        <div style={{ fontSize: '12px', color: 'var(--fardo-orange-500)', marginBottom: '10px', fontWeight: 600 }}>
          Mostrando clases demo para que veas la experiencia completa.
        </div>
      )}

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                borderRadius: '18px',
                overflow: 'hidden',
                background: 'var(--fardo-color-bg-base)',
                border: '1px solid var(--fardo-color-border-default)',
              }}
            >
              <div style={{ aspectRatio: '16/9', background: 'var(--fardo-color-bg-subtle)' }} />
              <div style={{ padding: '14px 16px', height: '60px' }} />
            </div>
          ))}
        </div>
      ) : !displayVideos?.length ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--fardo-color-text-muted)' }}>
          <p style={{ fontSize: '15px' }}>No hay clases para estos filtros. Probá otra combinación.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {displayVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
