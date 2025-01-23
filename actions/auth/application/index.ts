"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { sql, eq, ilike, and, count } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { Logger } from "@/lib/logger";
import { applications } from "@/lib/db/schema";
import {
  withAuth,
  requireAuth,
  validateActionInput,
  formAction,
} from "@/lib/action";
import { ActionError } from "@/lib/action/error";
import {
  getApplicationSchema,
  listTourApplicationsSchema,
  updateApplicationSchema,
} from "./schema";

const logger = new Logger();

export const getApplicationWithCache = cache(async (id: string) =>
  validateActionInput(_getApplication, getApplicationSchema)({ id }),
);
async function _getApplication(data: z.infer<typeof getApplicationSchema>) {
  try {
    const result = await db.query.applications.findMany({
      where: eq(applications.id, data.id),
    });

    return { data, result, count: result.length, error: null };
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}

export const listTourApplications = validateActionInput(
  requireAuth(_listTourApplications),
  listTourApplicationsSchema,
);
async function _listTourApplications(
  data: z.infer<typeof listTourApplicationsSchema>,
) {
  try {
    const filters = [
      eq(applications.tourId, data.tourId),
      data.id ? ilike(applications.id, `%${data.id}%`) : undefined,
      data.representative
        ? ilike(applications.representative, `%${data.representative}%`)
        : undefined,
      data.email ? ilike(applications.email, `%${data.email}%`) : undefined,
      data.status ? eq(applications.status, data.status) : undefined,
    ];
    const [result, counts] = await Promise.all([
      db.query.applications.findMany({
        where: and(...filters),
        orderBy: sql.raw(`applications.${data.orderBy} ${data.order}`),
        limit: data.perPage,
        offset: data.perPage * (data.page - 1),
      }),
      db
        .select({
          count: count(),
        })
        .from(applications)
        .where(and(...filters)),
    ]);

    return { data, result, count: counts.at(0)?.count || 0, error: null };
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}

export const updateApplication = formAction(
  withAuth(_updateApplication),
  updateApplicationSchema,
);
async function _updateApplication(
  data: z.infer<typeof updateApplicationSchema>,
) {
  try {
    const result = await db
      .update(applications)
      .set({
        status: data.status,
        note: data.note,
      })
      .where(eq(applications.id, data.id))
      .returning();

    if (result.length > 0) {
      revalidatePath(`/user/tour/${result[0].tourId}/application`, "page");
    }

    return {
      data,
      result,
      count: result.length,
      error: result.length > 0 ? null : ActionError.DatabaseError,
    };
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}
