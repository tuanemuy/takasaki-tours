"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users, profiles } from "@/lib/db/schema";
import { Logger } from "@/lib/logger";
import { withAuth, formAction } from "@/lib/action";
import { ActionError } from "@/lib/action/error";
import { updateUserSchema } from "./schema";

const logger = new Logger();

export const getUserWithCache = cache(async () => getUser({}));
export const getUser = withAuth(_getUser);
async function _getUser(data: { [key: string]: never }, userId: string) {
  try {
    const result = await db
      .select()
      .from(users)
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .where(eq(users.id, userId))
      .limit(1);

    return {
      data,
      result,
      count: result.length,
      error: result[0] ? null : ActionError.NotFoundError,
    };
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}

export const updateUserWithForm = formAction(
  withAuth(_updateUser),
  updateUserSchema,
);
async function _updateUser(
  data: z.infer<typeof updateUserSchema>,
  userId: string,
) {
  try {
    const result = await db.transaction(async (tx) => {
      const updatedUsers = await tx
        .update(users)
        .set({
          name: data.name,
        })
        .where(eq(users.id, userId))
        .returning();
      const updatedProfiles = await tx
        .insert(profiles)
        .values({
          userId,
          introduction: data.introduction,
          thumbnailId: data.thumbnailId,
        })
        .onConflictDoUpdate({
          target: profiles.userId,
          set: {
            introduction: data.introduction,
            thumbnailId: data.thumbnailId,
          },
        })
        .returning();

      return [
        {
          user: updatedUsers[0],
          profile: updatedProfiles[0],
        },
      ];
    });
    revalidatePath("/user", "layout");
    revalidatePath("/admin", "layout");
    return {
      data,
      result,
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
