import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getPublicMemberById } from '@/lib/community/directory';
import { getMemberByClerkId } from '@/lib/community/members';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const viewer = await getMemberByClerkId(userId);
  if (!viewer) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const { id } = await params;
  const member = await getPublicMemberById(id);
  if (!member) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  return NextResponse.json(member);
}
