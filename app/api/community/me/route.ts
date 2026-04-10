import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import {
  getMemberByClerkId,
  updateMember,
  updateMemberAvatar,
} from '@/lib/community/members';
import sql from '@/lib/db';
import type { AvatarSource } from '@/lib/community/types';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const member = await getMemberByClerkId(userId);
  if (!member) return NextResponse.json({ error: 'Miembro no encontrado' }, { status: 404 });

  return NextResponse.json(member);
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const body = await req.json();
  const {
    avatar_source,
    preset_avatar_id,
    name,
    company,
    job_title,
    country,
    linkedin_url,
    bio,
  } = body as {
    avatar_source?: AvatarSource;
    preset_avatar_id?: string | null;
    name?: string;
    company?: string;
    job_title?: string;
    country?: string;
    linkedin_url?: string;
    bio?: string;
  };

  let member = await getMemberByClerkId(userId);
  if (!member) return NextResponse.json({ error: 'Miembro no encontrado' }, { status: 404 });

  const hasProfile =
    name !== undefined ||
    company !== undefined ||
    job_title !== undefined ||
    country !== undefined ||
    linkedin_url !== undefined ||
    bio !== undefined;

  if (hasProfile) {
    const updated = await updateMember(userId, {
      name,
      company,
      job_title,
      country,
      linkedin_url,
      bio,
    });
    if (updated) member = updated;
  }

  if (avatar_source === 'clerk' || avatar_source === 'preset') {
    const client = await clerkClient();
    const cu = await client.users.getUser(userId);
    const clerkImage = cu.imageUrl || null;

    if (avatar_source === 'clerk') {
      const updated = await updateMemberAvatar(userId, {
        avatar_source: 'clerk',
        preset_avatar_id: null,
        clerk_avatar_url: clerkImage,
      });
      if (updated) member = updated;
    } else {
      if (!preset_avatar_id) {
        return NextResponse.json({ error: 'preset_avatar_id requerido para avatar preset' }, { status: 400 });
      }
      const ok = await sql`
        SELECT 1 FROM community_preset_avatars
        WHERE id = ${preset_avatar_id}::uuid AND is_active = true
        LIMIT 1
      `;
      if (!ok.length) {
        return NextResponse.json({ error: 'Avatar preset inválido' }, { status: 400 });
      }
      const updated = await updateMemberAvatar(userId, {
        avatar_source: 'preset',
        preset_avatar_id,
        clerk_avatar_url: clerkImage,
      });
      if (updated) member = updated;
    }
  }

  return NextResponse.json(member);
}
