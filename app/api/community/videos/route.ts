import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { listVideos } from '@/lib/community/videos';
import { getMemberByClerkId } from '@/lib/community/members';

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const member = await getMemberByClerkId(userId);
  if (!member) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const url = new URL(req.url);
  const category = url.searchParams.get('category') ?? undefined;
  const level = url.searchParams.get('level') ?? undefined;

  const videos = await listVideos({ category, level });
  return NextResponse.json(videos);
}
