import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getMemberByClerkId, updateMember } from '@/lib/community/members';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const member = await getMemberByClerkId(userId);
  if (!member) return NextResponse.json({ error: 'Miembro no encontrado' }, { status: 404 });

  return NextResponse.json(member);
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const body = await req.json();
  const { name, company, job_title, country, linkedin_url, bio } = body as {
    name?: string;
    company?: string;
    job_title?: string;
    country?: string;
    linkedin_url?: string;
    bio?: string;
  };

  const updated = await updateMember(userId, { name, company, job_title, country, linkedin_url, bio });
  if (!updated) return NextResponse.json({ error: 'Miembro no encontrado' }, { status: 404 });

  return NextResponse.json(updated);
}
