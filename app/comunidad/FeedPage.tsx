'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { PostCard } from '@/components/community/PostCard';
import { NewPostModal } from '@/components/community/NewPostModal';
import type { Post, PostType } from '@/lib/community/types';
import Link from 'next/link';

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
  const [showNewPost, setShowNewPost] = useState(false);

  const url = type ? `/api/community/posts?type=${type}` : '/api/community/posts';
  const { data, isLoading } = useSWR<{ posts: Post[]; total: number }>(url, fetcher);
  const quickActions = [
    {
      title: 'Leé la cancha antes que tu competencia',
      description: 'Revisá benchmarks por industria y detectá si tu categoría se está moviendo.',
      href: '/comunidad/benchmarks',
      cta: 'Ver benchmarks',
    },
    {
      title: 'Aprendé una táctica y ejecutala hoy',
      description: 'Tomá una clase corta de AEO/GEO/LLMO y bajala a acción esta semana.',
      href: '/comunidad/aprende',
      cta: 'Ir a Aprende',
    },
    {
      title: 'Activá networking que sí sirve',
      description: 'Conectá con CMOs y líderes de marketing que están peleando la misma batalla.',
      href: '/comunidad/miembros',
      cta: 'Explorar miembros',
    },
    {
      title: 'Contrastá tendencias con gente que ejecuta',
      description: 'Usá conversaciones para compartir señal real y recibir feedback accionable.',
      href: '/comunidad/conversaciones',
      cta: 'Abrir conversaciones',
    },
  ];
  const weeklyPlan = [
    'Lunes: revisá benchmarks y elegí una oportunidad concreta.',
    'Miércoles: publicá una señal, pregunta o aprendizaje en el feed.',
    'Viernes: cerrá una acción para la semana siguiente con otro miembro.',
  ];

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 24px' }}>
      {showNewPost && <NewPostModal onClose={() => setShowNewPost(false)} />}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--fardo-color-text-primary)',
              marginBottom: '4px',
            }}
          >
            Feed
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--fardo-color-text-muted)' }}>
            Lo que están moviendo los CMOs que no juegan tibio.
          </p>
        </div>
        <button
          onClick={() => setShowNewPost(true)}
          style={{
            padding: '9px 18px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, var(--fardo-orange-400), var(--fardo-orange-500))',
            color: 'var(--color-white)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span>
          Nuevo post
        </button>
      </div>

      <section
        style={{
          marginBottom: '24px',
          background: 'var(--fardo-color-bg-base)',
          border: '0.5px solid var(--fardo-color-border-default)',
          borderRadius: '14px',
          padding: '18px',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'var(--fardo-orange-200)',
            marginBottom: '10px',
          }}
        >
          PLAYBOOK CMO
        </p>
        <h2 style={{ fontSize: '16px', color: 'var(--fardo-color-text-primary)', marginBottom: '6px' }}>
          Si no sabés por dónde arrancar, arrancá acá
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--fardo-color-text-secondary)', marginBottom: '14px', lineHeight: 1.6 }}>
          Menos scroll, más señal: detectá oportunidades, validá decisiones y convertí ideas en experimentos reales.
        </p>

        <div style={{ display: 'grid', gap: '10px' }}>
          {quickActions.map((action) => (
            <div
              key={action.title}
              style={{
                background: 'var(--fardo-color-bg-subtle)',
                border: '1px solid var(--fardo-color-border-default)',
                borderRadius: '10px',
                padding: '12px',
              }}
            >
              <p style={{ fontSize: '13px', color: 'var(--fardo-color-text-primary)', fontWeight: 600, marginBottom: '4px' }}>{action.title}</p>
              <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-secondary)', marginBottom: '8px', lineHeight: 1.5 }}>{action.description}</p>
              <Link href={action.href} style={{ color: 'var(--fardo-orange-400)', fontSize: '12px', fontWeight: 600 }}>
                {action.cta} →
              </Link>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '12px',
            background: 'var(--fardo-orange-50)',
            border: '1px solid var(--fardo-orange-200)',
            borderRadius: '10px',
            padding: '10px 12px',
          }}
        >
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fardo-orange-500)', marginBottom: '6px' }}>
            Ritual FARDO de la semana
          </p>
          {weeklyPlan.map((item) => (
            <p key={item} style={{ fontSize: '12px', color: 'var(--fardo-color-text-secondary)', lineHeight: 1.55 }}>
              {item}
            </p>
          ))}
        </div>
      </section>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '10px 12px',
          borderRadius: '10px',
          background: 'var(--fardo-color-bg-base)',
          border: '1px solid var(--fardo-color-border-default)',
          marginBottom: '22px',
        }}
      >
        <span style={{ fontSize: '12px', color: 'var(--fardo-color-text-secondary)' }}>
          {isLoading ? 'Cargando señal...' : `${data?.total ?? 0} publicaciones para usar hoy`}
        </span>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <Link href="/comunidad/conversaciones" style={{ fontSize: '12px', color: 'var(--fardo-color-text-brand)', fontWeight: 600 }}>
            Ir al chat de tendencias →
          </Link>
          <Link href="/comunidad/betas" style={{ fontSize: '12px', color: 'var(--fardo-orange-200)', fontWeight: 600 }}>
            Ver betas en vivo →
          </Link>
        </div>
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
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: type === t.value ? 600 : 400,
              color: type === t.value ? 'var(--fardo-color-text-brand)' : 'var(--fardo-color-text-muted)',
              background: type === t.value ? 'var(--fardo-orange-50)' : 'var(--fardo-color-bg-base)',
              border: type === t.value ? '1px solid var(--fardo-orange-200)' : '1px solid var(--fardo-color-border-default)',
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
                background: 'var(--fardo-color-bg-base)',
                border: '0.5px solid var(--fardo-color-border-default)',
                borderRadius: '12px',
              }}
            />
          ))}
        </div>
      ) : !data?.posts?.length ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--fardo-color-text-muted)' }}>
          <p style={{ fontSize: '15px' }}>Todavía no hay posts en esta categoría. Abrí la cancha con el primero.</p>
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
