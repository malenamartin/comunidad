import { auth } from '@clerk/nextjs/server';
import { Navbar, TOTAL_HEADER_H } from '@/components/community/Navbar';

export default async function ComunidadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // BYPASS_AUTH=true lets you preview the community without Clerk configured.
  if (process.env.BYPASS_AUTH === 'true') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--fardo-color-bg-page)' }}>
        <Navbar bypassAuth />
        <main style={{ paddingTop: `${TOTAL_HEADER_H + 32}px` }}>{children}</main>
      </div>
    );
  }

  const { userId, sessionClaims } = await auth();
  const roles =
    ((sessionClaims?.metadata as Record<string, unknown>)?.roles as string[]) ?? [];
  const isMember = Boolean(userId) && roles.includes('community_member');

  if (isMember) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--fardo-color-bg-page)' }}>
        <Navbar />
        <main style={{ paddingTop: `${TOTAL_HEADER_H + 32}px` }}>{children}</main>
      </div>
    );
  }

  // Public layout — no navbar
  return (
    <div style={{ minHeight: '100vh', background: 'var(--fardo-color-bg-page)' }}>
      {children}
    </div>
  );
}
