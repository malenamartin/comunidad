import sql from '@/lib/db';
import type { Post, Comment, PostType } from './types';

/** Resuelve URL de avatar para mostrar en feed (requiere migración 004). */
const AUTHOR_AVATAR_SQL = sql`
  (
    CASE
      WHEN m.avatar_source = 'preset' AND m.preset_avatar_id IS NOT NULL THEN
        (SELECT pa.image_url FROM community_preset_avatars pa
         WHERE pa.id = m.preset_avatar_id AND pa.is_active = true LIMIT 1)
      ELSE m.clerk_avatar_url
    END
  )
`;

export async function listPosts(opts: {
  type?: PostType;
  page?: number;
  limit?: number;
  memberId?: string;
}): Promise<{ posts: Post[]; total: number }> {
  const limit = opts.limit ?? 20;
  const offset = ((opts.page ?? 1) - 1) * limit;

  const typeFilter = opts.type
    ? sql`AND p.post_type = ${opts.type}`
    : sql``;

  const posts = await sql<Post[]>`
    SELECT
      p.id, p.author_id, p.title, p.body, p.post_type,
      p.is_pinned, p.is_published, p.views, p.created_at, p.updated_at,
      m.name AS author_name,
      m.company AS author_company,
      m.is_founder AS author_is_founder,
      ${AUTHOR_AVATAR_SQL} AS author_avatar_url,
      COUNT(DISTINCT r.id)::int AS likes_count,
      COUNT(DISTINCT c.id)::int AS comments_count,
      CASE WHEN ${opts.memberId ?? null} IS NOT NULL
        THEN EXISTS(
          SELECT 1 FROM reactions
          WHERE post_id = p.id AND member_id = ${opts.memberId ?? null}
        )
        ELSE false
      END AS user_liked
    FROM posts p
    JOIN community_members m ON p.author_id = m.id
    LEFT JOIN reactions r ON r.post_id = p.id
    LEFT JOIN comments c ON c.post_id = p.id AND c.is_published = true
    WHERE p.is_published = true ${typeFilter}
    GROUP BY p.id, m.id, m.name, m.company, m.is_founder,
      m.avatar_source, m.preset_avatar_id, m.clerk_avatar_url
    ORDER BY p.is_pinned DESC, p.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const countRows = await sql<[{ count: string }]>`
    SELECT COUNT(*) as count FROM posts p
    WHERE p.is_published = true ${typeFilter}
  `;

  return { posts, total: parseInt(countRows[0].count, 10) };
}

export async function getPostById(id: string, memberId?: string): Promise<Post | null> {
  const rows = await sql<Post[]>`
    SELECT
      p.id, p.author_id, p.title, p.body, p.post_type,
      p.is_pinned, p.is_published, p.views, p.created_at, p.updated_at,
      m.name AS author_name,
      m.company AS author_company,
      m.is_founder AS author_is_founder,
      ${AUTHOR_AVATAR_SQL} AS author_avatar_url,
      COUNT(DISTINCT r.id)::int AS likes_count,
      COUNT(DISTINCT c.id)::int AS comments_count,
      CASE WHEN ${memberId ?? null} IS NOT NULL
        THEN EXISTS(
          SELECT 1 FROM reactions
          WHERE post_id = p.id AND member_id = ${memberId ?? null}
        )
        ELSE false
      END AS user_liked
    FROM posts p
    JOIN community_members m ON p.author_id = m.id
    LEFT JOIN reactions r ON r.post_id = p.id
    LEFT JOIN comments c ON c.post_id = p.id AND c.is_published = true
    WHERE p.id = ${id} AND p.is_published = true
    GROUP BY p.id, m.id, m.name, m.company, m.is_founder,
      m.avatar_source, m.preset_avatar_id, m.clerk_avatar_url
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function incrementViews(postId: string): Promise<void> {
  await sql`UPDATE posts SET views = views + 1 WHERE id = ${postId}`;
}

export async function toggleReaction(
  postId: string,
  memberId: string
): Promise<{ liked: boolean }> {
  const existing = await sql`
    SELECT id FROM reactions WHERE post_id = ${postId} AND member_id = ${memberId}
  `;
  if (existing.length > 0) {
    await sql`DELETE FROM reactions WHERE post_id = ${postId} AND member_id = ${memberId}`;
    return { liked: false };
  } else {
    await sql`INSERT INTO reactions (post_id, member_id) VALUES (${postId}, ${memberId})`;
    return { liked: true };
  }
}

export async function getComments(postId: string): Promise<Comment[]> {
  const rows = await sql<Comment[]>`
    SELECT
      c.id, c.post_id, c.author_id, c.parent_id, c.body, c.created_at,
      m.name AS author_name,
      (
        CASE
          WHEN m.avatar_source = 'preset' AND m.preset_avatar_id IS NOT NULL THEN
            (SELECT pa.image_url FROM community_preset_avatars pa
             WHERE pa.id = m.preset_avatar_id AND pa.is_active = true LIMIT 1)
          ELSE m.clerk_avatar_url
        END
      ) AS author_avatar_url
    FROM comments c
    JOIN community_members m ON c.author_id = m.id
    WHERE c.post_id = ${postId} AND c.is_published = true
    ORDER BY c.created_at ASC
  `;

  // Build nested structure (one level deep)
  const topLevel: Comment[] = [];
  const byId = new Map<string, Comment>();

  for (const row of rows) {
    row.replies = [];
    byId.set(row.id, row);
  }
  for (const row of rows) {
    if (row.parent_id && byId.has(row.parent_id)) {
      byId.get(row.parent_id)!.replies!.push(row);
    } else if (!row.parent_id) {
      topLevel.push(row);
    }
  }
  return topLevel;
}

export async function addComment(data: {
  post_id: string;
  author_id: string;
  body: string;
  parent_id?: string;
}): Promise<Comment> {
  const rows = await sql<Comment[]>`
    INSERT INTO comments (post_id, author_id, body, parent_id)
    VALUES (
      ${data.post_id}, ${data.author_id}, ${data.body},
      ${data.parent_id ?? null}
    )
    RETURNING
      id, post_id, author_id, parent_id, body, created_at,
      (SELECT name FROM community_members WHERE id = ${data.author_id}) AS author_name,
      (
        SELECT (
          CASE
            WHEN cm.avatar_source = 'preset' AND cm.preset_avatar_id IS NOT NULL THEN
              (SELECT pa.image_url FROM community_preset_avatars pa
               WHERE pa.id = cm.preset_avatar_id AND pa.is_active = true LIMIT 1)
            ELSE cm.clerk_avatar_url
          END
        )
        FROM community_members cm WHERE cm.id = ${data.author_id}
      ) AS author_avatar_url
  `;
  return rows[0];
}

export async function createPost(data: {
  author_id: string;
  title: string;
  body: string;
  post_type: PostType;
}): Promise<Post> {
  const rows = await sql<Post[]>`
    INSERT INTO posts (author_id, title, body, post_type)
    VALUES (${data.author_id}, ${data.title}, ${data.body}, ${data.post_type})
    RETURNING
      id, author_id, title, body, post_type, is_pinned, is_published,
      views, created_at, updated_at,
      (SELECT name FROM community_members WHERE id = ${data.author_id}) AS author_name,
      (SELECT company FROM community_members WHERE id = ${data.author_id}) AS author_company,
      (SELECT is_founder FROM community_members WHERE id = ${data.author_id}) AS author_is_founder,
      (
        SELECT (
          CASE
            WHEN cm.avatar_source = 'preset' AND cm.preset_avatar_id IS NOT NULL THEN
              (SELECT pa.image_url FROM community_preset_avatars pa
               WHERE pa.id = cm.preset_avatar_id AND pa.is_active = true LIMIT 1)
            ELSE cm.clerk_avatar_url
          END
        )
        FROM community_members cm WHERE cm.id = ${data.author_id}
      ) AS author_avatar_url,
      0 AS likes_count,
      0 AS comments_count,
      false AS user_liked
  `;
  return rows[0];
}
