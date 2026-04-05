import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { toggleReaction } from '@/lib/community/posts';
import { getMemberByClerkId } from '@/lib/community/members';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const member = await getMemberByClerkId(userId);
  if (!member) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const { id } = await params;
  const result = await toggleReaction(id, member.id);
  return NextResponse.json(result);
}
