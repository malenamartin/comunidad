import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getComments, addComment } from '@/lib/community/posts';
import { getMemberByClerkId } from '@/lib/community/members';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const member = await getMemberByClerkId(userId);
  if (!member) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const { id } = await params;
  const comments = await getComments(id);
  return NextResponse.json(comments);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const member = await getMemberByClerkId(userId);
  if (!member) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const { body: commentBody, parent_id } = body as { body: string; parent_id?: string };

  if (!commentBody?.trim()) {
    return NextResponse.json({ error: 'El comentario no puede estar vacío' }, { status: 400 });
  }

  const comment = await addComment({
    post_id: id,
    author_id: member.id,
    body: commentBody.trim(),
    parent_id,
  });

  return NextResponse.json(comment, { status: 201 });
}
