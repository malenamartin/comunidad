'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { MemberCard } from '@/components/community/MemberCard';
import type { CommunityMember } from '@/lib/community/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function MiembrosPage() {
  const [country, setCountry] = useState('');

  const { data: countriesData } = useSWR<string[]>('/api/community/members/countries', fetcher);
  const url = country
    ? `/api/community/members?country=${encodeURIComponent(country)}`
    : '/api/community/members';
  const { data, isLoading } = useSWR<{ members: CommunityMember[]; total: number }>(url, fetcher);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: '4px' }}>
          Directorio
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
          CMOs y líderes de marketing de LatAm
        </p>
      </div>

      {/* Country filter */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
        <button
          onClick={() => setCountry('')}
          style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: country === '' ? 600 : 400, color: country === '' ? '#FFFFFF' : 'rgba(255,255,255,0.4)', background: country === '' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.15s' }}
        >
          Todos
        </button>
        {countriesData?.map((c) => (
          <button
            key={c}
            onClick={() => setCountry(c)}
            style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: country === c ? 600 : 400, color: country === c ? '#FFFFFF' : 'rgba(255,255,255,0.4)', background: country === c ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.15s' }}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ height: '160px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '12px' }} />
          ))}
        </div>
      ) : !data?.members?.length ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'rgba(255,255,255,0.3)' }}>
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>👥</p>
          <p style={{ fontSize: '15px' }}>No hay miembros con ese filtro.</p>
        </div>
      ) : (
        <>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>
            {data.total} miembro{data.total !== 1 ? 's' : ''}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {data.members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
