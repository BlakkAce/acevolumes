import pg from "pg";
const c = new pg.Client({ connectionString: process.env.NEON_URL, ssl: { rejectUnauthorized: false } });
await c.connect();
const t = await c.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename");
console.log("tables:", t.rows.map(r => r.tablename).join(", "));
await c.end();
