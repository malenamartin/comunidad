import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdmin, getAdminStats } from '@/lib/community/admin';

const STAT_CARDS = [
  {
    key: 'activeMembers',
    label: 'Miembros activos',
    href: '/comunidad/admin/members',
    icon: '👥',
    helper: 'Personas con acceso actual a la comunidad.',
  },
  {
    key: 'pendingRequests',
    label: 'Ingresos por revisar',
    href: '/comunidad/admin/requests',
    icon: '📬',
    helper: 'Perfiles esperando tu OK.',
  },
  {
    key: 'totalPosts',
    label: 'Posts en el feed',
    href: '/comunidad/admin/posts',
    icon: '📝',
    helper: 'Contenido publicado y visible.',
  },
  {
    key: 'totalVideos',
    label: 'Clases activas',
    href: '/comunidad/admin/videos',
    icon: '🎬',
    helper: 'Contenido en Aprende listo para consumo.',
  },
] as const;

const ACTIONS = [
  {
    label: 'Gestionar miembros',
    description: 'Activar, suspender o limpiar perfiles sin fit.',
    href: '/comunidad/admin/members',
  },
  {
    label: 'Revisar ingresos',
    description: 'Aprobar o rechazar nuevos accesos.',
    href: '/comunidad/admin/requests',
  },
  {
    label: 'Moderar posts',
    description: 'Destacar señal y bajar ruido en el feed.',
    href: '/comunidad/admin/posts',
  },
  {
    label: 'Gestionar clases',
    description: 'Subir videos y ordenar la academia.',
    href: '/comunidad/admin/videos',
  },
  {
    label: 'Gestionar betas',
    description: 'Abrir cupos y actualizar estado de producto.',
    href: '/comunidad/admin/betas',
  },
  {
    label: 'Gestionar avatares',
    description: 'Cargar avatares oficiales para nuevos miembros.',
    href: '/comunidad/admin/avatars',
  },
  {
    label: 'Códigos de invitación',
    description: 'Crear y controlar accesos por código.',
    href: '/comunidad/admin/invite-codes',
  },
];

export default async function AdminPage() {
  const { userId, sessionClaims } = await auth();
  if (!userId || !(await isAdmin(sessionClaims as Record<string, unknown>, userId))) {
    redirect('/comunidad');
  }

  const stats = await getAdminStats();

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '32px 24px' }}>
      <section
        style={{
          background: 'var(--fardo-color-bg-base)',
          border: '1px solid var(--fardo-color-border-default)',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '18px',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'var(--fardo-orange-500)',
            marginBottom: '8px',
          }}
        >
          ADMIN HUB
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--fardo-color-text-primary)', marginBottom: '6px' }}>
          Centro de control FARDO
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--fardo-color-text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
          Desde acá cuidás la calidad de la comunidad: buen acceso, contenido útil y roadmap con feedback real.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '10px',
          }}
        >
          {['1) Revisar ingresos', '2) Priorizar señal', '3) Publicar insight semanal'].map((step) => (
            <div
              key={step}
              style={{
                background: 'var(--fardo-color-bg-subtle)',
                border: '1px solid var(--fardo-color-border-default)',
                borderRadius: '10px',
                padding: '10px 12px',
                fontSize: '12px',
                color: 'var(--fardo-color-text-secondary)',
              }}
            >
              {step}
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        {STAT_CARDS.map((card) => {
          const value = Number(stats[card.key]);
          const isAlert = card.key === 'pendingRequests' && value > 0;

          return (
            <Link
              key={card.href}
              href={card.href}
              style={{
                display: 'block',
                textDecoration: 'none',
                background: 'var(--fardo-color-bg-base)',
                border: isAlert
                  ? '1px solid var(--fardo-orange-200)'
                  : '1px solid var(--fardo-color-border-default)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '20px' }}>{card.icon}</span>
                {isAlert && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      background: 'var(--fardo-orange-50)',
                      color: 'var(--fardo-orange-500)',
                      border: '1px solid var(--fardo-orange-200)',
                      borderRadius: '999px',
                      padding: '2px 8px',
                    }}
                    >
                      Urgente
                    </span>
                  )}
              </div>
              <p style={{ fontSize: '30px', lineHeight: 1, fontWeight: 700, color: 'var(--fardo-color-text-primary)', marginBottom: '6px' }}>
                {value.toLocaleString('es-AR')}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--fardo-color-text-primary)', fontWeight: 600, marginBottom: '3px' }}>
                {card.label}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-muted)' }}>{card.helper}</p>
            </Link>
          );
        })}
      </section>

      <section
        style={{
          background: 'var(--fardo-color-bg-base)',
          border: '1px solid var(--fardo-color-border-default)',
          borderRadius: '14px',
          padding: '18px',
        }}
      >
        <h2 style={{ fontSize: '16px', color: 'var(--fardo-color-text-primary)', marginBottom: '10px' }}>
          Operaciones críticas
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
          {ACTIONS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'block',
                textDecoration: 'none',
                background: 'var(--fardo-color-bg-subtle)',
                border: '1px solid var(--fardo-color-border-default)',
                borderRadius: '10px',
                padding: '12px',
              }}
            >
              <p style={{ fontSize: '13px', color: 'var(--fardo-color-text-primary)', fontWeight: 600, marginBottom: '4px' }}>
                {item.label} →
              </p>
              <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-muted)', lineHeight: 1.5 }}>
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
