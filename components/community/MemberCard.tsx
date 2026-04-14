import Link from 'next/link';
import { MemberAvatar } from './MemberAvatar';
import type { CommunityMember } from '@/lib/community/types';

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  invisible: { label: 'En progreso', color: 'var(--fardo-color-text-muted)' },
  visible:   { label: 'Visible', color: '#90C050' },
  referente: { label: 'Referente', color: '#C8A040' },
  embajador: { label: 'Embajador', color: 'var(--fardo-orange-400)' },
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
          background: 'var(--fardo-color-bg-base)',
          border: '0.5px solid var(--fardo-color-border-default)',
          borderRadius: '16px',
          padding: '20px',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease, transform 0.15s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '10px',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--fardo-color-border-brand)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--fardo-color-border-default)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}
      >
        <MemberAvatar name={member.name} size={48} avatarUrl={member.avatar_url} />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--fardo-color-text-primary)' }}>{member.name}</span>
            {member.is_founder && (
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--fardo-orange-400)', background: 'rgba(255,106,0,0.12)', border: '1px solid rgba(255,106,0,0.25)', borderRadius: '3px', padding: '1px 5px' }}>
                FUNDADOR
              </span>
            )}
          </div>
          {member.job_title && (
            <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-secondary)', marginBottom: '2px' }}>{member.job_title}</p>
          )}
          {member.company && (
            <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-muted)' }}>{member.company}</p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: levelStyle.color }}>
            {levelStyle.label}
          </span>
          {member.country && (
            <span style={{ fontSize: '11px', color: 'var(--fardo-color-text-muted)' }}>· {member.country}</span>
          )}
        </div>
      </article>
    </Link>
  );
}
