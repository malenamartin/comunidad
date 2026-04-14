'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { MemberCard } from '@/components/community/MemberCard';
import type { CommunityMember } from '@/lib/community/types';
import { mockMembers } from '@/lib/community/mockData';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function MiembrosPage() {
  const [country, setCountry] = useState('');

  const { data: countriesData } = useSWR<string[]>('/api/community/members/countries', fetcher);
  const url = country
    ? `/api/community/members?country=${encodeURIComponent(country)}`
    : '/api/community/members';
  const { data, isLoading } = useSWR<{ members: CommunityMember[]; total: number }>(url, fetcher);
  const members = useMemo(() => {
    if (data?.members?.length) return data.members;
    return country ? mockMembers.filter((m) => m.country === country) : mockMembers;
  }, [data?.members, country]);

  const totalMembers = data?.total ?? members.length;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      <section
        style={{
          background: 'var(--fardo-color-bg-base)',
          border: '1px solid var(--fardo-color-border-default)',
          borderRadius: '20px',
          padding: '18px',
          marginBottom: '14px',
        }}
      >
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--fardo-orange-500)', marginBottom: '8px' }}>
          DIRECTORIO
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fardo-color-text-primary)', marginBottom: '4px' }}>
          Red de miembros FARDO
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--fardo-color-text-secondary)', lineHeight: 1.6 }}>
          Encontrá pares por país, rol y foco. Acá se valida estrategia con gente que también ejecuta.
        </p>
      </section>

      <section
        style={{
          background: 'var(--fardo-color-bg-base)',
          border: '1px solid var(--fardo-color-border-default)',
          borderRadius: '20px',
          padding: '14px',
          marginBottom: '14px',
        }}
      >
        <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-muted)', marginBottom: '8px' }}>
          Filtrar por país
        </p>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
        <button
          onClick={() => setCountry('')}
          style={chipStyle(country === '')}
        >
          Todos
        </button>
        {countriesData?.map((c) => (
          <button
            key={c}
            onClick={() => setCountry(c)}
            style={chipStyle(country === c)}
          >
            {c}
          </button>
        ))}
        </div>
      </section>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--fardo-color-bg-base)',
          border: '1px solid var(--fardo-color-border-default)',
          borderRadius: '16px',
          padding: '10px 14px',
          marginBottom: '14px',
        }}
      >
        <p style={{ fontSize: '13px', color: 'var(--fardo-color-text-secondary)' }}>
          {totalMembers} miembro{totalMembers !== 1 ? 's' : ''} en esta vista
        </p>
        {!data?.members?.length && (
          <span style={{ fontSize: '11px', color: 'var(--fardo-orange-500)', fontWeight: 600 }}>
            Modo demo
          </span>
        )}
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ height: '170px', background: 'var(--fardo-color-bg-base)', border: '1px solid var(--fardo-color-border-default)', borderRadius: '16px' }} />
          ))}
        </div>
      ) : !members.length ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--fardo-color-text-muted)' }}>
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>👥</p>
          <p style={{ fontSize: '15px' }}>No hay miembros con ese filtro. Probá ampliar la búsqueda.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    padding: '7px 14px',
    borderRadius: '999px',
    border: active ? '1px solid var(--fardo-orange-200)' : '1px solid var(--fardo-color-border-default)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: active ? 600 : 500,
    color: active ? 'var(--fardo-orange-500)' : 'var(--fardo-color-text-secondary)',
    background: active ? 'var(--fardo-orange-50)' : 'var(--fardo-color-bg-subtle)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'all 0.15s',
  };
}
