import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { listPosts, createPost } from '@/lib/community/posts';
import { getMemberByClerkId } from '@/lib/community/members';
import type { PostType } from '@/lib/community/types';

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const member = await getMemberByClerkId(userId);
  if (!member) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const url = new URL(req.url);
  const type = url.searchParams.get('type') as PostType | null;
  const page = parseInt(url.searchParams.get('page') ?? '1', 10);
  const limit = parseInt(url.searchParams.get('limit') ?? '20', 10);

  const { posts, total } = await listPosts({
    type: type ?? undefined,
    page,
    limit,
    memberId: member.id,
  });

  return NextResponse.json({ posts, total, page, limit });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const member = await getMemberByClerkId(userId);
  if (!member) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const body = await req.json();
  const { title, body: postBody, post_type } = body as {
    title: string;
    body: string;
    post_type: PostType;
  };

  if (!title || !postBody || !post_type) {
    return NextResponse.json({ error: 'Campos requeridos: title, body, post_type' }, { status: 400 });
  }

  const post = await createPost({
    author_id: member.id,
    title,
    body: postBody,
    post_type,
  });

  return NextResponse.json(post, { status: 201 });
}
