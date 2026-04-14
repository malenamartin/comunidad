'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { EventCard } from '@/components/community/EventCard';
import type { Event } from '@/lib/community/events';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function EventosPage() {
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

  const { data: events, isLoading } = useSWR<Event[]>(
    `/api/community/events?filter=${filter}`,
    fetcher
  );

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 16px', borderRadius: '8px', border: 'none',
    cursor: 'pointer', fontSize: '13px',
    fontWeight: active ? 600 : 400,
    color: active ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
    background: active ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: '4px' }}>
          Eventos
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
          Sesiones para aprender, debatir y salir con ideas aplicables.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
        <button onClick={() => setFilter('upcoming')} style={tabStyle(filter === 'upcoming')}>Próximos</button>
        <button onClick={() => setFilter('past')} style={tabStyle(filter === 'past')}>Pasados</button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ height: '90px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '12px' }} />
          ))}
        </div>
      ) : !events?.length ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'rgba(255,255,255,0.3)' }}>
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>📅</p>
          <p style={{ fontSize: '15px' }}>
            {filter === 'upcoming' ? 'No hay eventos próximos por ahora.' : 'Todavía no hay eventos pasados cargados.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
