'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { BenchmarkCard } from '@/components/community/BenchmarkCard';
import type { Benchmark } from '@/lib/community/benchmarks';

const INDUSTRIES = [
  { value: '', label: 'Todas' },
  { value: 'automotriz', label: 'Automotriz' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'retail', label: 'Retail' },
  { value: 'educacion', label: 'Educación' },
  { value: 'salud', label: 'Salud' },
  { value: 'tech', label: 'Tech' },
  { value: 'otros', label: 'Otros' },
];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function BenchmarksPage() {
  const [industry, setIndustry] = useState('');

  const url = industry
    ? `/api/community/benchmarks?industry=${industry}`
    : '/api/community/benchmarks';

  const { data: benchmarks, isLoading } = useSWR<Benchmark[]>(url, fetcher);

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px', borderRadius: '8px', border: 'none',
    cursor: 'pointer', fontSize: '13px',
    fontWeight: active ? 600 : 400,
    color: active ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
    background: active ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
    whiteSpace: 'nowrap' as const, flexShrink: 0, transition: 'all 0.15s',
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: '4px' }}>
          Benchmarks
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
          Datos exclusivos de Citation Rate, SOV y LLMO Score por industria
        </p>
      </div>

      {/* Industry filters */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
        {INDUSTRIES.map((i) => (
          <button key={i.value} onClick={() => setIndustry(i.value)} style={tabStyle(industry === i.value)}>
            {i.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ height: '220px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '12px' }} />
          ))}
        </div>
      ) : !benchmarks?.length ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'rgba(255,255,255,0.3)' }}>
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>📊</p>
          <p style={{ fontSize: '15px' }}>Los benchmarks estarán disponibles pronto.</p>
          <p style={{ fontSize: '13px', marginTop: '8px', color: 'rgba(255,255,255,0.2)' }}>El equipo Fardo los publica periódicamente.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {benchmarks.map((b) => (
            <BenchmarkCard key={b.id} benchmark={b} />
          ))}
        </div>
      )}
    </div>
  );
}
