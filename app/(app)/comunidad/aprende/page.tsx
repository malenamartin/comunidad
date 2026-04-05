'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { VideoCard } from '@/components/community/VideoCard';
import type { Video } from '@/lib/community/types';

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

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: active ? 600 : 400,
    color: active ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
    background: active ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
    transition: 'all 0.15s',
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: '4px' }}>
          Aprende
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
          Formación exclusiva para líderes de marketing
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
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

      {/* Grid */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)' }}>
              <div style={{ aspectRatio: '16/9', background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ padding: '14px 16px', height: '60px' }} />
            </div>
          ))}
        </div>
      ) : !videos?.length ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'rgba(255,255,255,0.3)' }}>
          <p style={{ fontSize: '15px' }}>No hay videos disponibles con estos filtros.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
