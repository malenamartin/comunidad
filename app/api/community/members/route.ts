import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { listMembers } from '@/lib/community/directory';
import { getMemberByClerkId } from '@/lib/community/members';

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const member = await getMemberByClerkId(userId);
  if (!member) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const url = new URL(req.url);
  const country = url.searchParams.get('country') ?? undefined;
  const page = parseInt(url.searchParams.get('page') ?? '1', 10);

  const result = await listMembers({ country, page });
  return NextResponse.json(result);
}
