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
  discusion: { label: 'Discusión', color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.06)' },
  anuncio:   { label: 'Anuncio',   color: '#D44A30', bg: 'rgba(212,74,48,0.15)' },
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
          background: 'rgba(255,255,255,0.03)',
          border: '0.5px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '20px',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <MemberAvatar name={post.author_name} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF' }}>
                {post.author_name}
              </span>
              {post.author_is_founder && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#D44A30',
                    background: 'rgba(212,74,48,0.12)',
                    border: '1px solid rgba(212,74,48,0.25)',
                    borderRadius: '3px',
                    padding: '1px 5px',
                    letterSpacing: '0.05em',
                  }}
                >
                  FUNDADOR
                </span>
              )}
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                {post.author_company}
              </span>
            </div>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
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
            color: '#FFFFFF',
            marginBottom: '8px',
            lineHeight: 1.4,
          }}
        >
          {post.is_pinned && (
            <span style={{ color: '#D44A30', marginRight: '6px', fontSize: '12px' }}>📌</span>
          )}
          {post.title}
        </h3>

        {/* Body preview */}
        <p
          style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
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
              color: 'rgba(255,255,255,0.35)',
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
              color: post.user_liked ? '#D44A30' : 'rgba(255,255,255,0.35)',
            }}
          >
            <Heart size={14} fill={post.user_liked ? '#D44A30' : 'none'} />
            {post.likes_count}
          </span>
        </div>
      </article>
    </Link>
  );
}
