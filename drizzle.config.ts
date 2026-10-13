import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// Next.js loads .env.local automatically; drizzle-kit needs it explicitly.
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
