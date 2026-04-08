import Link from 'next/link';
import type { Benchmark } from '@/lib/community/benchmarks';

const INDUSTRY_LABELS: Record<string, string> = {
  automotriz: 'Automotriz',
  fintech: 'Fintech',
  retail: 'Retail',
  educacion: 'Educación',
  salud: 'Salud',
  tech: 'Tech',
  otros: 'Otros',
};

interface BenchmarkCardProps {
  benchmark: Benchmark;
}

function MetricBar({ value, color }: { value: number | null; color: string }) {
  if (value === null) return <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>—</span>;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(value, 100)}%`, height: '100%', background: color, borderRadius: '2px' }} />
      </div>
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', minWidth: '36px', textAlign: 'right' }}>
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

export function BenchmarkCard({ benchmark }: BenchmarkCardProps) {
  return (
    <Link href={`/comunidad/benchmarks/${benchmark.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '0.5px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '20px',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease',
          height: '100%',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
              {INDUSTRY_LABELS[benchmark.industry] ?? benchmark.industry}
            </span>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
              {benchmark.period}
            </p>
          </div>
          <div
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(255,106,0,0.12)', border: '1px solid rgba(255,106,0,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px',
            }}
          >
            📊
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Citation Rate</span>
            </div>
            <MetricBar value={benchmark.citation_rate} color="#FF6A00" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>SOV promedio</span>
            </div>
            <MetricBar value={benchmark.sov_avg} color="#4A90D4" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>LLMO Score top</span>
            </div>
            <MetricBar value={benchmark.llmo_score_top} color="#90C050" />
          </div>
        </div>

        {/* Top brands preview */}
        {benchmark.top_brands && benchmark.top_brands.length > 0 && (
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>TOP MARCAS</span>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
              {benchmark.top_brands.slice(0, 3).map((brand) => (
                <span key={brand.name} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', padding: '2px 8px' }}>
                  {brand.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </Link>
  );
}
