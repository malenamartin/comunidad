import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { isAdmin, getPendingRequests, resolveRequest, logAdminAction } from '@/lib/community/admin';

export async function GET() {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>, userId))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const requests = await getPendingRequests();
  return NextResponse.json(requests);
}

export async function POST(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>, userId))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { requestId, action } = await req.json();
  if (!requestId || !['approve', 'reject'].includes(action))
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 });

  await resolveRequest(requestId, action);
  await logAdminAction(userId, `request_${action}d`, 'access_request', String(requestId));
  return NextResponse.json({ ok: true });
}
