#!/usr/bin/env node
/**
 * Aplica migraciones SQL en orden sobre DATABASE_URL.
 * Uso: DATABASE_URL=postgresql://... npm run db:migrate
 *
 * Orden alineado con el código (UUID en community_members):
 * - 001: tablas base comunidad
 * - 002: benchmarks, betas, events, etc.
 * - 004: avatares preset + columnas miembro
 *
 * No incluye 000_full_schema.sql (esquema alternativo entero; choca con 001)
 * ni 003_phase3.sql (usa INTEGER para member_id; incompatible con UUID de 001).
 */

import fs from 'fs';
import postgres from 'postgres';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadEnvLocal() {
  const envLocal = path.join(root, '.env.local');
  if (!fs.existsSync(envLocal)) return;
  const text = fs.readFileSync(envLocal, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key === 'DATABASE_URL' && !process.env.DATABASE_URL) process.env.DATABASE_URL = val;
  }
}

loadEnvLocal();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('Error: definí DATABASE_URL (ej. en .env.local o export DATABASE_URL=...)');
  process.exit(1);
}

const MIGRATIONS = [
  '001_community_tables.sql',
  '002_phase2_tables.sql',
  '004_avatars_and_admin_fixes.sql',
];

function sslOption(url) {
  if (url.includes('sslmode=require') || url.includes('railway') || url.includes('neon.tech')) {
    return { rejectUnauthorized: false };
  }
  return false;
}

const sql = postgres(DATABASE_URL, {
  max: 1,
  connect_timeout: 30,
  ssl: sslOption(DATABASE_URL),
});

try {
  for (const file of MIGRATIONS) {
    const filepath = path.join(root, 'migrations', file);
    process.stdout.write(`→ ${file} …\n`);
    await sql.file(filepath);
  }
  process.stdout.write('Listo: migraciones aplicadas.\n');
} catch (err) {
  console.error(err);
  process.exit(1);
} finally {
  await sql.end({ timeout: 5 });
}
