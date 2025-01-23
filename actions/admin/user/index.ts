"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { sql, eq, ilike, and, count } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { Logger } from "@/lib/logger";
import { requireAdmin, validateActionInput, formAction } from "@/lib/action";
import { ActionError } from "@/lib/action/error";
import {
  createUserSchema,
  listUsersSchema,
  updateUserSchema,
  deleteUserSchema,
} from "./schema";

const logger = new Logger();

export const listUsers = validateActionInput(
  requireAdmin(_listUsers),
  listUsersSchema,
);
async function _listUsers(data: z.infer<typeof listUsersSchema>) {
  try {
    const filters = [
      data.id ? ilike(users.id, `%${data.id}%`) : undefined,
      data.email ? ilike(users.email, `%${data.email}%`) : undefined,
      data.name ? ilike(users.name, `%${data.name}%`) : undefined,
      data.role ? eq(users.role, data.role) : undefined,
    ];
    const [result, counts] = await Promise.all([
      db
        .select()
        .from(users)
        .where(and(...filters))
        .orderBy(sql.raw(`locations.${data.orderBy} ${data.order}`))
        .limit(data.perPage)
        .offset(data.perPage * (data.page - 1)),
      db
        .select({
          count: count(),
        })
        .from(users)
        .where(and(...filters)),
    ]);

    return { data, result, count: counts[0]?.count || 0, error: null };
  } catch (e) {
    logger.error(e);
    return { data, result: [], count: -1, error: ActionError.DatabaseError };
  }
}

export const createUser = requireAdmin(_createUser);
export const createUserWithForm = formAction(createUser, createUserSchema);
async function _createUser(data: typeof users.$inferInsert) {
  try {
    const result = await db.insert(users).values(data).returning();
    if (result[0]) {
      redirect(`/admin/user/${result[0].id}`);
    }
    return {
      data,
      result: result,
      count: result.length,
      error: ActionError.DatabaseError,
    };
  } catch (e) {
    logger.error(e);
    return {
      data,
      count: -1,
      error: ActionError.DatabaseError,
    };
  }
}

export const updateUser = requireAdmin(
  validateActionInput(_updateUser, updateUserSchema),
);
export const updateUserWithForm = formAction(updateUser, updateUserSchema);
async function _updateUser(
  data: { id: string } & Partial<typeof users.$inferInsert>,
) {
  try {
    const result = await db
      .update(users)
      .set(data)
      .where(eq(users.id, data.id))
      .returning();
    revalidatePath("/user", "layout");
    revalidatePath("/admin", "layout");
    return {
      data,
      result: result,
      count: result.length,
      error: null,
    };
  } catch (e) {
    logger.error(e);
    return {
      data,
      count: -1,
      error: ActionError.DatabaseError,
    };
  }
}

export const deleteUser = requireAdmin(
  validateActionInput(_deleteUser, deleteUserSchema),
);
export const deleteUserWithForm = formAction(deleteUser, deleteUserSchema);
async function _deleteUser(data: z.infer<typeof deleteUserSchema>) {
  try {
    const result = await db
      .delete(users)
      .where(eq(users.id, data.id))
      .returning();
    if (result.length > 0) {
      revalidatePath("/admin/user", "page");
      redirect("/admin/user");
    } else {
      return {
        data,
        result,
        count: result.length,
        error: ActionError.DatabaseError,
      };
    }
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}
