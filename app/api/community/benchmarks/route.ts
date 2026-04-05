import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { listBenchmarks } from '@/lib/community/benchmarks';
import { getMemberByClerkId } from '@/lib/community/members';

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const member = await getMemberByClerkId(userId);
  if (!member) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const url = new URL(req.url);
  const industry = url.searchParams.get('industry') ?? undefined;
  const period = url.searchParams.get('period') ?? undefined;

  const benchmarks = await listBenchmarks({ industry, period });
  return NextResponse.json(benchmarks);
}
