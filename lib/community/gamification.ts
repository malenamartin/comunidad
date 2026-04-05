import sql from '@/lib/db';

export type PointAction =
  | 'post_created' | 'comment_created' | 'reaction_received'
  | 'video_completed' | 'profile_completed' | 'invite_accepted'
  | 'daily_login' | 'benchmark_viewed' | 'event_attended';

export const POINT_VALUES: Record<PointAction, number> = {
  post_created:      20,
  comment_created:   10,
  reaction_received:  5,
  video_completed:   30,
  profile_completed: 50,
  invite_accepted:   40,
  daily_login:        5,
  benchmark_viewed:   3,
  event_attended:    25,
};

export const LEVELS = [
  { slug: 'bronze',   label: 'Bronze',   min: 0    },
  { slug: 'silver',   label: 'Silver',   min: 250  },
  { slug: 'gold',     label: 'Gold',     min: 1000 },
  { slug: 'platinum', label: 'Platinum', min: 5000 },
];

export function getLevelFromPoints(pts: number) {
  return [...LEVELS].reverse().find((l) => pts >= l.min) ?? LEVELS[0];
}

export async function awardPoints(
  memberId: number,
  action: PointAction,
  referenceId?: number,
) {
  const points = POINT_VALUES[action];
  await sql`
    INSERT INTO member_points_log (member_id, action, points, reference_id)
    VALUES (${memberId}, ${action}, ${points}, ${referenceId ?? null})
  `;
  return points;
}

export async function getLeaderboard(limit = 20) {
  const rows = await sql`
    SELECT
      cm.id, cm.name, cm.company, cm.job_title, cm.country,
      cm.total_points, cm.level,
      RANK() OVER (ORDER BY cm.total_points DESC) AS rank
    FROM community_members cm
    WHERE cm.status = 'active'
    ORDER BY cm.total_points DESC
    LIMIT ${limit}
  `;
  return rows;
}

export async function getMemberRank(memberId: number) {
  const rows = await sql`
    SELECT rank FROM (
      SELECT id, RANK() OVER (ORDER BY total_points DESC) AS rank
      FROM community_members WHERE status = 'active'
    ) sub
    WHERE id = ${memberId}
  `;
  return rows[0]?.rank ?? null;
}

export async function getMemberBadges(memberId: number) {
  return sql`
    SELECT b.slug, b.name, b.description, b.icon, mb.awarded_at
    FROM member_badges mb
    JOIN badges b ON b.id = mb.badge_id
    WHERE mb.member_id = ${memberId}
    ORDER BY mb.awarded_at DESC
  `;
}

export async function awardBadge(memberId: number, badgeSlug: string) {
  await sql`
    INSERT INTO member_badges (member_id, badge_id)
    SELECT ${memberId}, id FROM badges WHERE slug = ${badgeSlug}
    ON CONFLICT DO NOTHING
  `;
}

export async function getMemberPoints(memberId: number) {
  const rows = await sql`
    SELECT total_points, level FROM community_members WHERE id = ${memberId}
  `;
  return rows[0] ?? { total_points: 0, level: 'bronze' };
}

export async function getPointsHistory(memberId: number, limit = 20) {
  return sql`
    SELECT action, points, reference_id, created_at
    FROM member_points_log
    WHERE member_id = ${memberId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
}
