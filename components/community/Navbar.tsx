'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

const NAV_TABS = [
  { label: 'Feed',        href: '/comunidad' },
  { label: 'Benchmarks', href: '/comunidad/benchmarks' },
  { label: 'Aprende',    href: '/comunidad/aprende' },
  { label: 'Betas',      href: '/comunidad/betas' },
  { label: 'Eventos',    href: '/comunidad/eventos' },
  { label: 'Miembros',   href: '/comunidad/miembros' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        height: '64px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
        }}
      >
        {/* Logo */}
        <Link href="/comunidad" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span
            style={{
              fontSize: '22px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
            }}
          >
            far<span style={{ color: '#D44A30' }}>do</span>
          </span>
        </Link>

        {/* Desktop tabs */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flex: 1,
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
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                  background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                  transition: 'all 0.15s ease',
                  textDecoration: 'none',
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#D44A30',
              background: 'rgba(212,74,48,0.12)',
              border: '1px solid rgba(212,74,48,0.3)',
              borderRadius: '4px',
              padding: '3px 8px',
            }}
          >
            EXCLUSIVO
          </span>
          <UserButton
            afterSignOutUrl="/comunidad"
            appearance={{
              elements: {
                userButtonAvatarBox: { width: 32, height: 32 },
              },
            }}
          />
        </div>
      </div>

      {/* Mobile tabs scroll */}
      <div
        className="md:hidden"
        style={{
          overflowX: 'auto',
          display: 'flex',
          padding: '0 16px 8px',
          gap: '4px',
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
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                flexShrink: 0,
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
