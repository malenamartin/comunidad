'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Video, Users, ExternalLink } from 'lucide-react';
import useSWR from 'swr';
import type { Event } from '@/lib/community/events';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const FORMAT_CONFIG = {
  presencial: { label: 'Presencial', icon: MapPin },
  virtual:    { label: 'Virtual',    icon: Video },
  hibrido:    { label: 'Híbrido',    icon: Users },
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: event } = useSWR<Event>(id ? `/api/community/events/${id}` : null, fetcher);

  if (!event) {
    return (
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ height: '300px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }} />
      </div>
    );
  }

  const date = new Date(event.event_date);
  const isPast = date < new Date();
  const formatConfig = FORMAT_CONFIG[event.format] ?? FORMAT_CONFIG.presencial;
  const FormatIcon = formatConfig.icon;

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 24px' }}>
      <Link href="/comunidad/eventos" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none', marginBottom: '24px' }}>
        <ArrowLeft size={14} /> Volver a Eventos
      </Link>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '28px' }}>
        {/* Date + title */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0, width: '64px', height: '72px', background: isPast ? 'rgba(255,255,255,0.05)' : 'rgba(255,106,0,0.12)', border: `1px solid ${isPast ? 'rgba(255,255,255,0.06)' : 'rgba(255,106,0,0.25)'}`, borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>{date.getDate()}</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#FF6A00', textTransform: 'uppercase' }}>
              {date.toLocaleDateString('es-AR', { month: 'short' })}
            </span>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{date.getFullYear()}</span>
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: '8px', lineHeight: 1.35 }}>
              {event.title}
            </h1>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {event.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                  <MapPin size={12} /> {event.location}{event.country ? `, ${event.country}` : ''}
                </span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                <FormatIcon size={12} /> {formatConfig.label}
              </span>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                {date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {event.description && (
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
            {event.description}
          </p>
        )}

        {/* Speakers */}
        {event.speakers && event.speakers.length > 0 && (
          <div style={{ marginBottom: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>Speakers</h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {event.speakers.map((s) => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '8px 12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,106,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>
                    {s.name[0]}
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#FFFFFF' }}>{s.name}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{s.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing + CTA */}
        <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {event.member_price !== null && !isPast && (
            <div>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#90C050' }}>${event.member_price}</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginLeft: '6px' }}>precio miembro</span>
              {event.public_price && (
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginLeft: '8px', textDecoration: 'line-through' }}>${event.public_price}</span>
              )}
            </div>
          )}
          {!isPast && event.register_url && (
            <a href={event.register_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '8px', background: 'linear-gradient(135deg, #FF6A00, #E05A00)', color: '#FFFFFF', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
              Registrarme <ExternalLink size={13} />
            </a>
          )}
          {isPast && event.recording_url && (
            <a href={event.recording_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '8px', background: 'rgba(128,144,224,0.15)', border: '1px solid rgba(128,144,224,0.3)', color: '#8090E0', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
              Ver grabación <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
