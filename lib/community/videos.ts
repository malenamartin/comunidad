import sql from '@/lib/db';
import type { Video } from './types';

export async function listVideos(opts: {
  category?: string;
  level?: string;
}): Promise<Video[]> {
  const categoryFilter = opts.category ? sql`AND category = ${opts.category}` : sql``;
  const levelFilter = opts.level ? sql`AND level = ${opts.level}` : sql``;

  return sql<Video[]>`
    SELECT * FROM videos
    WHERE is_published = true ${categoryFilter} ${levelFilter}
    ORDER BY order_index ASC, created_at DESC
  `;
}

export async function getVideoById(id: string): Promise<Video | null> {
  const rows = await sql<Video[]>`
    SELECT * FROM videos WHERE id = ${id} AND is_published = true LIMIT 1
  `;
  return rows[0] ?? null;
}
