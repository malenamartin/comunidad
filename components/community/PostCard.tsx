'use client';

import Link from 'next/link';
import { Eye, Heart } from 'lucide-react';
import { MemberAvatar } from './MemberAvatar';
import { timeAgo, truncate } from '@/lib/utils';
import type { Post, PostType } from '@/lib/community/types';

const TYPE_STYLES: Record<PostType, { label: string; color: string; bg: string }> = {
  benchmark: { label: 'Benchmark', color: '#E07050', bg: 'rgba(220,80,50,0.15)' },
  beta:      { label: 'Beta',      color: '#90C050', bg: 'rgba(120,180,60,0.15)' },
  educacion: { label: 'Educación', color: '#C8A040', bg: 'rgba(180,130,40,0.15)' },
  evento:    { label: 'Evento',    color: '#8090E0', bg: 'rgba(80,120,200,0.15)' },
  discusion: { label: 'Discusión', color: 'var(--fardo-color-text-secondary)', bg: 'rgba(255,255,255,0.06)' },
  anuncio:   { label: 'Anuncio',   color: 'var(--fardo-orange-400)', bg: 'rgba(255,106,0,0.15)' },
};

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const typeStyle = TYPE_STYLES[post.post_type] ?? TYPE_STYLES.discusion;

  return (
    <Link href={`/comunidad/${post.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        style={{
          background: 'var(--fardo-color-bg-base)',
          border: '0.5px solid var(--fardo-color-border-default)',
          borderRadius: '16px',
          padding: '20px',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease, transform 0.15s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--fardo-color-border-brand)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--fardo-color-border-default)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <MemberAvatar name={post.author_name} size={32} avatarUrl={post.author_avatar_url} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--fardo-color-text-primary)' }}>
                {post.author_name}
              </span>
              {post.author_is_founder && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'var(--fardo-orange-400)',
                    background: 'rgba(255,106,0,0.12)',
                    border: '1px solid rgba(255,106,0,0.25)',
                    borderRadius: '3px',
                    padding: '1px 5px',
                    letterSpacing: '0.05em',
                  }}
                >
                  FUNDADOR
                </span>
              )}
              <span style={{ fontSize: '12px', color: 'var(--fardo-color-text-muted)' }}>
                {post.author_company}
              </span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--fardo-color-text-muted)' }}>
              {timeAgo(post.created_at)}
            </span>
          </div>
          {/* Type tag */}
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: typeStyle.color,
              background: typeStyle.bg,
              borderRadius: '4px',
              padding: '3px 8px',
              flexShrink: 0,
              letterSpacing: '0.03em',
            }}
          >
            {typeStyle.label}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--fardo-color-text-primary)',
            marginBottom: '8px',
            lineHeight: 1.4,
          }}
        >
          {post.is_pinned && (
            <span style={{ color: 'var(--fardo-orange-400)', marginRight: '6px', fontSize: '12px' }}>📌</span>
          )}
          {post.title}
        </h3>

        {/* Body preview */}
        <p
          style={{
            fontSize: '14px',
            color: 'var(--fardo-color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: '16px',
          }}
        >
          {truncate(post.body, 150)}
        </p>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '13px',
              color: 'var(--fardo-color-text-muted)',
            }}
          >
            <Eye size={14} />
            {post.views}
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '13px',
              color: post.user_liked ? 'var(--fardo-orange-400)' : 'var(--fardo-color-text-muted)',
            }}
          >
            <Heart size={14} fill={post.user_liked ? 'var(--fardo-orange-400)' : 'none'} />
            {post.likes_count}
          </span>
        </div>
      </article>
    </Link>
  );
}
