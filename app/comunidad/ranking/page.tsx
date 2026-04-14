'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';

interface RankingRow {
  rank: number;
  brand: string;
  industry: string;
  visibilityScore: number;
  change: number;
}

interface IndustryOption {
  key: string;
  label: string;
}

interface RankingResponse {
  rows: RankingRow[];
  source: 'api' | 'fallback';
  industries: IndustryOption[];
  updatedAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json() as Promise<RankingResponse>);

function formatChange(value: number): string {
  const abs = Math.abs(value).toFixed(2);
  return value > 0 ? `+${abs}` : value < 0 ? `-${abs}` : '0.00';
}

export default function RankingPage() {
  const [industry, setIndustry] = useState('all');
  const { data, isLoading } = useSWR<RankingResponse>(
    `/api/community/ranking/visibility?industry=${industry}&limit=15`,
    fetcher
  );

  const rows = data?.rows ?? [];
  const top3 = rows.slice(0, 3);
  const list = rows.slice(3);
  const winner = rows[0];

  const avgScore = useMemo(() => {
    if (rows.length === 0) return 0;
    const sum = rows.reduce((acc, row) => acc + row.visibilityScore, 0);
    return Math.round((sum / rows.length) * 100) / 100;
  }, [rows]);

  const avgChange = useMemo(() => {
    if (rows.length === 0) return 0;
    const sum = rows.reduce((acc, row) => acc + row.change, 0);
    return Math.round((sum / rows.length) * 100) / 100;
  }, [rows]);

  return (
    <div className="ranking-page">
      <header className="ranking-header">
        <p className="eyebrow">AI VISIBILITY PULSE</p>
        <h1>Ranking de marcas por industria</h1>
        <p>
          Top 15 para ver quién lidera en IA, quién escala y dónde te están ganando sin que te enteres.
        </p>
      </header>

      <section className="industry-tabs" aria-label="Filtrar por industria">
        {(data?.industries ?? []).map((option) => (
          <button
            key={option.key}
            type="button"
            className={industry === option.key ? 'tab active' : 'tab'}
            onClick={() => setIndustry(option.key)}
          >
            {option.label}
          </button>
        ))}
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <p className="stat-label">Marca que manda</p>
          <p className="stat-value">{winner?.brand ?? '-'}</p>
          <p className="stat-sub">{winner ? `${winner.visibilityScore.toFixed(2)} pts` : 'Sin datos'}</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Promedio Top 15</p>
          <p className="stat-value">{avgScore.toFixed(2)}</p>
          <p className="stat-sub">Indice de visibilidad</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Tendencia semanal</p>
          <p className="stat-value">{formatChange(avgChange)}</p>
          <p className="stat-sub">Cambio promedio vs semana anterior</p>
        </article>
      </section>

      <section className="podium" aria-label="Top 3">
        {top3.map((row) => (
          <article key={row.brand} className="podium-card">
            <p className="podium-rank">#{row.rank}</p>
            <h3>{row.brand}</h3>
            <p className="podium-industry">{row.industry}</p>
            <div className="podium-metrics">
              <span>{row.visibilityScore.toFixed(2)} pts</span>
              <span className={row.change > 0 ? 'up' : row.change < 0 ? 'down' : ''}>{formatChange(row.change)}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="table-card">
        <div className="table-head">
          <h2>Top 15 marcas</h2>
          <p>
            Fuente: {data?.source === 'api' ? 'API en vivo' : 'Demo (fallback)'}
            {data?.updatedAt ? ` · ${new Date(data.updatedAt).toLocaleString('es-AR')}` : ''}
          </p>
        </div>

        {isLoading ? (
          <div className="loading-block">Cargando ranking...</div>
        ) : rows.length === 0 ? (
          <div className="loading-block">No hay datos para esta industria. Probá otra y volvemos a pelearla.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Posicion</th>
                  <th>Marca</th>
                  <th>Industria</th>
                  <th>Visibilidad</th>
                  <th>Tendencia</th>
                </tr>
              </thead>
              <tbody>
                {top3.map((row) => (
                  <tr key={`top-${row.brand}`}>
                    <td>#{row.rank}</td>
                    <td className="brand-cell">{row.brand}</td>
                    <td>{row.industry}</td>
                    <td>{row.visibilityScore.toFixed(2)}</td>
                    <td className={row.change > 0 ? 'up' : row.change < 0 ? 'down' : ''}>{formatChange(row.change)}</td>
                  </tr>
                ))}
                {list.map((row) => (
                  <tr key={row.brand}>
                    <td>#{row.rank}</td>
                    <td className="brand-cell">{row.brand}</td>
                    <td>{row.industry}</td>
                    <td>{row.visibilityScore.toFixed(2)}</td>
                    <td className={row.change > 0 ? 'up' : row.change < 0 ? 'down' : ''}>{formatChange(row.change)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <style jsx>{`
        .ranking-page {
          max-width: 1120px;
          margin: 0 auto;
          padding: 28px 24px 44px;
        }

        .ranking-header {
          margin-bottom: 18px;
        }

        .eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--fardo-orange-400);
          margin-bottom: 8px;
        }

        .ranking-header h1 {
          font-size: 34px;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--fardo-color-text-primary);
          margin-bottom: 10px;
        }

        .ranking-header p {
          color: var(--fardo-color-text-secondary);
          max-width: 760px;
          line-height: 1.55;
          font-size: 15px;
        }

        .industry-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 6px;
          margin-bottom: 18px;
          scrollbar-width: none;
        }

        .tab {
          border: 1px solid var(--fardo-color-border-default);
          border-radius: 999px;
          background: var(--fardo-color-bg-base);
          color: var(--fardo-color-text-secondary);
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          padding: 9px 14px;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .tab.active {
          border-color: var(--fardo-orange-200);
          background: var(--fardo-orange-50);
          color: var(--fardo-orange-500);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 14px;
        }

        .stat-card {
          background: var(--fardo-color-bg-base);
          border: 1px solid var(--fardo-color-border-default);
          border-radius: 18px;
          padding: 16px;
          box-shadow: var(--fardo-shadow-xs);
        }

        .stat-label {
          font-size: 12px;
          color: var(--fardo-color-text-muted);
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--fardo-color-text-primary);
          margin-bottom: 2px;
        }

        .stat-sub {
          font-size: 12px;
          color: var(--fardo-color-text-secondary);
        }

        .podium {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .podium-card {
          background: linear-gradient(160deg, #ffffff 0%, #fff6ee 100%);
          border: 1px solid var(--fardo-color-border-default);
          border-radius: 22px;
          padding: 16px;
          box-shadow: var(--fardo-shadow-xs);
        }

        .podium-rank {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          background: var(--fardo-orange-50);
          color: var(--fardo-orange-500);
          border: 1px solid var(--fardo-orange-200);
          border-radius: 999px;
          padding: 4px 10px;
          margin-bottom: 10px;
        }

        .podium-card h3 {
          font-size: 20px;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
          color: var(--fardo-color-text-primary);
        }

        .podium-industry {
          font-size: 13px;
          color: var(--fardo-color-text-secondary);
          margin-bottom: 12px;
        }

        .podium-metrics {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 700;
          color: var(--fardo-color-text-primary);
        }

        .table-card {
          background: var(--fardo-color-bg-base);
          border: 1px solid var(--fardo-color-border-default);
          border-radius: 22px;
          padding: 18px;
        }

        .table-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 14px;
          margin-bottom: 14px;
        }

        .table-head h2 {
          font-size: 20px;
          letter-spacing: -0.02em;
          color: var(--fardo-color-text-primary);
        }

        .table-head p {
          font-size: 12px;
          color: var(--fardo-color-text-muted);
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }

        th {
          text-align: left;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--fardo-color-text-muted);
          font-weight: 700;
          padding: 10px 12px;
          border-bottom: 1px solid var(--fardo-color-border-default);
        }

        td {
          font-size: 14px;
          color: var(--fardo-color-text-secondary);
          padding: 13px 12px;
          border-bottom: 1px solid var(--fardo-color-border-subtle);
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        .brand-cell {
          font-weight: 700;
          color: var(--fardo-color-text-primary);
        }

        .up {
          color: var(--fardo-green-600);
          font-weight: 700;
        }

        .down {
          color: var(--fardo-red-600);
          font-weight: 700;
        }

        .loading-block {
          text-align: center;
          padding: 30px;
          color: var(--fardo-color-text-muted);
        }

        @media (max-width: 920px) {
          .ranking-page {
            padding: 24px 14px 40px;
          }

          .ranking-header h1 {
            font-size: 28px;
          }

          .stats-grid,
          .podium {
            grid-template-columns: 1fr;
          }

          .table-card {
            padding: 14px;
            border-radius: 18px;
          }
        }
      `}</style>
    </div>
  );
}
