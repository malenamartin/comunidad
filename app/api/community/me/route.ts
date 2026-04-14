import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getMemberByClerkId, updateMember, upsertMemberAvatarSelection } from '@/lib/community/members';

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
  const { name, company, job_title, country, linkedin_url, bio, preset_avatar_id, custom_avatar_url } = body as {
    name?: string;
    company?: string;
    job_title?: string;
    country?: string;
    linkedin_url?: string;
    bio?: string;
    preset_avatar_id?: number | null;
    custom_avatar_url?: string | null;
  };

  const updated = await updateMember(userId, { name, company, job_title, country, linkedin_url, bio });
  if (!updated) return NextResponse.json({ error: 'Miembro no encontrado' }, { status: 404 });

  try {
    if (typeof preset_avatar_id === 'number' || preset_avatar_id === null || typeof custom_avatar_url === 'string' || custom_avatar_url === null) {
      await upsertMemberAvatarSelection({
        memberId: updated.id,
        presetId: typeof preset_avatar_id === 'number' ? preset_avatar_id : null,
        customAvatarUrl: typeof custom_avatar_url === 'string' ? custom_avatar_url : null,
      });
    }
  } catch {
    // No-op to keep backward compatibility if avatar tables are missing.
  }

  const fresh = await getMemberByClerkId(userId);
  return NextResponse.json(fresh ?? updated);
}
