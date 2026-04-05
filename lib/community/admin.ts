import sql from '@/lib/db';

export async function isAdmin(sessionClaims: Record<string, unknown> | null) {
  const roles = ((sessionClaims?.metadata as Record<string, unknown>)?.roles as string[]) ?? [];
  return roles.includes('admin');
}

export async function getAdminStats() {
  const [members, pending, posts, videos] = await Promise.all([
    sql`SELECT COUNT(*) AS cnt FROM community_members WHERE status = 'active'`,
    sql`SELECT COUNT(*) AS cnt FROM access_requests WHERE status = 'pending'`,
    sql`SELECT COUNT(*) AS cnt FROM posts`,
    sql`SELECT COUNT(*) AS cnt FROM videos`,
  ]);
  return {
    activeMembers: Number(members[0].cnt),
    pendingRequests: Number(pending[0].cnt),
    totalPosts: Number(posts[0].cnt),
    totalVideos: Number(videos[0].cnt),
  };
}

export async function getAllMembers(page = 1, limit = 30) {
  const offset = (page - 1) * limit;
  return sql`
    SELECT id, name, email, company, job_title, country, status,
           total_points, level, created_at
    FROM community_members
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
}

export async function updateMemberStatus(memberId: number, status: 'active' | 'suspended') {
  return sql`
    UPDATE community_members SET status = ${status} WHERE id = ${memberId} RETURNING id
  `;
}

export async function getPendingRequests() {
  return sql`
    SELECT id, name, email, company, job_title, country, linkedin_url, created_at
    FROM access_requests
    WHERE status = 'pending'
    ORDER BY created_at ASC
  `;
}

export async function resolveRequest(requestId: number, action: 'approve' | 'reject') {
  return sql`
    UPDATE access_requests
    SET status = ${action === 'approve' ? 'approved' : 'rejected'},
        resolved_at = NOW()
    WHERE id = ${requestId}
    RETURNING id
  `;
}

export async function getInviteCodes() {
  return sql`
    SELECT ic.id, ic.code, ic.max_uses, ic.used_count, ic.expires_at,
           ic.is_active, ic.created_at,
           cm.name AS created_by_name
    FROM invite_codes ic
    LEFT JOIN community_members cm ON cm.id = ic.created_by
    ORDER BY ic.created_at DESC
  `;
}

export async function createInviteCode(code: string, maxUses: number, expiresAt: string | null) {
  return sql`
    INSERT INTO invite_codes (code, max_uses, expires_at)
    VALUES (${code}, ${maxUses}, ${expiresAt ?? null})
    RETURNING *
  `;
}

export async function toggleInviteCode(codeId: number, active: boolean) {
  return sql`
    UPDATE invite_codes SET is_active = ${active} WHERE id = ${codeId} RETURNING id
  `;
}

export async function getRecentPosts(limit = 50) {
  return sql`
    SELECT p.id, p.content, p.created_at, p.is_pinned,
           cm.name AS author_name,
           (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count,
           (SELECT COUNT(*) FROM reactions r WHERE r.post_id = p.id) AS reaction_count
    FROM posts p
    JOIN community_members cm ON cm.id = p.author_id
    ORDER BY p.created_at DESC
    LIMIT ${limit}
  `;
}

export async function deletePost(postId: number) {
  return sql`DELETE FROM posts WHERE id = ${postId} RETURNING id`;
}

export async function togglePinPost(postId: number, pinned: boolean) {
  return sql`UPDATE posts SET is_pinned = ${pinned} WHERE id = ${postId} RETURNING id`;
}

export async function logAdminAction(
  adminId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  details?: object,
) {
  await sql`
    INSERT INTO admin_log (admin_id, action, target_type, target_id, details)
    VALUES (${adminId}, ${action}, ${targetType ?? null}, ${targetId ?? null}, ${details ? JSON.stringify(details) : null})
  `;
}
