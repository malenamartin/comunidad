import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getLeaderboard } from '@/lib/community/gamification';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const rows = await getLeaderboard(50);
  return NextResponse.json(rows);
}
