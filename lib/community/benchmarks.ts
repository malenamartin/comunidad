import sql from '@/lib/db';

export interface Benchmark {
  id: string;
  industry: string;
  period: string;
  citation_rate: number | null;
  sov_avg: number | null;
  aeo_score_top: number | null;
  geo_score_top: number | null;
  llmo_score_top: number | null;
  llmo_score_avg: number | null;
  top_brands: { name: string; score: number; delta: number }[] | null;
  insights: string | null;
  is_published: boolean;
  created_at: string;
}

export async function listBenchmarks(opts: {
  industry?: string;
  period?: string;
}): Promise<Benchmark[]> {
  const industryFilter = opts.industry ? sql`AND industry = ${opts.industry}` : sql``;
  const periodFilter = opts.period ? sql`AND period = ${opts.period}` : sql``;

  return sql<Benchmark[]>`
    SELECT * FROM benchmarks
    WHERE is_published = true ${industryFilter} ${periodFilter}
    ORDER BY period DESC, industry ASC
  `;
}

export async function getBenchmarkById(id: string): Promise<Benchmark | null> {
  const rows = await sql<Benchmark[]>`
    SELECT * FROM benchmarks WHERE id = ${id} AND is_published = true LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function listIndustries(): Promise<string[]> {
  const rows = await sql<{ industry: string }[]>`
    SELECT DISTINCT industry FROM benchmarks
    WHERE is_published = true
    ORDER BY industry ASC
  `;
  return rows.map((r) => r.industry);
}
