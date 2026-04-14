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

  const betas = await sql`
    SELECT *
    FROM betas
    ORDER BY order_index ASC, created_at DESC
  `;
  return NextResponse.json(betas);
}

export async function POST(req: NextRequest) {
  const { userId, allowed } = await ensureAdmin();
  if (!allowed || !userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const {
    name,
    description,
    status,
    max_testers,
    current_count,
    launch_date,
    order_index,
  } = body as Record<string, unknown>;

  if (!name) {
    return NextResponse.json({ error: 'Campo requerido: name' }, { status: 400 });
  }

  const created = await sql`
    INSERT INTO betas (
      name, description, status, max_testers, current_count, launch_date, order_index
    ) VALUES (
      ${String(name)},
      ${description ? String(description) : null},
      ${status ? String(status) : 'soon'},
      ${typeof max_testers === 'number' ? max_testers : null},
      ${typeof current_count === 'number' ? current_count : 0},
      ${launch_date ? String(launch_date) : null},
      ${typeof order_index === 'number' ? order_index : 0}
    )
    RETURNING *
  `;

  await logAdminAction(userId, 'beta_created', 'beta', String(created[0].id), {
    name: String(name),
    status: status ? String(status) : 'soon',
  });
  return NextResponse.json(created[0], { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { userId, allowed } = await ensureAdmin();
  if (!allowed || !userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const {
    betaId,
    name,
    description,
    status,
    max_testers,
    current_count,
    launch_date,
    order_index,
  } = body as {
    betaId?: number;
    name?: string;
    description?: string;
    status?: string;
    max_testers?: number;
    current_count?: number;
    launch_date?: string;
    order_index?: number;
  };
  if (!betaId) return NextResponse.json({ error: 'betaId requerido' }, { status: 400 });

  const updated = await sql`
    UPDATE betas
    SET
      name = COALESCE(${name ? String(name) : null}, name),
      description = COALESCE(${description ? String(description) : null}, description),
      status = COALESCE(${status ? String(status) : null}, status),
      max_testers = COALESCE(${typeof max_testers === 'number' ? max_testers : null}, max_testers),
      current_count = COALESCE(${typeof current_count === 'number' ? current_count : null}, current_count),
      launch_date = COALESCE(${launch_date ? String(launch_date) : null}, launch_date),
      order_index = COALESCE(${typeof order_index === 'number' ? order_index : null}, order_index)
    WHERE id = ${betaId}
    RETURNING *
  `;

  if (!updated[0]) return NextResponse.json({ error: 'Beta no encontrada' }, { status: 404 });

  await logAdminAction(userId, 'beta_updated', 'beta', String(betaId), {
    name,
    description,
    status,
    max_testers,
    current_count,
    launch_date,
    order_index,
  });
  return NextResponse.json(updated[0]);
}

export async function DELETE(req: NextRequest) {
  const { userId, allowed } = await ensureAdmin();
  if (!allowed || !userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { betaId } = await req.json();
  if (!betaId) return NextResponse.json({ error: 'betaId requerido' }, { status: 400 });

  const deleted = await sql`DELETE FROM betas WHERE id = ${betaId} RETURNING id`;
  if (!deleted[0]) return NextResponse.json({ error: 'Beta no encontrada' }, { status: 404 });

  await logAdminAction(userId, 'beta_deleted', 'beta', String(betaId));
  return NextResponse.json({ ok: true });
}
