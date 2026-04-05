'use client';

import { RequestAccessForm } from '@/components/community/RequestAccessForm';
import { FardoLogo } from '@/components/community/FardoLogo';
import { BarChart2, BookOpen, Zap, Calendar, Users } from 'lucide-react';

const PILLS = ['AEO', 'GEO', 'LLMO', 'Benchmarks', 'Estrategia', 'AI', 'Marcas', 'LatAm'];

const BENEFITS = [
  {
    icon: BarChart2,
    title: 'Benchmarks exclusivos',
    description: 'Citation Rate, SOV y LLMO Score por industria. Comparate con las mejores marcas de LatAm.',
  },
  {
    icon: BookOpen,
    title: 'Academia privada',
    description: 'Videos de AEO, GEO y LLMO para CMOs y Brand Directors. Sin teoría vacía, puro impacto.',
  },
  {
    icon: Zap,
    title: 'Acceso a betas',
    description: 'Probá antes que nadie las nuevas features de Fardo y ayudá a moldear el producto.',
  },
  {
    icon: Calendar,
    title: 'Eventos exclusivos',
    description: 'Masterclasses, meetups y precios especiales para miembros en toda LatAm.',
  },
  {
    icon: Users,
    title: 'Directorio de pares',
    description: 'Conectate con CMOs y Marketing Managers que construyen marcas visibles en la IA.',
  },
];

// Scattered image tiles
const TILES = [
  { top: '6%',  left: '17%',  w: 160, h: 120, rotateZ: -2, rotateY:  6, img: '/tiles/tile-1.svg'  },
  { top: '2%',  left: '31%',  w: 110, h: 135, rotateZ:  1, rotateY: -8, img: '/tiles/tile-2.svg'  },
  { top: '8%',  left: '44%',  w: 130, h: 100, rotateZ: -3, rotateY:  5, img: '/tiles/tile-3.svg'  },
  { top: '3%',  left: '57%',  w: 170, h: 115, rotateZ:  2, rotateY: -6, img: '/tiles/tile-4.svg'  },
  { top: '10%', left: '72%',  w: 120, h: 130, rotateZ: -1, rotateY:  7, img: '/tiles/tile-5.svg'  },
  { top: '4%',  left: '83%',  w: 100, h: 110, rotateZ:  3, rotateY: -5, img: '/tiles/tile-6.svg'  },
  { top: '22%', left: '5%',   w: 120, h: 155, rotateZ: -4, rotateY:  8, img: '/tiles/tile-7.svg'  },
  { top: '48%', left: '2%',   w: 100, h: 120, rotateZ:  2, rotateY:  6, img: '/tiles/tile-8.svg'  },
  { top: '68%', left: '10%',  w: 140, h: 105, rotateZ: -2, rotateY:  7, img: '/tiles/tile-9.svg'  },
  { top: '20%', left: '85%',  w: 135, h: 160, rotateZ:  3, rotateY: -8, img: '/tiles/tile-10.svg' },
  { top: '48%', left: '88%',  w: 115, h: 135, rotateZ: -3, rotateY: -7, img: '/tiles/tile-11.svg' },
  { top: '70%', left: '80%',  w: 155, h: 110, rotateZ:  1, rotateY: -6, img: '/tiles/tile-12.svg' },
  { top: '72%', left: '28%',  w: 110, h: 105, rotateZ: -2, rotateY:  5, img: '/tiles/tile-13.svg' },
  { top: '75%', left: '57%',  w: 130, h: 100, rotateZ:  3, rotateY: -7, img: '/tiles/tile-14.svg' },
];

export function LandingPage() {
  return (
    <div style={{ background: '#EFEFEF', minHeight: '100vh', color: '#0A0A0A', fontFamily: 'inherit' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', height: '100vh', minHeight: '600px', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

        {/* Scattered 3D tiles */}
        <div style={{ perspective: '900px', position: 'absolute', inset: 0 }}>
          {TILES.map((tile, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: tile.top,
                left: tile.left,
                width: tile.w,
                height: tile.h,
                borderRadius: '10px',
                transform: `rotateY(${tile.rotateY}deg) rotateZ(${tile.rotateZ}deg)`,
                transformStyle: 'preserve-3d',
                boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)',
                overflow: 'hidden',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tile.img}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* Shine overlay for 3D feel */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: tile.rotateY > 0
                    ? 'linear-gradient(105deg, rgba(255,255,255,0.18) 0%, transparent 60%)'
                    : 'linear-gradient(255deg, rgba(255,255,255,0.18) 0%, transparent 60%)',
                  borderRadius: '10px',
                  pointerEvents: 'none',
                }}
              />
            </div>
          ))}
        </div>

        {/* Pills row */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            display: 'flex',
            gap: '8px',
            padding: '20px 32px',
            flexWrap: 'wrap',
            zIndex: 10,
          }}
        >
          {PILLS.map((pill) => (
            <span
              key={pill}
              style={{
                padding: '7px 18px',
                borderRadius: '100px',
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.1)',
                fontSize: '13px',
                fontWeight: 500,
                color: '#0A0A0A',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {pill}
            </span>
          ))}
        </div>

        {/* Center content */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: '800px' }}>
          <div style={{ marginBottom: '16px' }}>
            <p
              style={{
                fontSize: 'clamp(28px, 4vw, 48px)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                color: '#0A0A0A',
                marginBottom: '4px',
              }}
            >
              Comunidad
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <FardoLogo variant="dark" height={80} />
            </div>
          </div>

          <div
            style={{
              display: 'inline-block',
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '100px',
              padding: '8px 20px',
              fontSize: 'clamp(13px, 1.5vw, 16px)',
              color: '#444',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}
          >
            La comunidad donde las marcas dejan de ser invisibles en la IA
          </div>
        </div>

        {/* Sign-in link */}
        <a
          href="/sign-in"
          style={{
            position: 'absolute',
            top: '22px',
            right: '32px',
            fontSize: '13px',
            color: '#666',
            textDecoration: 'none',
            zIndex: 10,
          }}
        >
          Ya soy miembro →
        </a>
      </section>

      {/* ── FORM SECTION ── */}
      <section
        style={{
          background: '#FFFFFF',
          padding: '80px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '40px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '520px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(212,74,48,0.08)',
              border: '1px solid rgba(212,74,48,0.2)',
              borderRadius: '100px',
              padding: '5px 16px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#D44A30',
              letterSpacing: '0.06em',
              marginBottom: '16px',
            }}
          >
            ACCESO POR INVITACIÓN
          </div>
          <h2
            style={{
              fontSize: 'clamp(26px, 4vw, 40px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#0A0A0A',
              lineHeight: 1.15,
            }}
          >
            Pedí tu acceso o usá tu código
          </h2>
        </div>
        <RequestAccessFormLight />
      </section>

      {/* ── BENEFITS ── */}
      <section style={{ background: '#F5F5F5', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0A0A0A', textAlign: 'center', marginBottom: '8px' }}>
            Lo que encontrás adentro
          </h2>
          <p style={{ fontSize: '15px', color: '#888', textAlign: 'center', marginBottom: '48px' }}>
            Solo para CMOs, Marketing Managers y Brand Directors de LatAm.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(0,0,0,0.07)',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    style={{
                      width: '40px', height: '40px',
                      background: 'rgba(212,74,48,0.08)',
                      border: '1px solid rgba(212,74,48,0.15)',
                      borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    <Icon size={18} color="#D44A30" />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0A0A0A', marginBottom: '6px' }}>
                    {b.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6 }}>
                    {b.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#FFFFFF', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '24px 24px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <FardoLogo variant="gray" height={24} />
        <p style={{ color: '#AAA', fontSize: '13px', margin: 0 }}>
          Comunidad exclusiva para líderes de marketing en LatAm.
        </p>
      </footer>
    </div>
  );
}

// Light-themed version of RequestAccessForm
function RequestAccessFormLight() {
  return <RequestAccessForm theme="light" />;
}
