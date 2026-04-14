import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { isAdmin, getAllMembers, updateMemberStatus, logAdminAction } from '@/lib/community/admin';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>, userId))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const page = Number(req.nextUrl.searchParams.get('page') ?? 1);
  const members = await getAllMembers(page);
  return NextResponse.json(members);
}

export async function PATCH(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>, userId))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { memberId, status } = await req.json();
  if (!memberId || !['active', 'suspended'].includes(status))
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 });

  await updateMemberStatus(memberId, status);
  await logAdminAction(userId, 'update_member_status', 'member', String(memberId), { status });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>, userId))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { memberId } = await req.json();
  if (!memberId) return NextResponse.json({ error: 'memberId requerido' }, { status: 400 });

  await sql`DELETE FROM community_members WHERE id = ${memberId}`;
  await logAdminAction(userId, 'member_deleted', 'member', String(memberId));
  return NextResponse.json({ ok: true });
}
