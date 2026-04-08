'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import useSWR from 'swr';
import type { Benchmark } from '@/lib/community/benchmarks';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const INDUSTRY_LABELS: Record<string, string> = {
  automotriz: 'Automotriz', fintech: 'Fintech', retail: 'Retail',
  educacion: 'Educación', salud: 'Salud', tech: 'Tech', otros: 'Otros',
};

function MetricRow({ label, value, color }: { label: string; value: number | null; color: string }) {
  if (value === null) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', width: '160px', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(value, 100)}%`, height: '100%', background: color, borderRadius: '3px' }} />
      </div>
      <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', minWidth: '48px', textAlign: 'right' }}>
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

export default function BenchmarkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: benchmark } = useSWR<Benchmark>(id ? `/api/community/benchmarks/${id}` : null, fetcher);

  if (!benchmark) {
    return (
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ height: '300px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 24px' }}>
      <Link href="/comunidad/benchmarks" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none', marginBottom: '24px' }}>
        <ArrowLeft size={14} /> Volver a Benchmarks
      </Link>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '28px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
              {INDUSTRY_LABELS[benchmark.industry] ?? benchmark.industry}
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>·</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{benchmark.period}</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Benchmark {INDUSTRY_LABELS[benchmark.industry] ?? benchmark.industry} — {benchmark.period}
          </h1>
        </div>

        {/* Metrics */}
        <div style={{ marginBottom: '24px' }}>
          <MetricRow label="Citation Rate" value={benchmark.citation_rate} color="#FF6A00" />
          <MetricRow label="SOV promedio" value={benchmark.sov_avg} color="#4A90D4" />
          <MetricRow label="AEO Score top" value={benchmark.aeo_score_top} color="#C8A040" />
          <MetricRow label="GEO Score top" value={benchmark.geo_score_top} color="#8090E0" />
          <MetricRow label="LLMO Score top" value={benchmark.llmo_score_top} color="#90C050" />
          <MetricRow label="LLMO Score promedio" value={benchmark.llmo_score_avg} color="#60A080" />
        </div>

        {/* Top brands */}
        {benchmark.top_brands && benchmark.top_brands.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Top Marcas
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {benchmark.top_brands.map((brand, i) => (
                <div key={brand.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', width: '20px' }}>{i + 1}</span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF', flex: 1 }}>{brand.name}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#FF6A00' }}>{brand.score}</span>
                  {brand.delta !== 0 && (
                    <span style={{ fontSize: '11px', color: brand.delta > 0 ? '#90C050' : '#E07050' }}>
                      {brand.delta > 0 ? '+' : ''}{brand.delta}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        {benchmark.insights && (
          <div style={{ background: 'rgba(255,106,0,0.06)', border: '1px solid rgba(255,106,0,0.15)', borderRadius: '10px', padding: '16px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#FF6A00', marginBottom: '8px', letterSpacing: '0.04em' }}>
              ANÁLISIS FARDO
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {benchmark.insights}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
