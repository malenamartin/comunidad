'use client';

import { RequestAccessForm } from '@/components/community/RequestAccessForm';
import { FardoLogo } from '@/components/community/FardoLogo';
import { BarChart2, BookOpen, Zap, Calendar, Users } from 'lucide-react';

const PILLS = ['AEO', 'GEO', 'LLMO', 'Benchmarks', 'Estrategia', 'AI', 'Marcas', 'LatAm'];

const BENEFITS = [
  {
    icon: BarChart2,
    title: 'Benchmarks con dientes',
    description: 'Citation Rate, SOV y LLMO Score por industria. Si estás abajo, lo ves. Si subís, también.',
  },
  {
    icon: BookOpen,
    title: 'Academia sin verso',
    description: 'AEO, GEO y LLMO explicados como corresponde: claro, accionable y pensado para ejecutar en la semana.',
  },
  {
    icon: Zap,
    title: 'Betas antes que el resto',
    description: 'Probás features primero, das feedback real y empujás el roadmap con nosotros.',
  },
  {
    icon: Calendar,
    title: 'Eventos que suman',
    description: 'Masterclasses y meetups con gente que ejecuta, no paneles eternos de buzzwords.',
  },
  {
    icon: Users,
    title: 'Red de cómplices',
    description: 'CMOs y líderes de marketing que comparten aprendizajes reales para ganar visibilidad en IA.',
  },
];

const CMO_FLOW = [
  {
    step: 'Semana 1',
    title: 'Mapeás tu visibilidad sin autoengaño',
    description: 'Detectás brechas de presencia en IA y priorizás por impacto, no por intuición.',
  },
  {
    step: 'Semana 2',
    title: 'Corrés experimentos que mueven aguja',
    description: 'Tomás una táctica, la adaptás a tu marca y la testeás en ciclos cortos con criterio.',
  },
  {
    step: 'Semana 3+',
    title: 'Escalás con señal de pares',
    description: 'Validás decisiones con otros líderes y acelerás resultados con betas, feedback y ejecución.',
  },
];

// Scattered image tiles
const TILES = [
  { top: '14%', left: '17%',  w: 160, h: 120, rotateZ: -2, rotateY:  6, img: '/tiles/tile-1.svg'  },
  { top: '10%', left: '31%',  w: 110, h: 135, rotateZ:  1, rotateY: -8, img: '/tiles/tile-2.svg'  },
  { top: '16%', left: '44%',  w: 130, h: 100, rotateZ: -3, rotateY:  5, img: '/tiles/tile-3.svg'  },
  { top: '11%', left: '57%',  w: 170, h: 115, rotateZ:  2, rotateY: -6, img: '/tiles/tile-4.svg'  },
  { top: '18%', left: '72%',  w: 120, h: 130, rotateZ: -1, rotateY:  7, img: '/tiles/tile-5.svg'  },
  { top: '12%', left: '83%',  w: 100, h: 110, rotateZ:  3, rotateY: -5, img: '/tiles/tile-6.svg'  },
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

        {/* Scattered 3D tiles with float animation */}
        <div style={{ perspective: '1200px', position: 'absolute', inset: 0 }}>
          {TILES.map((tile, i) => {
            const baseTransform = `rotateY(${tile.rotateY}deg) rotateZ(${tile.rotateZ}deg)`;
            const animName = ['float-a', 'float-b', 'float-c'][i % 3];
            const delay = `${(i * 0.37).toFixed(2)}s`;
            const duration = `${3.5 + (i % 4) * 0.5}s`;
            return (
              <div
                key={i}
                className="tile-float"
                style={{
                  position: 'absolute',
                  top: tile.top,
                  left: tile.left,
                  width: tile.w,
                  height: tile.h,
                  borderRadius: '12px',
                  '--tile-base': baseTransform,
                  transform: baseTransform,
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10)',
                  overflow: 'hidden',
                  animationName: animName,
                  animationDuration: duration,
                  animationDelay: delay,
                } as React.CSSProperties}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tile.img}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* Shine overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: tile.rotateY > 0
                      ? 'linear-gradient(105deg, rgba(255,255,255,0.15) 0%, transparent 55%)'
                      : 'linear-gradient(255deg, rgba(255,255,255,0.15) 0%, transparent 55%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            );
          })}
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
            Si la IA ya está eligiendo ganadores, mejor que te elija a vos.
          </div>
        </div>

        {/* Sign-in link */}
        <a
          href={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? 'https://platform-fardo.com/sign-in'}
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
          Ya soy miembro, quiero entrar →
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
              background: 'rgba(255,106,0,0.08)',
              border: '1px solid rgba(255,106,0,0.2)',
              borderRadius: '100px',
              padding: '5px 16px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#FF6A00',
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
            Entrá con código o pedí acceso
          </h2>
        </div>
        <RequestAccessFormLight />
      </section>

      <section style={{ background: '#F8F7F5', padding: '72px 24px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#E05A00',
              marginBottom: '8px',
              textAlign: 'center',
            }}
          >
            RUTA CMO
          </p>
          <h2
            style={{
              fontSize: 'clamp(24px, 3.4vw, 36px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#0A0A0A',
              marginBottom: '10px',
              textAlign: 'center',
            }}
          >
            Qué cambia cuando entrás a la comunidad
          </h2>
          <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '34px' }}>
            No es networking de cartón: es un sistema para decidir mejor y ejecutar más rápido.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {CMO_FLOW.map((item) => (
              <article
                key={item.step}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '14px',
                  padding: '18px',
                }}
              >
                <p
                  style={{
                    display: 'inline-flex',
                    padding: '2px 10px',
                    borderRadius: '999px',
                    background: 'rgba(255,106,0,0.08)',
                    border: '1px solid rgba(255,106,0,0.22)',
                    color: '#E05A00',
                    fontSize: '11px',
                    fontWeight: 700,
                    marginBottom: '10px',
                  }}
                >
                  {item.step}
                </p>
                <h3 style={{ fontSize: '16px', color: '#0A0A0A', marginBottom: '6px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#666' }}>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section style={{ background: '#F5F5F5', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0A0A0A', textAlign: 'center', marginBottom: '8px' }}>
            Lo que desbloqueás adentro
          </h2>
          <p style={{ fontSize: '15px', color: '#888', textAlign: 'center', marginBottom: '48px' }}>
            Para CMOs y líderes de marketing que no se bancan lo tibio.
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
                      background: 'rgba(255,106,0,0.08)',
                      border: '1px solid rgba(255,106,0,0.15)',
                      borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    <Icon size={18} color="#FF6A00" />
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
          FARDO: claridad, velocidad y cero humo para marketing en IA.
        </p>
      </footer>
    </div>
  );
}

// Light-themed version of RequestAccessForm
function RequestAccessFormLight() {
  return <RequestAccessForm theme="light" />;
}
