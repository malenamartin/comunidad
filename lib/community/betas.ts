import sql from '@/lib/db';

export interface Beta {
  id: string;
  name: string;
  description: string | null;
  status: 'open' | 'waitlist' | 'soon' | 'closed';
  max_testers: number | null;
  current_count: number;
  launch_date: string | null;
  order_index: number;
  created_at: string;
  // enriched client-side
  user_access_status?: string | null;
}

export interface BetaAccess {
  id: string;
  beta_id: string;
  member_id: string;
  status: 'waitlist' | 'approved' | 'rejected';
  approved_at: string | null;
  created_at: string;
}

export async function listBetas(memberId: string): Promise<Beta[]> {
  return sql<Beta[]>`
    SELECT
      b.*,
      ba.status AS user_access_status
    FROM betas b
    LEFT JOIN beta_access ba ON ba.beta_id = b.id AND ba.member_id = ${memberId}
    ORDER BY b.order_index ASC, b.created_at DESC
  `;
}

export async function requestBetaAccess(
  betaId: string,
  memberId: string
): Promise<{ status: string }> {
  const beta = await sql<Beta[]>`SELECT * FROM betas WHERE id = ${betaId} LIMIT 1`;
  if (!beta[0]) throw new Error('Beta no encontrada');

  const accessStatus = beta[0].status === 'open' ? 'approved' : 'waitlist';

  await sql`
    INSERT INTO beta_access (beta_id, member_id, status, approved_at)
    VALUES (
      ${betaId}, ${memberId}, ${accessStatus},
      ${accessStatus === 'approved' ? new Date().toISOString() : null}
    )
    ON CONFLICT (beta_id, member_id) DO NOTHING
  `;

  if (accessStatus === 'approved') {
    await sql`
      UPDATE betas SET current_count = current_count + 1 WHERE id = ${betaId}
    `;
  }

  return { status: accessStatus };
}

export async function getMyBetaAccess(memberId: string): Promise<BetaAccess[]> {
  return sql<BetaAccess[]>`
    SELECT ba.*, b.name AS beta_name
    FROM beta_access ba
    JOIN betas b ON ba.beta_id = b.id
    WHERE ba.member_id = ${memberId} AND ba.status = 'approved'
    ORDER BY ba.approved_at DESC
  `;
}
