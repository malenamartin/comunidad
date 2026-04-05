import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, name, company, jobTitle, country, linkedinUrl } = body as {
    email: string;
    name: string;
    company?: string;
    jobTitle?: string;
    country?: string;
    linkedinUrl?: string;
  };

  if (!email || !name) {
    return NextResponse.json({ error: 'Campos requeridos: email, name' }, { status: 400 });
  }

  // Check for duplicate request
  const existing = await sql`
    SELECT id FROM access_requests WHERE email = ${email} AND status = 'pending' LIMIT 1
  `;
  if (existing.length > 0) {
    return NextResponse.json({ success: true, message: 'Solicitud ya registrada' });
  }

  await sql`
    INSERT INTO access_requests (email, name, company, job_title, country, linkedin_url)
    VALUES (
      ${email}, ${name}, ${company ?? null},
      ${jobTitle ?? null}, ${country ?? null}, ${linkedinUrl ?? null}
    )
  `;

  return NextResponse.json({ success: true });
}
