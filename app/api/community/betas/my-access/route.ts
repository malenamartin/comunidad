import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getMyBetaAccess } from '@/lib/community/betas';
import { getMemberByClerkId } from '@/lib/community/members';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const member = await getMemberByClerkId(userId);
  if (!member) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const access = await getMyBetaAccess(member.id);
  return NextResponse.json(access);
}
