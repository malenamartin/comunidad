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

  const members = await sql<CommunityMember[]>`
    SELECT * FROM community_members
    WHERE is_active = true ${countryFilter}
    ORDER BY is_founder DESC, points DESC, created_at ASC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const countRows = await sql<[{ count: string }]>`
    SELECT COUNT(*) as count FROM community_members
    WHERE is_active = true ${countryFilter}
  `;

  return { members, total: parseInt(countRows[0].count, 10) };
}

export async function getPublicMemberById(id: string): Promise<CommunityMember | null> {
  const rows = await sql<CommunityMember[]>`
    SELECT * FROM community_members WHERE id = ${id} AND is_active = true LIMIT 1
  `;
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
