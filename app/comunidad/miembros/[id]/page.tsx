'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Linkedin } from 'lucide-react';
import useSWR from 'swr';
import { MemberAvatar } from '@/components/community/MemberAvatar';
import type { CommunityMember } from '@/lib/community/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  invisible: { label: 'Invisible', color: 'rgba(255,255,255,0.4)' },
  visible:   { label: 'Visible',   color: '#90C050' },
  referente: { label: 'Referente', color: '#C8A040' },
  embajador: { label: 'Embajador', color: '#D44A30' },
};

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: member } = useSWR<CommunityMember>(id ? `/api/community/members/${id}` : null, fetcher);

  if (!member) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ height: '200px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }} />
      </div>
    );
  }

  const levelStyle = LEVEL_LABELS[member.level] ?? LEVEL_LABELS.invisible;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
      <Link href="/comunidad/miembros" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none', marginBottom: '24px' }}>
        <ArrowLeft size={14} /> Volver al directorio
      </Link>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '28px' }}>
        {/* Avatar + info */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px' }}>
          <MemberAvatar name={member.name} size={64} />
          <div style={{ marginTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF' }}>{member.name}</h1>
              {member.is_founder && (
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#D44A30', background: 'rgba(212,74,48,0.12)', border: '1px solid rgba(212,74,48,0.25)', borderRadius: '3px', padding: '2px 6px' }}>
                  FUNDADOR
                </span>
              )}
            </div>
            {member.job_title && (
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>{member.job_title}</p>
            )}
            {member.company && (
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)' }}>{member.company}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '18px', fontWeight: 700, color: levelStyle.color }}>{levelStyle.label}</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>Nivel</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>{member.points}</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>Puntos</p>
          </div>
          {member.country && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>{member.country}</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>País</p>
            </div>
          )}
        </div>

        {/* Bio */}
        {member.bio && (
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
            {member.bio}
          </p>
        )}

        {/* LinkedIn */}
        {member.linkedin_url && (
          <a
            href={member.linkedin_url.startsWith('http') ? member.linkedin_url : `https://${member.linkedin_url}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', background: 'rgba(10,102,194,0.15)', border: '1px solid rgba(10,102,194,0.3)', color: '#5BA4CF', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}
          >
            <Linkedin size={14} /> Ver LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}
