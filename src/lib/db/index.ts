import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Standard pg driver: works against Neon/Vercel Postgres (sslmode in URL)
// and any local Postgres for development. Pooled, lazily created.
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function dbConfigured(): boolean {
  return Boolean((process.env.DATABASE_URL ?? "").trim());
}

export function getDb() {
  if (!dbConfigured()) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!_db) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      ssl: /sslmode=require/.test(process.env.DATABASE_URL ?? "")
        ? { rejectUnauthorized: false }
        : undefined,
    });
    _db = drizzle(pool, { schema });
  }
  return _db;
}

export { schema };
