import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getMemberBadges } from '@/lib/community/gamification';
import sql from '@/lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const members = await sql`SELECT id FROM community_members WHERE clerk_user_id = ${userId}`;
  if (!members.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const badges = await getMemberBadges(members[0].id);
  return NextResponse.json(badges);
}
