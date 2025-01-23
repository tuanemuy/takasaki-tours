import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const db = process.env.DATABASE_AUTH_TOKEN
  ? drizzle({
      connection: {
        url: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
      },
      schema,
    })
  : drizzle({
      connection: {
        url: process.env.DATABASE_URL,
      },
      schema,
    });
