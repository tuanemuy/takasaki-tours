import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./lib/db/drizzle",
  schema: "./lib/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
