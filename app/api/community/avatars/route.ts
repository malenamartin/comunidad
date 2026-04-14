import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getMemberByClerkId } from '@/lib/community/members';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const member = await getMemberByClerkId(userId);
  if (!member) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const presets = await sql`
    SELECT id, name, image_url, order_index
    FROM community_avatar_presets
    WHERE is_active = true
    ORDER BY order_index ASC, created_at DESC
  `;

  const current = await sql`
    SELECT preset_id, custom_avatar_url
    FROM member_avatar_selection
    WHERE member_id = ${member.id}
    LIMIT 1
  `;

  return NextResponse.json({
    presets,
    selected: current[0] ?? { preset_id: null, custom_avatar_url: null },
  });
}

