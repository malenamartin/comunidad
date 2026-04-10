import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { isAdmin, logAdminAction } from '@/lib/community/admin';
import sql from '@/lib/db';

export async function GET() {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return NextResponse.json(
    await sql`
      SELECT id, image_url, label, sort_order, is_active, created_at
      FROM community_preset_avatars
      ORDER BY sort_order ASC, created_at DESC
    `,
  );
}

export async function POST(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { image_url, label, sort_order = 0 } = body as {
    image_url?: string;
    label?: string;
    sort_order?: number;
  };
  if (!image_url?.startsWith('https://'))
    return NextResponse.json({ error: 'image_url debe ser HTTPS' }, { status: 400 });

  const [row] = await sql<{ id: string }[]>`
    INSERT INTO community_preset_avatars (image_url, label, sort_order)
    VALUES (${image_url}, ${label ?? null}, ${sort_order})
    RETURNING id
  `;
  await logAdminAction(userId, 'preset_avatar_created', 'preset_avatar', row.id);
  return NextResponse.json(row, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId || !await isAdmin(sessionClaims as Record<string, unknown>))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id, is_active } = await req.json();
  if (!id || typeof is_active !== 'boolean')
    return NextResponse.json({ error: 'id e is_active requeridos' }, { status: 400 });

  await sql`
    UPDATE community_preset_avatars SET is_active = ${is_active} WHERE id = ${id}::uuid
  `;
  await logAdminAction(userId, is_active ? 'preset_avatar_activated' : 'preset_avatar_deactivated', 'preset_avatar', String(id));
  return NextResponse.json({ ok: true });
}
