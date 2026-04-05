import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { incrementViews } from '@/lib/community/posts';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { id } = await params;
  await incrementViews(id);
  return NextResponse.json({ success: true });
}
