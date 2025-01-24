import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig(
  process.env.DATABASE_AUTH_TOKEN
    ? {
        out: "./lib/db/drizzle",
        schema: "./lib/db/schema.ts",
        dialect: "turso",
        dbCredentials: {
          url: process.env.DATABASE_URL,
          authToken: process.env.DATABASE_AUTH_TOKEN,
        },
      }
    : {
        out: "./lib/db/drizzle",
        schema: "./lib/db/schema.ts",
        dialect: "sqlite",
        dbCredentials: {
          url: process.env.DATABASE_URL,
        },
      },
);
