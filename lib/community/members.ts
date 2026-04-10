import sql from '@/lib/db';
import type { AvatarSource, CommunityMember, MemberLevel } from './types';

export async function getMemberByClerkId(clerkUserId: string): Promise<CommunityMember | null> {
  const rows = await sql<CommunityMember[]>`
    SELECT * FROM community_members
    WHERE clerk_user_id = ${clerkUserId} AND is_active = true
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getMemberById(id: string): Promise<CommunityMember | null> {
  const rows = await sql<CommunityMember[]>`
    SELECT * FROM community_members
    WHERE id = ${id} AND is_active = true
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function countMembers(): Promise<number> {
  const rows = await sql<[{ count: string }]>`SELECT COUNT(*) as count FROM community_members`;
  return parseInt(rows[0].count, 10);
}

export async function createMember(data: {
  clerk_user_id: string;
  email: string;
  name: string;
  company?: string;
  job_title?: string;
  country?: string;
  invite_code_used?: string;
  is_founder: boolean;
}): Promise<CommunityMember> {
  const rows = await sql<CommunityMember[]>`
    INSERT INTO community_members
      (clerk_user_id, email, name, company, job_title, country, invite_code_used, is_founder)
    VALUES
      (${data.clerk_user_id}, ${data.email}, ${data.name},
       ${data.company ?? null}, ${data.job_title ?? null}, ${data.country ?? null},
       ${data.invite_code_used ?? null}, ${data.is_founder})
    RETURNING *
  `;
  return rows[0];
}

export async function updateMember(
  clerkUserId: string,
  data: Partial<Pick<CommunityMember, 'name' | 'company' | 'job_title' | 'country' | 'linkedin_url' | 'bio'>>
): Promise<CommunityMember | null> {
  if (Object.keys(data).length === 0) return getMemberByClerkId(clerkUserId);

  // Always update all optional fields to avoid dynamic query building
  const rows = await sql<CommunityMember[]>`
    UPDATE community_members
    SET
      name         = COALESCE(${data.name         ?? null}, name),
      company      = COALESCE(${data.company      ?? null}, company),
      job_title    = COALESCE(${data.job_title    ?? null}, job_title),
      country      = COALESCE(${data.country      ?? null}, country),
      linkedin_url = COALESCE(${data.linkedin_url ?? null}, linkedin_url),
      bio          = COALESCE(${data.bio          ?? null}, bio),
      updated_at   = NOW()
    WHERE clerk_user_id = ${clerkUserId}
    RETURNING *
  `;
  return rows[0] ?? null;
}

export async function updateMemberAvatar(
  clerkUserId: string,
  data: {
    avatar_source: AvatarSource;
    preset_avatar_id: string | null;
    clerk_avatar_url: string | null;
  },
): Promise<CommunityMember | null> {
  const rows = await sql<CommunityMember[]>`
    UPDATE community_members
    SET
      avatar_source = ${data.avatar_source},
      preset_avatar_id = ${data.preset_avatar_id},
      clerk_avatar_url = ${data.clerk_avatar_url},
      updated_at = NOW()
    WHERE clerk_user_id = ${clerkUserId}
    RETURNING *
  `;
  return rows[0] ?? null;
}

export function recalculateLevel(points: number): MemberLevel {
  if (points >= 1000) return 'embajador';
  if (points >= 500) return 'referente';
  if (points >= 200) return 'visible';
  return 'invisible';
}
