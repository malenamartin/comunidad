import sql from '@/lib/db';
import type { CommunityMember } from './types';

export async function listMembers(opts: {
  country?: string;
  page?: number;
  limit?: number;
}): Promise<{ members: CommunityMember[]; total: number }> {
  const limit = opts.limit ?? 24;
  const offset = ((opts.page ?? 1) - 1) * limit;
  const countryFilter = opts.country ? sql`AND country = ${opts.country}` : sql``;

  let members: CommunityMember[];
  try {
    members = await sql<CommunityMember[]>`
      SELECT
        cm.*,
        mas.preset_id AS preset_avatar_id,
        COALESCE(mas.custom_avatar_url, cap.image_url) AS avatar_url
      FROM community_members cm
      LEFT JOIN member_avatar_selection mas ON mas.member_id = cm.id
      LEFT JOIN community_avatar_presets cap ON cap.id = mas.preset_id
      WHERE cm.is_active = true ${countryFilter}
      ORDER BY cm.is_founder DESC, cm.points DESC, cm.created_at ASC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } catch {
    members = await sql<CommunityMember[]>`
      SELECT * FROM community_members
      WHERE is_active = true ${countryFilter}
      ORDER BY is_founder DESC, points DESC, created_at ASC
      LIMIT ${limit} OFFSET ${offset}
    `;
  }

  const countRows = await sql<[{ count: string }]>`
    SELECT COUNT(*) as count FROM community_members
    WHERE is_active = true ${countryFilter}
  `;

  return { members, total: parseInt(countRows[0].count, 10) };
}

export async function getPublicMemberById(id: string): Promise<CommunityMember | null> {
  let rows: CommunityMember[];
  try {
    rows = await sql<CommunityMember[]>`
      SELECT
        cm.*,
        mas.preset_id AS preset_avatar_id,
        COALESCE(mas.custom_avatar_url, cap.image_url) AS avatar_url
      FROM community_members cm
      LEFT JOIN member_avatar_selection mas ON mas.member_id = cm.id
      LEFT JOIN community_avatar_presets cap ON cap.id = mas.preset_id
      WHERE cm.id = ${id} AND cm.is_active = true
      LIMIT 1
    `;
  } catch {
    rows = await sql<CommunityMember[]>`
      SELECT * FROM community_members WHERE id = ${id} AND is_active = true LIMIT 1
    `;
  }
  return rows[0] ?? null;
}

export async function listCountries(): Promise<string[]> {
  const rows = await sql<{ country: string }[]>`
    SELECT DISTINCT country FROM community_members
    WHERE is_active = true AND country IS NOT NULL
    ORDER BY country ASC
  `;
  return rows.map((r) => r.country);
}
