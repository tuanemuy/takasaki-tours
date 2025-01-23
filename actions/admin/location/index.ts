"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { sql, eq, ilike, and, count } from "drizzle-orm";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { Order } from "@/lib/db";
import { db } from "@/lib/db/client";
import { locations } from "@/lib/db/schema";
import { Logger } from "@/lib/logger";
import {
  requireAdmin,
  validateActionInput,
  validateActionResult,
  formAction,
} from "@/lib/action";
import { ActionError } from "@/lib/action/error";
import { listLocationsSchema } from "./schema";

const logger = new Logger();
export const listLocations = validateActionInput(
  validateActionResult(
    requireAdmin(_listLocations),
    createSelectSchema(locations),
  ),
  listLocationsSchema,
);
async function _listLocations(data: z.infer<typeof listLocationsSchema>) {
  try {
    const filters = [
      data.id ? ilike(locations.id, `%${data.id}%`) : undefined,
      data.userId ? eq(locations.userId, data.userId) : undefined,
      data.name ? ilike(locations.name, `%${data.name}%`) : undefined,
    ];
    const [result, counts] = await Promise.all([
      db
        .select()
        .from(locations)
        .where(and(...filters))
        .orderBy(sql.raw(`locations.${data.orderBy} ${data.order}`))
        .limit(data.perPage)
        .offset(data.perPage * (data.page - 1)),
      db
        .select({
          count: count(),
        })
        .from(locations)
        .where(and(...filters)),
    ]);

    return { data, result, count: counts.at(0)?.count || 0, error: null };
  } catch (e) {
    logger.error(e);
    return { data, result: [], count: -1, error: ActionError.DatabaseError };
  }
}
