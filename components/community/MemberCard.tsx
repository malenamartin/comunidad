import Link from 'next/link';
import { MemberAvatar } from './MemberAvatar';
import type { CommunityMember } from '@/lib/community/types';

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  invisible: { label: 'Invisible', color: 'rgba(255,255,255,0.3)' },
  visible:   { label: 'Visible',   color: '#90C050' },
  referente: { label: 'Referente', color: '#C8A040' },
  embajador: { label: 'Embajador', color: '#FF6A00' },
};

interface MemberCardProps {
  member: CommunityMember;
}

export function MemberCard({ member }: MemberCardProps) {
  const levelStyle = LEVEL_LABELS[member.level] ?? LEVEL_LABELS.invisible;

  return (
    <Link href={`/comunidad/miembros/${member.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '0.5px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '20px',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '10px',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
      >
        <MemberAvatar name={member.name} size={48} />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>{member.name}</span>
            {member.is_founder && (
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#FF6A00', background: 'rgba(255,106,0,0.12)', border: '1px solid rgba(255,106,0,0.25)', borderRadius: '3px', padding: '1px 5px' }}>
                FUNDADOR
              </span>
            )}
          </div>
          {member.job_title && (
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>{member.job_title}</p>
          )}
          {member.company && (
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{member.company}</p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: levelStyle.color }}>
            {levelStyle.label}
          </span>
          {member.country && (
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>· {member.country}</span>
          )}
        </div>
      </article>
    </Link>
  );
}
