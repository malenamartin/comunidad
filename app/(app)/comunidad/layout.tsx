import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/community/Navbar';

export default async function ComunidadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const roles = ((sessionClaims?.metadata as Record<string, unknown>)?.roles as string[]) ?? [];
  if (!roles.includes('community_member')) {
    redirect('/comunidad');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Navbar />
      <main style={{ paddingTop: '64px' }}>{children}</main>
    </div>
  );
}
