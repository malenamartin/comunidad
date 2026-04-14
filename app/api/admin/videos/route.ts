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

  const videos = await sql`
    SELECT *
    FROM videos
    ORDER BY order_index ASC, created_at DESC
  `;
  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  const { userId, allowed } = await ensureAdmin();
  if (!allowed || !userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const {
    title,
    description,
    category,
    level,
    duration_min,
    vimeo_id,
    thumbnail_url,
    order_index,
    is_published,
  } = body as Record<string, unknown>;

  if (!title || !category) {
    return NextResponse.json({ error: 'Campos requeridos: title, category' }, { status: 400 });
  }

  const created = await sql`
    INSERT INTO videos (
      title, description, category, level, duration_min, vimeo_id, thumbnail_url, order_index, is_published
    ) VALUES (
      ${String(title)},
      ${description ? String(description) : null},
      ${String(category)},
      ${level ? String(level) : 'intro'},
      ${typeof duration_min === 'number' ? duration_min : null},
      ${vimeo_id ? String(vimeo_id) : null},
      ${thumbnail_url ? String(thumbnail_url) : null},
      ${typeof order_index === 'number' ? order_index : 0},
      ${typeof is_published === 'boolean' ? is_published : true}
    )
    RETURNING *
  `;

  await logAdminAction(userId, 'video_created', 'video', String(created[0].id), {
    title: String(title),
    category: String(category),
  });
  return NextResponse.json(created[0], { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { userId, allowed } = await ensureAdmin();
  if (!allowed || !userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const {
    videoId,
    title,
    description,
    category,
    level,
    duration_min,
    vimeo_id,
    thumbnail_url,
    order_index,
    is_published,
  } = body as {
    videoId?: number;
    title?: string;
    description?: string;
    category?: string;
    level?: string;
    duration_min?: number;
    vimeo_id?: string;
    thumbnail_url?: string;
    order_index?: number;
    is_published?: boolean;
  };
  if (!videoId) return NextResponse.json({ error: 'videoId requerido' }, { status: 400 });

  const updated = await sql`
    UPDATE videos
    SET
      title = COALESCE(${title ? String(title) : null}, title),
      description = COALESCE(${description ? String(description) : null}, description),
      category = COALESCE(${category ? String(category) : null}, category),
      level = COALESCE(${level ? String(level) : null}, level),
      duration_min = COALESCE(${typeof duration_min === 'number' ? duration_min : null}, duration_min),
      vimeo_id = COALESCE(${vimeo_id ? String(vimeo_id) : null}, vimeo_id),
      thumbnail_url = COALESCE(${thumbnail_url ? String(thumbnail_url) : null}, thumbnail_url),
      order_index = COALESCE(${typeof order_index === 'number' ? order_index : null}, order_index),
      is_published = COALESCE(${typeof is_published === 'boolean' ? is_published : null}, is_published)
    WHERE id = ${videoId}
    RETURNING *
  `;

  if (!updated[0]) return NextResponse.json({ error: 'Video no encontrado' }, { status: 404 });

  await logAdminAction(userId, 'video_updated', 'video', String(videoId), {
    title,
    description,
    category,
    level,
    duration_min,
    vimeo_id,
    thumbnail_url,
    order_index,
    is_published,
  });
  return NextResponse.json(updated[0]);
}

export async function DELETE(req: NextRequest) {
  const { userId, allowed } = await ensureAdmin();
  if (!allowed || !userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { videoId } = await req.json();
  if (!videoId) return NextResponse.json({ error: 'videoId requerido' }, { status: 400 });

  const deleted = await sql`DELETE FROM videos WHERE id = ${videoId} RETURNING id`;
  if (!deleted[0]) return NextResponse.json({ error: 'Video no encontrado' }, { status: 404 });

  await logAdminAction(userId, 'video_deleted', 'video', String(videoId));
  return NextResponse.json({ ok: true });
}
