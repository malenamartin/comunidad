import sql from '@/lib/db';
import type { InviteCode } from './types';

export async function findInviteCode(code: string): Promise<InviteCode | null> {
  const rows = await sql<InviteCode[]>`
    SELECT * FROM invite_codes WHERE code = ${code} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function incrementInviteUse(id: string): Promise<void> {
  await sql`
    UPDATE invite_codes SET current_uses = current_uses + 1 WHERE id = ${id}
  `;
}

export async function validateInviteCode(code: string): Promise<
  { valid: true; invite: InviteCode } | { valid: false; error: string }
> {
  const invite = await findInviteCode(code);
  if (!invite) return { valid: false, error: 'Código inválido' };
  if (!invite.is_active) return { valid: false, error: 'Código inválido' };
  if (invite.current_uses >= invite.max_uses) return { valid: false, error: 'Código agotado' };
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return { valid: false, error: 'Código expirado' };
  }
  return { valid: true, invite };
}
