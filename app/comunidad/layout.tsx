import { auth } from '@clerk/nextjs/server';
import { Navbar } from '@/components/community/Navbar';

export default async function ComunidadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = await auth();
  const roles =
    ((sessionClaims?.metadata as Record<string, unknown>)?.roles as string[]) ?? [];
  const isMember = Boolean(userId) && roles.includes('community_member');

  if (isMember) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
        <Navbar />
        <main style={{ paddingTop: '64px' }}>{children}</main>
      </div>
    );
  }

  // Public layout — no navbar
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      {children}
    </div>
  );
}
