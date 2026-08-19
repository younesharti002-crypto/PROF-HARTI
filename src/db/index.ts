import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * PHASE 0 placeholder connection.
 * No business tables are defined yet (see `src/db/schema.ts`); this module only
 * proves that the PostgreSQL + Drizzle wiring is in place.
 */
const globalForDb = globalThis as typeof globalThis & {
  __profHartiPool?: Pool;
};

export const pool =
  globalForDb.__profHartiPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__profHartiPool = pool;
}

export const db = drizzle(pool);
