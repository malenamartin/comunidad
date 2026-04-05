import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { isAdmin, getAllMembers, updateMemberStatus, logAdminAction } from '@/lib/community/admin';

export async function GET(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const page = Number(req.nextUrl.searchParams.get('page') ?? 1);
  const members = await getAllMembers(page);
  return NextResponse.json(members);
}

export async function PATCH(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { memberId, status } = await req.json();
  if (!memberId || !['active', 'suspended'].includes(status))
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 });

  await updateMemberStatus(memberId, status);
  await logAdminAction(userId, 'update_member_status', 'member', String(memberId), { status });
  return NextResponse.json({ ok: true });
}
