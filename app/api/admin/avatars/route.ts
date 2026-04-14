import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { isAdmin, logAdminAction } from '@/lib/community/admin';
import sql from '@/lib/db';

async function ensureAdmin() {
  const { userId, sessionClaims } = await auth();
  const allowed = Boolean(userId) && await isAdmin(sessionClaims as Record<string, unknown>, userId);
  return { userId, allowed };
}

export async function GET() {
  const { allowed } = await ensureAdmin();
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const avatars = await sql`
    SELECT *
    FROM community_avatar_presets
    ORDER BY order_index ASC, created_at DESC
  `;
  return NextResponse.json(avatars);
}

export async function POST(req: NextRequest) {
  const { userId, allowed } = await ensureAdmin();
  if (!allowed || !userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, image_url, order_index, is_active } = body as Record<string, unknown>;
  if (!name || !image_url) {
    return NextResponse.json({ error: 'Campos requeridos: name, image_url' }, { status: 400 });
  }

  const created = await sql`
    INSERT INTO community_avatar_presets (name, image_url, order_index, is_active)
    VALUES (
      ${String(name)},
      ${String(image_url)},
      ${typeof order_index === 'number' ? order_index : 0},
      ${typeof is_active === 'boolean' ? is_active : true}
    )
    RETURNING *
  `;

  await logAdminAction(userId, 'avatar_preset_created', 'avatar_preset', String(created[0].id), {
    name: String(name),
  });
  return NextResponse.json(created[0], { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { userId, allowed } = await ensureAdmin();
  if (!allowed || !userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const {
    avatarId,
    name,
    image_url,
    order_index,
    is_active,
  } = body as {
    avatarId?: number;
    name?: string;
    image_url?: string;
    order_index?: number;
    is_active?: boolean;
  };
  if (!avatarId) return NextResponse.json({ error: 'avatarId requerido' }, { status: 400 });

  const updated = await sql`
    UPDATE community_avatar_presets
    SET
      name = COALESCE(${name ? String(name) : null}, name),
      image_url = COALESCE(${image_url ? String(image_url) : null}, image_url),
      order_index = COALESCE(${typeof order_index === 'number' ? order_index : null}, order_index),
      is_active = COALESCE(${typeof is_active === 'boolean' ? is_active : null}, is_active)
    WHERE id = ${avatarId}
    RETURNING *
  `;

  if (!updated[0]) return NextResponse.json({ error: 'Avatar no encontrado' }, { status: 404 });

  await logAdminAction(userId, 'avatar_preset_updated', 'avatar_preset', String(avatarId), {
    name,
    image_url,
    order_index,
    is_active,
  });
  return NextResponse.json(updated[0]);
}

export async function DELETE(req: NextRequest) {
  const { userId, allowed } = await ensureAdmin();
  if (!allowed || !userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { avatarId } = await req.json();
  if (!avatarId) return NextResponse.json({ error: 'avatarId requerido' }, { status: 400 });

  const deleted = await sql`
    DELETE FROM community_avatar_presets
    WHERE id = ${avatarId}
    RETURNING id
  `;
  if (!deleted[0]) return NextResponse.json({ error: 'Avatar no encontrado' }, { status: 404 });

  await sql`UPDATE member_avatar_selection SET preset_id = NULL WHERE preset_id = ${avatarId}`;
  await logAdminAction(userId, 'avatar_preset_deleted', 'avatar_preset', String(avatarId));
  return NextResponse.json({ ok: true });
}
