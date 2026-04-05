import sql from '@/lib/db';

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  country: string | null;
  format: 'presencial' | 'virtual' | 'hibrido';
  speakers: { name: string; title: string; avatar_url?: string }[] | null;
  register_url: string | null;
  recording_url: string | null;
  member_price: number | null;
  public_price: number | null;
  is_published: boolean;
  created_at: string;
}

export async function listEvents(filter?: 'upcoming' | 'past'): Promise<Event[]> {
  const now = new Date().toISOString();
  const dateFilter =
    filter === 'upcoming'
      ? sql`AND event_date >= ${now}`
      : filter === 'past'
      ? sql`AND event_date < ${now}`
      : sql``;

  return sql<Event[]>`
    SELECT * FROM events
    WHERE is_published = true ${dateFilter}
    ORDER BY event_date ${filter === 'past' ? sql`DESC` : sql`ASC`}
  `;
}

export async function getEventById(id: string): Promise<Event | null> {
  const rows = await sql<Event[]>`
    SELECT * FROM events WHERE id = ${id} AND is_published = true LIMIT 1
  `;
  return rows[0] ?? null;
}
