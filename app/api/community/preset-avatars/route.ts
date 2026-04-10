import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getMemberByClerkId } from '@/lib/community/members';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const member = await getMemberByClerkId(userId);
  if (!member) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const rows = await sql`
    SELECT id, image_url, label, sort_order
    FROM community_preset_avatars
    WHERE is_active = true
    ORDER BY sort_order ASC, created_at ASC
  `;
  return NextResponse.json(rows);
}
