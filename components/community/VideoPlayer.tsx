'use client';

import { useEffect, useRef } from 'react';
import type { Video } from '@/lib/community/types';

interface VideoPlayerProps {
  video: Video;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!video.vimeo_id || !containerRef.current) return;

    let player: import('@vimeo/player').default | null = null;

    async function initPlayer() {
      const Player = (await import('@vimeo/player')).default;

      if (!containerRef.current) return;

      player = new Player(containerRef.current, {
        id: parseInt(video.vimeo_id!, 10),
        responsive: true,
        dnt: true,
        byline: false,
        title: false,
        portrait: false,
      });
    }

    initPlayer();

    return () => {
      player?.destroy().catch(() => {});
    };
  }, [video.vimeo_id]);

  if (!video.vimeo_id) {
    return (
      <div
        style={{
          aspectRatio: '16/9',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '14px',
        }}
      >
        Video no disponible
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#000',
      }}
    />
  );
}
