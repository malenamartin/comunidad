import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;

// In development, reuse connection across hot reloads
declare global {
  // eslint-disable-next-line no-var
  var _sql: ReturnType<typeof postgres> | undefined;
}

function createSql() {
  return postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
}

const sql =
  process.env.NODE_ENV === 'development'
    ? (globalThis._sql ??= createSql())
    : createSql();

export default sql;
