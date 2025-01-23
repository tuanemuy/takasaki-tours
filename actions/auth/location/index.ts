"use server";

import { cache } from "react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { sql, eq, ilike, and, count } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { conflictUpdateAllExcept } from "@/lib/db";
import { Logger } from "@/lib/logger";
import { defaultLocale } from "@/lib/i18n";
import { locations, locationContents, locationsFiles } from "@/lib/db/schema";
import {
  withAuth,
  requireAuth,
  validateActionInput,
  formAction,
} from "@/lib/action";
import { ActionError } from "@/lib/action/error";
import {
  createLocationSchema,
  getLocationSchema,
  listLocationsSchema,
  updateLocationSchema,
  updateLocationContentSchema,
  updateLocationsFilesSchema,
  deleteLocationSchema,
} from "./schema";

const logger = new Logger();

export const createLocation = formAction(
  withAuth(_createLocation),
  createLocationSchema,
);
async function _createLocation(
  data: z.infer<typeof createLocationSchema>,
  userId: string,
  redirectOnSuccess: boolean,
) {
  let id: string;
  try {
    const result = await db.transaction(async (tx) => {
      const insertedLocations = await tx
        .insert(locations)
        .values({
          userId,
          name: data.name,
        })
        .returning();

      const location = insertedLocations.at(0);
      if (!location) {
        tx.rollback();
        throw new Error("Failed to insert location.");
      }

      const insertedLocationContents = await tx
        .insert(locationContents)
        .values({
          userId,
          locationId: location.id,
          locale: defaultLocale,
          name: data.name,
          description: data.description,
        })
        .returning();

      return [
        {
          location,
          contents: insertedLocationContents,
        },
      ];
    });

    const location = result.at(0)?.location;
    if (location) {
      revalidatePath("/user/location", "layout");
    } else {
      throw new Error("Failed to insert location,");
    }

    if (redirectOnSuccess) {
      id = location.id;
    } else {
      return {
        data,
        result,
        count: result.length,
        error: null,
      };
    }
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }

  redirect(`/user/location/${id}`);
}

export const getLocationWithCache = cache(async (id: string) =>
  validateActionInput(withAuth(_getLocation), getLocationSchema)({ id }),
);
async function _getLocation(
  data: z.infer<typeof getLocationSchema>,
  userId: string,
) {
  try {
    const result = await db.query.locations.findMany({
      where: and(eq(locations.id, data.id), eq(locations.userId, userId)),
      with: {
        contents: true,
        locationsFiles: {
          orderBy: (locationsFiles, { asc }) => [asc(locationsFiles.order)],
          with: {
            file: {
              with: {
                assets: true,
              },
            },
          },
        },
      },
    });
    return { data, result, count: result.length, error: null };
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}

export const listLocations = validateActionInput(
  withAuth(_listLocations),
  listLocationsSchema,
);
async function _listLocations(
  data: z.infer<typeof listLocationsSchema>,
  userId: string,
) {
  try {
    const filters = [
      eq(locations.userId, userId),
      data.id ? ilike(locations.id, `%${data.id}%`) : undefined,
      data.name ? ilike(locations.name, `%${data.name}%`) : undefined,
    ];
    const [result, counts] = await Promise.all([
      db.query.locations.findMany({
        where: and(...filters),
        orderBy: sql.raw(`locations.${data.orderBy} ${data.order}`),
        limit: data.perPage,
        offset: data.perPage * (data.page - 1),
        with: {
          contents: true,
          locationsFiles: {
            orderBy: (locationsFiles, { asc }) => [asc(locationsFiles.order)],
            with: {
              file: {
                with: {
                  assets: true,
                },
              },
            },
          },
        },
      }),
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
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}

export const updateLocation = formAction(
  withAuth(_updateLocation),
  updateLocationSchema,
);
async function _updateLocation(
  data: z.infer<typeof updateLocationSchema>,
  userId: string,
) {
  try {
    const result = await db
      .update(locations)
      .set({
        name: data.name,
      })
      .where(and(eq(locations.id, data.id), eq(locations.userId, userId)))
      .returning();

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

export const updateLocationContent = formAction(
  withAuth(_updateLocationContent),
  updateLocationContentSchema,
);
async function _updateLocationContent(
  data: z.infer<typeof updateLocationContentSchema>,
  userId: string,
) {
  try {
    const dataForLocationContent = {
      name: data.name,
      description: data.description,
      mapSrc: data.mapSrc,
    };
    const result = await db
      .insert(locationContents)
      .values({
        userId,
        locationId: data.locationId,
        locale: data.locale,
        ...dataForLocationContent,
      })
      .onConflictDoUpdate({
        target: [locationContents.locationId, locationContents.locale],
        set: dataForLocationContent,
      })
      .returning();

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

export const updateLocationsFiles = formAction(
  requireAuth(_updateLocationsFiles),
  updateLocationsFilesSchema,
);
async function _updateLocationsFiles(
  data: z.infer<typeof updateLocationsFilesSchema>,
) {
  try {
    const result = await db.transaction(async (tx) => {
      await tx
        .delete(locationsFiles)
        .where(eq(locationsFiles.locationId, data.locationId));

      const result = await tx
        .insert(locationsFiles)
        .values(
          data.fileIds.map((fileId, index) => ({
            locationId: data.locationId,
            fileId,
            order: index,
          })),
        )
        .onConflictDoUpdate({
          target: [locationsFiles.locationId, locationsFiles.fileId],
          set: conflictUpdateAllExcept(locationsFiles),
        })
        .returning();

      return result;
    });

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

export const deleteLocation = formAction(
  withAuth(_deleteLocation),
  deleteLocationSchema,
);
async function _deleteLocation(
  data: z.infer<typeof deleteLocationSchema>,
  userId: string,
  redirectOnSuccess?: boolean,
) {
  try {
    const result = await db
      .delete(locations)
      .where(and(eq(locations.id, data.id), eq(locations.userId, userId)))
      .returning();

    revalidatePath("/user/location", "layout");

    if (!redirectOnSuccess) {
      return {
        data,
        result,
        count: result.length,
        error: result.length > 0 ? null : ActionError.DatabaseError,
      };
    }
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }

  redirect("/user/location");
}
