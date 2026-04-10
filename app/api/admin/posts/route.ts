import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  isAdmin,
  getRecentPosts,
  deletePost,
  togglePinPost,
  setPostPublished,
  logAdminAction,
} from '@/lib/community/admin';

export async function GET() {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return NextResponse.json(await getRecentPosts());
}

export async function DELETE(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { postId } = await req.json();
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 });
  await deletePost(postId);
  await logAdminAction(userId, 'post_deleted', 'post', String(postId));
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { postId, pinned, published } = await req.json();
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 });

  if (typeof pinned === 'boolean') {
    await togglePinPost(postId, pinned);
    await logAdminAction(userId, pinned ? 'post_pinned' : 'post_unpinned', 'post', String(postId));
  }
  if (typeof published === 'boolean') {
    await setPostPublished(postId, published);
    await logAdminAction(userId, published ? 'post_published' : 'post_hidden', 'post', String(postId));
  }

  return NextResponse.json({ ok: true });
}
