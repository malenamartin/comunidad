'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import useSWR from 'swr';
import { VideoPlayer } from '@/components/community/VideoPlayer';
import type { Video } from '@/lib/community/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const CATEGORY_LABELS: Record<string, string> = {
  aeo: 'AEO', geo: 'GEO', llmo: 'LLMO',
  ecommerce: 'E-commerce', estrategia: 'Estrategia', casos: 'Casos',
};

export default function VideoDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: video } = useSWR<Video>(id ? `/api/community/videos/${id}` : null, fetcher);

  if (!video) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ borderRadius: '12px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', aspectRatio: '16/9' }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
      <Link href="/comunidad/aprende" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none', marginBottom: '24px' }}>
        <ArrowLeft size={14} /> Volver a Aprende
      </Link>

      {/* Player */}
      <div style={{ marginBottom: '24px' }}>
        <VideoPlayer video={video} />
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>
          {CATEGORY_LABELS[video.category] ?? video.category.toUpperCase()}
        </span>
        {video.duration_min && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
            <Clock size={12} /> {video.duration_min} min
          </span>
        )}
      </div>

      <h1 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: '14px', lineHeight: 1.35 }}>
        {video.title}
      </h1>

      {video.description && (
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {video.description}
        </p>
      )}
    </div>
  );
}
