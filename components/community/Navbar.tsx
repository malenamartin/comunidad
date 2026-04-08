'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { FardoLogo } from '@/components/community/FardoLogo';

/* ─────────────────────────────────────────────────────────── types */

interface MegaCard {
  title: string;
  subtitle: string;
  gradient: string;
  href: string;
}

interface NavTab {
  label: string;
  href: string;
  mega?: {
    cards: MegaCard[];
    verTodosHref: string;
    aspectRatio: string; // e.g. '66%' = 3:2, '56.25%' = 16:9
  };
}

/* ─────────────────────────────────────────────────────── nav config */

const NAV_TABS: NavTab[] = [
  { label: 'Feed', href: '/comunidad' },
  {
    label: 'Benchmarks',
    href: '/comunidad/benchmarks',
    mega: {
      verTodosHref: '/comunidad/benchmarks',
      aspectRatio: '66%',
      cards: [
        { title: 'CPM promedio por industria', subtitle: 'Q1 2025 · 24 marcas', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', href: '/comunidad/benchmarks' },
        { title: 'CAC en ecommerce LatAm',    subtitle: 'Referencia sectorial',  gradient: 'linear-gradient(135deg, #16213e 0%, #1a1a3e 100%)', href: '/comunidad/benchmarks' },
        { title: 'CTR en Meta Ads 2025',       subtitle: 'Actualizado abril',     gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 100%)', href: '/comunidad/benchmarks' },
      ],
    },
  },
  {
    label: 'Aprende',
    href: '/comunidad/aprende',
    mega: {
      verTodosHref: '/comunidad/aprende',
      aspectRatio: '56.25%',
      cards: [
        { title: 'IA en estrategia de marca',  subtitle: 'Clase · 38 min',        gradient: 'linear-gradient(135deg, #0d2b1e 0%, #1a4a2e 100%)', href: '/comunidad/aprende' },
        { title: 'Medición avanzada sin cookies', subtitle: 'Clase · 52 min',     gradient: 'linear-gradient(135deg, #0a2218 0%, #153d28 100%)', href: '/comunidad/aprende' },
        { title: 'Prompt engineering para CMOs',  subtitle: 'Clase · 29 min',     gradient: 'linear-gradient(135deg, #071c14 0%, #11301e 100%)', href: '/comunidad/aprende' },
      ],
    },
  },
  {
    label: 'Betas',
    href: '/comunidad/betas',
    mega: {
      verTodosHref: '/comunidad/betas',
      aspectRatio: '66%',
      cards: [
        { title: 'Perplexity Ads para marcas',  subtitle: 'Acceso anticipado',    gradient: 'linear-gradient(135deg, #1a2e20 0%, #2e4a1a 100%)', href: '/comunidad/betas' },
        { title: 'Fardo AI Insights',           subtitle: 'Beta cerrado',         gradient: 'linear-gradient(135deg, #1e2a10 0%, #304a18 100%)', href: '/comunidad/betas' },
        { title: 'Klaviyo AI Segments',         subtitle: 'Invite-only',          gradient: 'linear-gradient(135deg, #182814 0%, #28421a 100%)', href: '/comunidad/betas' },
      ],
    },
  },
  {
    label: 'Eventos',
    href: '/comunidad/eventos',
    mega: {
      verTodosHref: '/comunidad/eventos',
      aspectRatio: '66%',
      cards: [
        { title: 'CMO Roundtable — Mayo', subtitle: '15 mayo · Online',           gradient: 'linear-gradient(135deg, #1e1a2e 0%, #2a1e4a 100%)', href: '/comunidad/eventos' },
        { title: 'Workshop IA Generativa',   subtitle: '22 mayo · CABA',          gradient: 'linear-gradient(135deg, #1a162e 0%, #24183e 100%)', href: '/comunidad/eventos' },
        { title: 'Fardo Summit 2025',        subtitle: 'Septiembre · TBA',        gradient: 'linear-gradient(135deg, #14102a 0%, #1e1636 100%)', href: '/comunidad/eventos' },
      ],
    },
  },
  { label: 'Miembros', href: '/comunidad/miembros' },
  { label: 'Ranking',  href: '/comunidad/ranking' },
];

const STRIP_ITEMS = [
  '★ 847 miembros activos',
  '127 posts esta semana',
  'Contenido exclusivo IA & Marketing',
];

const HEADER_H   = 72;  // px — main nav bar
const STRIP_H    = 32;  // px — secondary strip
export const TOTAL_HEADER_H = HEADER_H + STRIP_H; // 104

/* ─────────────────────────────────────────────────────── component */

export function Navbar({ bypassAuth = false }: { bypassAuth?: boolean }) {
  const pathname   = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openMenu(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setHovered(label);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setHovered(null), 120);
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  const activeMega = NAV_TABS.find((t) => t.label === hovered && t.mega)?.mega ?? null;

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
    >
      {/* ── Main nav bar */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 32px',
          height: `${HEADER_H}px`,
          display: 'flex',
          alignItems: 'center',
          gap: '0',
        }}
      >
        {/* Logo */}
        <Link href="/comunidad" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, marginRight: '36px' }}>
          <FardoLogo variant="light" height={26} />
        </Link>

        {/* Desktop nav links */}
        <nav style={{ display: 'flex', alignItems: 'stretch', flex: 1, height: '100%' }}>
          {NAV_TABS.map((tab) => {
            const isActive =
              tab.href === '/comunidad'
                ? pathname === '/comunidad'
                : pathname.startsWith(tab.href);
            const isOpen = hovered === tab.label;

            return (
              <div
                key={tab.href}
                style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                onMouseEnter={() => tab.mega ? openMenu(tab.label) : setHovered(null)}
              >
                <Link
                  href={tab.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    padding: '0 16px',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive || isOpen ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                    textDecoration: 'none',
                    borderBottom: isActive ? '2px solid #FFFFFF' : isOpen ? '2px solid rgba(255,255,255,0.3)' : '2px solid transparent',
                    transition: 'color 0.15s, border-color 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                  {tab.mega && (
                    <span style={{
                      marginLeft: '4px',
                      fontSize: '10px',
                      opacity: 0.5,
                      transition: 'transform 0.15s',
                      display: 'inline-block',
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                    }}>▾</span>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <Link
            href="/comunidad/admin"
            style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
          >
            Admin
          </Link>
          {!bypassAuth ? (
            <UserButton
              afterSignOutUrl="/comunidad"
              appearance={{ elements: { userButtonAvatarBox: { width: 34, height: 34 } } }}
            />
          ) : (
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #D44A30, #C27A28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, color: '#fff',
            }}>M</div>
          )}
        </div>
      </div>

      {/* ── Secondary strip */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          height: `${STRIP_H}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
        }}
      >
        {STRIP_ITEMS.map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.02em' }}>
              {item}
            </span>
            {i < STRIP_ITEMS.length - 1 && (
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.15)' }}>·</span>
            )}
          </span>
        ))}
      </div>

      {/* ── Mega-menu dropdown */}
      {activeMega && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          style={{
            position: 'absolute',
            top: `${HEADER_H + STRIP_H}px`,
            left: 0,
            right: 0,
            background: 'rgba(12,12,12,0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '28px 0 32px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
            {/* Ver todos link */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <Link
                href={activeMega.verTodosHref}
                onClick={() => setHovered(null)}
                style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.15s',
                }}
              >
                Ver todos <span style={{ fontSize: '16px' }}>→</span>
              </Link>
            </div>

            {/* Cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {activeMega.cards.map((card, i) => (
                <Link
                  key={i}
                  href={card.href}
                  onClick={() => setHovered(null)}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  {/* Placeholder image */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: activeMega.aspectRatio,
                      borderRadius: '10px',
                      overflow: 'hidden',
                      marginBottom: '12px',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: card.gradient,
                      }}
                    />
                    {/* Subtle noise/grain texture simulation */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.04) 0%, transparent 60%)',
                      }}
                    />
                    {/* "Image coming" label */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.2)',
                        letterSpacing: '0.08em',
                        fontWeight: 600,
                      }}
                    >
                      PRÓXIMAMENTE
                    </div>
                  </div>

                  {/* Card text */}
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    margin: '0 0 4px',
                    lineHeight: 1.3,
                  }}>
                    {card.title}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.4)',
                    margin: 0,
                  }}>
                    {card.subtitle}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile scroll tabs (hidden on md+) */}
      <div
        className="md:hidden"
        style={{
          overflowX: 'auto',
          display: 'flex',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          scrollbarWidth: 'none',
        }}
      >
        {NAV_TABS.map((tab) => {
          const isActive =
            tab.href === '/comunidad'
              ? pathname === '/comunidad'
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                whiteSpace: 'nowrap',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                borderBottom: isActive ? '2px solid #FFFFFF' : '2px solid transparent',
                textDecoration: 'none',
                flexShrink: 0,
                transition: 'color 0.15s',
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
