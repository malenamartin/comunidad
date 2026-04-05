import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { validateInviteCode, incrementInviteUse } from '@/lib/community/invites';
import { getMemberByClerkId, createMember, countMembers } from '@/lib/community/members';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const body = await req.json();
  const { code, email, name, company, jobTitle, country } = body as {
    code: string;
    email: string;
    name: string;
    company?: string;
    jobTitle?: string;
    country?: string;
  };

  if (!code || !email || !name) {
    return NextResponse.json({ error: 'Campos requeridos: code, email, name' }, { status: 400 });
  }

  // Check if already a member
  const existing = await getMemberByClerkId(userId);
  if (existing) {
    return NextResponse.json({ error: 'Ya eres miembro de la comunidad' }, { status: 409 });
  }

  // Validate invite code
  const result = await validateInviteCode(code);
  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Determine founder status (first 50 members)
  const memberCount = await countMembers();
  const isFounder = memberCount < 50;

  // Create member in DB
  await createMember({
    clerk_user_id: userId,
    email,
    name,
    company,
    job_title: jobTitle,
    country,
    invite_code_used: code,
    is_founder: isFounder,
  });

  // Assign community_member role in Clerk
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existingRoles = ((user.publicMetadata as Record<string, unknown>)?.roles as string[]) ?? [];
  if (!existingRoles.includes('community_member')) {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        roles: [...existingRoles, 'community_member'],
        community_joined_at: new Date().toISOString(),
      },
    });
  }

  // Increment invite code usage
  await incrementInviteUse(result.invite.id);

  return NextResponse.json({ success: true, is_founder: isFounder });
}
