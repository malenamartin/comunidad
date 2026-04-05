import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { requestBetaAccess } from '@/lib/community/betas';
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
  try {
    const result = await requestBetaAccess(id, member.id);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
