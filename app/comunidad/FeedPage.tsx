'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { PostCard } from '@/components/community/PostCard';
import type { Post, PostType } from '@/lib/community/types';

const POST_TYPES: { value: PostType | ''; label: string }[] = [
  { value: '', label: 'Todo' },
  { value: 'benchmark', label: 'Benchmarks' },
  { value: 'beta', label: 'Betas' },
  { value: 'educacion', label: 'Educación' },
  { value: 'evento', label: 'Eventos' },
  { value: 'discusion', label: 'Discusiones' },
  { value: 'anuncio', label: 'Anuncios' },
];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function FeedPage() {
  const [type, setType] = useState<PostType | ''>('');

  const url = type ? `/api/community/posts?type=${type}` : '/api/community/posts';
  const { data, isLoading } = useSWR<{ posts: Post[]; total: number }>(url, fetcher);

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            marginBottom: '4px',
          }}
        >
          Feed
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
          Lo último de la comunidad
        </p>
      </div>

      {/* Type filter tabs */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '24px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          paddingBottom: '4px',
        }}
      >
        {POST_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: type === t.value ? 600 : 400,
              color: type === t.value ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
              background: type === t.value ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                height: '160px',
                background: 'rgba(255,255,255,0.03)',
                border: '0.5px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
              }}
            />
          ))}
        </div>
      ) : !data?.posts?.length ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'rgba(255,255,255,0.3)' }}>
          <p style={{ fontSize: '15px' }}>Todavía no hay posts en esta categoría.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
