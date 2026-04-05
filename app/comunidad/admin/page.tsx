import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isAdmin, getAdminStats } from '@/lib/community/admin';
import Link from 'next/link';

export default async function AdminPage() {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>)) redirect('/comunidad');

  const stats = await getAdminStats();

  const cards = [
    { label: 'Miembros activos',    value: stats.activeMembers,    href: '/comunidad/admin/members',      icon: '👥' },
    { label: 'Solicitudes pending', value: stats.pendingRequests,  href: '/comunidad/admin/requests',     icon: '📬', alert: stats.pendingRequests > 0 },
    { label: 'Posts totales',       value: stats.totalPosts,       href: '/comunidad/admin/posts',        icon: '📝' },
    { label: 'Videos',             value: stats.totalVideos,       href: '/comunidad/aprende',            icon: '🎬' },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Panel de administración</h1>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '32px' }}>Visión general de la comunidad</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {cards.map((c) => (
          <Link key={c.href} href={c.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${c.alert ? 'rgba(212,74,48,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'border-color 0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '24px' }}>{c.icon}</span>
                {c.alert && <span style={{ fontSize: '11px', background: '#D44A30', color: '#fff', borderRadius: '100px', padding: '2px 8px', fontWeight: 600 }}>Nuevo</span>}
              </div>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#fff', margin: '12px 0 4px' }}>{c.value}</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{c.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {[
          { label: 'Gestionar miembros',      href: '/comunidad/admin/members'      },
          { label: 'Solicitudes de acceso',   href: '/comunidad/admin/requests'     },
          { label: 'Códigos de invitación',   href: '/comunidad/admin/invite-codes' },
          { label: 'Moderar posts',           href: '/comunidad/admin/posts'        },
        ].map((item) => (
          <Link key={item.href} href={item.href} style={{ display: 'block', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '16px 20px', color: '#fff', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
            {item.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}
