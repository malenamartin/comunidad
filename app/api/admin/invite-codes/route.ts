import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { isAdmin, getInviteCodes, createInviteCode, toggleInviteCode, logAdminAction } from '@/lib/community/admin';

export async function GET() {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return NextResponse.json(await getInviteCodes());
}

export async function POST(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { code, maxUses = 1, expiresAt = null } = await req.json();
  if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });

  const [created] = await createInviteCode(code, maxUses, expiresAt);
  await logAdminAction(userId, 'invite_code_created', 'invite_code', code);
  return NextResponse.json(created);
}

export async function PATCH(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { codeId, active } = await req.json();
  await toggleInviteCode(codeId, active);
  await logAdminAction(userId, active ? 'invite_code_activated' : 'invite_code_deactivated', 'invite_code', String(codeId));
  return NextResponse.json({ ok: true });
}
