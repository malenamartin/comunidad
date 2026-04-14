export interface VisibilityIndustryOption {
  key: string;
  label: string;
  apiIndustry: string | null;
}

export interface VisibilityBrandRank {
  rank: number;
  brand: string;
  industry: string;
  visibilityScore: number;
  change: number;
}

interface VisibilityApiWeeklyScore {
  metric_date?: string;
  visibility_score?: number | string;
}

interface VisibilityApiRow {
  company_name?: string;
  industry?: string;
  weekly_scores?: VisibilityApiWeeklyScore[];
}

export const VISIBILITY_INDUSTRIES: VisibilityIndustryOption[] = [
  { key: 'all', label: 'Todas', apiIndustry: null },
  { key: 'streaming', label: 'Streaming', apiIndustry: 'Streaming' },
  { key: 'aerospace', label: 'Aeroespacial', apiIndustry: 'Aerospace' },
  { key: 'automotriz', label: 'Automotriz', apiIndustry: 'Auto Parts' },
  { key: 'bancos', label: 'Bancos', apiIndustry: 'Credit cards' },
  { key: 'fast_food', label: 'Comida rapida', apiIndustry: 'Fast Food' },
  { key: 'pharmaceutical', label: 'Farmaceutica', apiIndustry: 'Pharmaceutical' },
  { key: 'semiconductor', label: 'Semiconductores', apiIndustry: 'Semiconductor' },
  { key: 'furniture', label: 'Muebles', apiIndustry: 'Furniture' },
  { key: 'health_insurance', label: 'Seguros de salud', apiIndustry: 'Health insurance' },
  { key: 'it_consulting', label: 'Consultoria IT', apiIndustry: 'IT consulting' },
  { key: 'renewable_energy', label: 'Energia renovable', apiIndustry: 'Renewable Energy' },
  { key: 'fintech', label: 'Fintech', apiIndustry: 'Credit cards' },
  { key: 'health', label: 'Salud', apiIndustry: 'Health insurance' },
  { key: 'ecommerce', label: 'Comercio electronico', apiIndustry: null },
];

const FALLBACK_ROWS: VisibilityBrandRank[] = [
  { rank: 1, brand: 'Netflix', industry: 'Streaming', visibilityScore: 91.2, change: 2.1 },
  { rank: 2, brand: 'Disney+', industry: 'Streaming', visibilityScore: 88.7, change: 1.3 },
  { rank: 3, brand: 'Prime Video', industry: 'Streaming', visibilityScore: 86.5, change: -0.2 },
  { rank: 4, brand: 'HBO Max', industry: 'Streaming', visibilityScore: 83.9, change: 0.9 },
  { rank: 5, brand: 'Paramount+', industry: 'Streaming', visibilityScore: 80.4, change: 0.5 },
  { rank: 6, brand: 'NVIDIA', industry: 'Semiconductor', visibilityScore: 89.1, change: 1.7 },
  { rank: 7, brand: 'AMD', industry: 'Semiconductor', visibilityScore: 84.2, change: 1.1 },
  { rank: 8, brand: 'Intel', industry: 'Semiconductor', visibilityScore: 82.8, change: -0.8 },
  { rank: 9, brand: 'Visa', industry: 'Credit cards', visibilityScore: 87.4, change: 0.6 },
  { rank: 10, brand: 'Mastercard', industry: 'Credit cards', visibilityScore: 86.3, change: 1.2 },
  { rank: 11, brand: 'American Express', industry: 'Credit cards', visibilityScore: 81.5, change: -0.4 },
  { rank: 12, brand: 'Pfizer', industry: 'Pharmaceutical', visibilityScore: 83.3, change: 0.7 },
  { rank: 13, brand: 'Novartis', industry: 'Pharmaceutical', visibilityScore: 81.1, change: -0.1 },
  { rank: 14, brand: 'Bayer', industry: 'Pharmaceutical', visibilityScore: 79.8, change: 0.2 },
  { rank: 15, brand: 'Accenture', industry: 'IT consulting', visibilityScore: 82.1, change: 1.4 },
  { rank: 16, brand: 'Deloitte', industry: 'IT consulting', visibilityScore: 79.7, change: 0.3 },
  { rank: 17, brand: 'PwC', industry: 'IT consulting', visibilityScore: 78.4, change: -0.5 },
  { rank: 18, brand: 'IKEA', industry: 'Furniture', visibilityScore: 76.8, change: 0.2 },
  { rank: 19, brand: 'Herman Miller', industry: 'Furniture', visibilityScore: 73.9, change: -0.3 },
  { rank: 20, brand: 'Aeron', industry: 'Aerospace', visibilityScore: 74.5, change: 0.6 },
  { rank: 21, brand: 'Boeing', industry: 'Aerospace', visibilityScore: 80.2, change: 0.4 },
  { rank: 22, brand: 'Airbus', industry: 'Aerospace', visibilityScore: 82.5, change: 0.8 },
  { rank: 23, brand: 'Tesla', industry: 'Auto Parts', visibilityScore: 84.8, change: 1.5 },
  { rank: 24, brand: 'Ford', industry: 'Auto Parts', visibilityScore: 77.4, change: -0.2 },
  { rank: 25, brand: 'Toyota', industry: 'Auto Parts', visibilityScore: 80.1, change: 0.5 },
];

function sortWeeklyScoresAsc(scores: VisibilityApiWeeklyScore[]): VisibilityApiWeeklyScore[] {
  return [...scores].sort((a, b) =>
    String(a.metric_date ?? '').localeCompare(String(b.metric_date ?? ''))
  );
}

function mapPlatformRows(rows: VisibilityApiRow[]): VisibilityBrandRank[] {
  const ranked = rows
    .map((row) => {
      if (!row.company_name || !Array.isArray(row.weekly_scores) || row.weekly_scores.length === 0) {
        return null;
      }
      const sorted = sortWeeklyScoresAsc(row.weekly_scores);
      const latest = sorted[sorted.length - 1];
      const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;
      const latestScore = Number(latest?.visibility_score);
      if (!Number.isFinite(latestScore)) return null;
      const prevScore = previous ? Number(previous.visibility_score) : latestScore;
      const change = Number.isFinite(prevScore) ? latestScore - prevScore : 0;

      return {
        rank: 0,
        brand: String(row.company_name),
        industry: String(row.industry ?? 'General'),
        visibilityScore: Math.round(latestScore * 100) / 100,
        change: Math.round(change * 100) / 100,
      };
    })
    .filter((item): item is VisibilityBrandRank => Boolean(item))
    .sort((a, b) => b.visibilityScore - a.visibilityScore)
    .map((row, index) => ({ ...row, rank: index + 1 }));

  return ranked;
}

function mapFlexibleRows(payload: unknown): VisibilityBrandRank[] {
  const maybeRecord = (payload && typeof payload === 'object') ? payload as Record<string, unknown> : {};
  const list =
    Array.isArray(payload) ? payload :
    Array.isArray(maybeRecord.top10) ? maybeRecord.top10 :
    Array.isArray(maybeRecord.ranking) ? maybeRecord.ranking :
    Array.isArray(maybeRecord.data) ? maybeRecord.data :
    Array.isArray(maybeRecord.results) ? maybeRecord.results :
    Array.isArray(maybeRecord.items) ? maybeRecord.items :
    [];

  return list
    .map((row, idx) => {
      if (!row || typeof row !== 'object') return null;
      const item = row as Record<string, unknown>;
      const brand = item.brand ?? item.name ?? item.marca ?? item.company ?? item.company_name;
      const visibilityScore = Number(item.visibilityScore ?? item.visibility_score ?? item.visibility);
      if (!brand || !Number.isFinite(visibilityScore)) return null;
      const rank = Number(item.rank ?? item.position ?? idx + 1);
      const change = Number(item.change ?? item.delta ?? 0);
      const industry = String(item.industry ?? 'General');

      return {
        rank: Number.isFinite(rank) ? rank : idx + 1,
        brand: String(brand),
        industry,
        visibilityScore: Math.round(visibilityScore * 100) / 100,
        change: Number.isFinite(change) ? Math.round(change * 100) / 100 : 0,
      };
    })
    .filter((item): item is VisibilityBrandRank => Boolean(item))
    .sort((a, b) => a.rank - b.rank);
}

function normalizeIndustry(industryKey: string): VisibilityIndustryOption {
  const key = industryKey.trim().toLowerCase();
  return VISIBILITY_INDUSTRIES.find((opt) => opt.key === key) ?? VISIBILITY_INDUSTRIES[0];
}

function filterByIndustry(rows: VisibilityBrandRank[], industry: VisibilityIndustryOption): VisibilityBrandRank[] {
  if (!industry.apiIndustry) return rows;
  return rows.filter((row) => row.industry.toLowerCase() === industry.apiIndustry?.toLowerCase());
}

export async function fetchVisibilityRanking(opts?: {
  industryKey?: string;
  limit?: number;
}): Promise<{
  rows: VisibilityBrandRank[];
  source: 'api' | 'fallback';
  industry: VisibilityIndustryOption;
}> {
  const industry = normalizeIndustry(opts?.industryKey ?? 'all');
  const limit = Math.max(3, Math.min(50, Number(opts?.limit ?? 15)));
  const endpoint = process.env.FARDO_VISIBILITY_RANKING_ENDPOINT ?? 'https://api.platform-fardo.com/api/ranking/visibility';
  const apiKey = process.env.FARDO_VISIBILITY_API_KEY ?? 'deliciosas-arepas';

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { 'x-api-key': apiKey },
      cache: 'no-store',
    });

    if (!response.ok) throw new Error(`Ranking API status ${response.status}`);
    const payload = await response.json();

    const maybeRecord = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
    const platformRows =
      maybeRecord.success === true && Array.isArray(maybeRecord.data)
        ? mapPlatformRows(maybeRecord.data as VisibilityApiRow[])
        : [];
    const baseRows = platformRows.length > 0 ? platformRows : mapFlexibleRows(payload);

    const filtered = filterByIndustry(baseRows, industry).slice(0, limit);
    if (filtered.length > 0) {
      return {
        rows: filtered.map((row, index) => ({ ...row, rank: index + 1 })),
        source: 'api',
        industry,
      };
    }
  } catch {
    // Fallback below.
  }

  const fallback = filterByIndustry(FALLBACK_ROWS, industry)
    .sort((a, b) => b.visibilityScore - a.visibilityScore)
    .slice(0, limit)
    .map((row, index) => ({ ...row, rank: index + 1 }));

  return { rows: fallback, source: 'fallback', industry };
}
