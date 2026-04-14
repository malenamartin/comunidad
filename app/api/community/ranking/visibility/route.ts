import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getMemberByClerkId } from '@/lib/community/members';
import { fetchVisibilityRanking, VISIBILITY_INDUSTRIES } from '@/lib/community/visibilityRanking';

export async function GET(req: Request) {
  if (process.env.BYPASS_AUTH !== 'true') {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const member = await getMemberByClerkId(userId);
    if (!member) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
  }

  const url = new URL(req.url);
  const industry = url.searchParams.get('industry') ?? 'all';
  const limit = Number(url.searchParams.get('limit') ?? 15);

  const result = await fetchVisibilityRanking({ industryKey: industry, limit });

  return NextResponse.json({
    rows: result.rows,
    source: result.source,
    industry: result.industry,
    industries: VISIBILITY_INDUSTRIES.map(({ key, label }) => ({ key, label })),
    updatedAt: new Date().toISOString(),
  });
}
