'use client';

import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { FardoLogo } from '@/components/community/FardoLogo';

const TICKER_ITEMS = [
  'SI NO TE ENCUENTRAN EN IA, TE REEMPLAZAN',
  'COMUNIDAD CMO: MENOS HUMO, MAS SENAL',
  'INSIGHTS ACCIONABLES EN TIEMPO REAL',
  'IA + MARKETING CON ALMA (Y DATOS)',
];

const HEADER_H = 74;
const TICKER_H = 36;
export const TOTAL_HEADER_H = HEADER_H + TICKER_H; // 110

const NAV_ITEMS = [
  { href: '/comunidad', label: 'Feed' },
  { href: '/comunidad/conversaciones', label: 'Conversaciones' },
  { href: '/comunidad/benchmarks', label: 'Benchmarks' },
  { href: '/comunidad/aprende', label: 'Aprende' },
  { href: '/comunidad/betas', label: 'Betas' },
  { href: '/comunidad/eventos', label: 'Eventos' },
  { href: '/comunidad/miembros', label: 'Miembros' },
  { href: '/comunidad/ranking', label: 'Ranking' },
];

export function Navbar({ bypassAuth = false }: { bypassAuth?: boolean }) {
  const pathname = usePathname();
  const loopItems = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(250,249,248,0.92)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div className="fardo-main-shell" style={{ height: `${HEADER_H}px` }}>
        <div className="fardo-main-bar">
          <Link href="/comunidad" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <FardoLogo variant="dark" height={26} />
          </Link>

          <nav className="fardo-main-nav" aria-label="Secciones de comunidad">
            {NAV_ITEMS.map((item) => {
              const active = item.href === '/comunidad'
                ? pathname === '/comunidad'
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? 'fardo-main-nav-link fardo-main-nav-link-active' : 'fardo-main-nav-link'}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
            <Link
              href="/comunidad/admin"
              style={{ fontSize: '13px', color: 'var(--fardo-color-text-muted)', textDecoration: 'none', fontWeight: 600 }}
            >
              Admin
            </Link>

            {!bypassAuth ? (
              <UserButton
                afterSignOutUrl="/comunidad"
                appearance={{ elements: { userButtonAvatarBox: { width: 34, height: 34 } } }}
              />
            ) : (
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--fardo-orange-400), var(--fardo-orange-500))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                M
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          height: `${TICKER_H}px`,
          borderTop: '1px solid var(--fardo-color-border-default)',
          borderBottom: '1px solid var(--fardo-color-border-default)',
          overflow: 'hidden',
          background: 'linear-gradient(90deg, #9584e8 0%, #8cb8f2 46%, #97c3ef 100%)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="fardo-ticker-track">
          {loopItems.map((item, index) => (
            <span key={`${item}-${index}`} className="fardo-ticker-item">
              {item}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .fardo-main-shell {
          max-width: 1260px;
          margin: 0 auto;
          padding: 7px 20px 6px;
          box-sizing: border-box;
        }

        .fardo-main-bar {
          height: 100%;
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid #e6e3e0;
          border-radius: 14px;
          box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 14px;
          padding: 0 14px;
        }

        .fardo-main-nav {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          min-width: 0;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 2px 0;
        }

        .fardo-main-nav::-webkit-scrollbar {
          display: none;
        }

        .fardo-main-nav-link {
          position: relative;
          font-size: 14px;
          font-weight: 500;
          color: var(--fardo-color-text-secondary);
          padding: 8px 0;
          white-space: nowrap;
          transition: color 0.18s ease;
        }

        .fardo-main-nav-link:hover {
          color: var(--fardo-color-text-primary);
        }

        .fardo-main-nav-link-active {
          color: var(--fardo-orange-500);
          font-weight: 600;
        }

        .fardo-main-nav-link-active::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -6px;
          height: 2px;
          border-radius: 999px;
          background: var(--fardo-orange-400);
        }

        .fardo-ticker-track {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          min-width: max-content;
          animation: fardoTicker 38s linear infinite;
          will-change: transform;
        }

        .fardo-ticker-item {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          font-style: italic;
          color: #161313;
          margin-right: 40px;
        }

        @media (max-width: 980px) {
          .fardo-main-shell {
            padding: 6px 10px 5px;
          }

          .fardo-main-bar {
            gap: 10px;
            padding: 0 10px;
          }

          .fardo-main-nav {
            justify-content: flex-start;
            gap: 14px;
          }

          .fardo-main-nav-link {
            font-size: 13px;
            padding: 8px 0;
          }
        }

        @keyframes fardoTicker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </header>
  );
}
