import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { listEvents } from '@/lib/community/events';
import { getMemberByClerkId } from '@/lib/community/members';

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const member = await getMemberByClerkId(userId);
  if (!member) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const url = new URL(req.url);
  const filter = url.searchParams.get('filter') as 'upcoming' | 'past' | null;

  const events = await listEvents(filter ?? undefined);
  return NextResponse.json(events);
}
