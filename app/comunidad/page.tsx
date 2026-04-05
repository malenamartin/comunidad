import { auth } from '@clerk/nextjs/server';
import { LandingPage } from './LandingPage';
import { FeedPage } from './FeedPage';

export default async function ComunidadPage() {
  const { userId, sessionClaims } = await auth();

  const roles =
    ((sessionClaims?.metadata as Record<string, unknown>)?.roles as string[]) ?? [];
  const isMember = Boolean(userId) && roles.includes('community_member');

  if (isMember) {
    return <FeedPage />;
  }

  return <LandingPage />;
}
