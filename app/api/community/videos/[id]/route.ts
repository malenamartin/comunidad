import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getVideoById } from '@/lib/community/videos';
import { getMemberByClerkId } from '@/lib/community/members';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const member = await getMemberByClerkId(userId);
  if (!member) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const { id } = await params;
  const video = await getVideoById(id);
  if (!video) return NextResponse.json({ error: 'Video no encontrado' }, { status: 404 });

  return NextResponse.json(video);
}
