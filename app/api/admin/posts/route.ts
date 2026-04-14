import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { isAdmin, getRecentPosts, deletePost, togglePinPost, logAdminAction } from '@/lib/community/admin';

export async function GET() {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>, userId))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return NextResponse.json(await getRecentPosts());
}

export async function DELETE(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>, userId))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { postId } = await req.json();
  await deletePost(postId);
  await logAdminAction(userId, 'post_deleted', 'post', String(postId));
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>, userId))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { postId, pinned } = await req.json();
  await togglePinPost(postId, pinned);
  await logAdminAction(userId, pinned ? 'post_pinned' : 'post_unpinned', 'post', String(postId));
  return NextResponse.json({ ok: true });
}
