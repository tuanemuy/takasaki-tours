import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const tursoAuthToken = process.env.DATABASE_AUTH_TOKEN || undefined;

export default defineConfig(
  tursoAuthToken
    ? {
        out: "./lib/db/drizzle",
        schema: "./lib/db/schema.ts",
        dialect: "turso",
        dbCredentials: {
          url: process.env.DATABASE_URL,
          authToken: tursoAuthToken,
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
