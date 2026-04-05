import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import sql from '@/lib/db';
import { getVideoProgress, saveVideoProgress } from '@/lib/community/videoProgress';

async function getMember(userId: string) {
  const rows = await sql`SELECT id FROM community_members WHERE clerk_user_id = ${userId}`;
  return rows[0] ?? null;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const member = await getMember(userId);
  if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const progress = await getVideoProgress(member.id, Number(id));
  return NextResponse.json(progress);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const member = await getMember(userId);
  if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { seconds, duration } = await req.json();
  if (typeof seconds !== 'number' || typeof duration !== 'number') {
    return NextResponse.json({ error: 'seconds and duration required' }, { status: 400 });
  }

  const result = await saveVideoProgress(member.id, Number(id), seconds, duration);
  return NextResponse.json(result);
}
