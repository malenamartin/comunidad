import Link from 'next/link';
import Image from 'next/image';
import { Play, Clock } from 'lucide-react';
import type { Video } from '@/lib/community/types';

const CATEGORY_LABELS: Record<string, string> = {
  aeo: 'AEO',
  geo: 'GEO',
  llmo: 'LLMO',
  ecommerce: 'E-commerce',
  estrategia: 'Estrategia',
  casos: 'Casos',
};

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  intro: { label: 'Nivel Intro', color: '#90C050' },
  intermedio: { label: 'Nivel Intermedio', color: '#C8A040' },
  avanzado: { label: 'Nivel Avanzado', color: '#E07050' },
};

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const levelStyle = LEVEL_LABELS[video.level] ?? LEVEL_LABELS.intro;

  return (
    <Link href={`/comunidad/aprende/${video.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        style={{
          background: 'var(--fardo-color-bg-base)',
          border: '1px solid var(--fardo-color-border-default)',
          borderRadius: '18px',
          overflow: 'hidden',
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
        {/* Thumbnail */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '16/9',
            background: 'var(--fardo-color-bg-subtle)',
            overflow: 'hidden',
          }}
        >
          {video.thumbnail_url ? (
            <Image
              src={video.thumbnail_url}
              alt={video.title}
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(255,106,0,0.18), rgba(224,90,0,0.42))',
              }}
            />
          )}
          {/* Play button overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(44,42,40,0.18)',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(255,106,0,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Play size={18} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: 2 }} />
            </div>
          </div>
          {/* Duration badge */}
          {video.duration_min && (
            <div
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                background: 'rgba(44,42,40,0.8)',
                borderRadius: '999px',
                padding: '2px 6px',
                fontSize: '11px',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <Clock size={10} />
              {video.duration_min} min
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              {CATEGORY_LABELS[video.category] ?? video.category.toUpperCase()}
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: levelStyle.color,
                background: `${levelStyle.color}22`,
                borderRadius: '999px',
                padding: '2px 8px',
              }}
            >
              {levelStyle.label}
            </span>
          </div>
          <h3
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--fardo-color-text-primary)',
              lineHeight: 1.4,
            }}
          >
            {video.title}
          </h3>
        </div>
      </article>
    </Link>
  );
}
