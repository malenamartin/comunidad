import Link from 'next/link';
import { MapPin, Video, Users } from 'lucide-react';
import type { Event } from '@/lib/community/events';

const FORMAT_CONFIG = {
  presencial: { label: 'Presencial', icon: MapPin },
  virtual:    { label: 'Virtual',    icon: Video },
  hibrido:    { label: 'Híbrido',    icon: Users },
};

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const date = new Date(event.event_date);
  const isPast = date < new Date();
  const formatConfig = FORMAT_CONFIG[event.format] ?? FORMAT_CONFIG.presencial;
  const FormatIcon = formatConfig.icon;

  return (
    <Link href={`/comunidad/eventos/${event.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '0.5px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '20px',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease',
          display: 'flex',
          gap: '16px',
          opacity: isPast ? 0.6 : 1,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
      >
        {/* Date block */}
        <div
          style={{
            flexShrink: 0, width: '52px', height: '60px',
            background: isPast ? 'rgba(255,255,255,0.05)' : 'rgba(212,74,48,0.12)',
            border: `1px solid ${isPast ? 'rgba(255,255,255,0.06)' : 'rgba(212,74,48,0.25)'}`,
            borderRadius: '10px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '22px', fontWeight: 800, color: isPast ? 'rgba(255,255,255,0.4)' : '#FFFFFF', lineHeight: 1 }}>
            {date.getDate()}
          </span>
          <span style={{ fontSize: '10px', fontWeight: 600, color: isPast ? 'rgba(255,255,255,0.3)' : '#D44A30', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {date.toLocaleDateString('es-AR', { month: 'short' })}
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px', lineHeight: 1.35 }}>
            {event.title}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            {event.location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                <MapPin size={11} /> {event.location}{event.country ? `, ${event.country}` : ''}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              <FormatIcon size={11} /> {formatConfig.label}
            </span>
          </div>

          {/* Member price */}
          {event.member_price !== null && !isPast && (
            <div style={{ marginTop: '8px' }}>
              <span
                style={{
                  fontSize: '11px', fontWeight: 600,
                  color: '#90C050', background: 'rgba(120,180,60,0.12)',
                  borderRadius: '4px', padding: '2px 8px',
                }}
              >
                Miembros: ${event.member_price}
                {event.public_price ? ` (público: $${event.public_price})` : ''}
              </span>
            </div>
          )}

          {isPast && event.recording_url && (
            <span style={{ fontSize: '11px', color: '#8090E0', marginTop: '6px', display: 'block' }}>
              ▶ Grabación disponible
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
