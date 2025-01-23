"use server";

import { cache } from "react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { sql, eq, ilike, gte, and, count } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { Logger } from "@/lib/logger";
import { defaultLocale } from "@/lib/i18n";
import { conflictUpdateAllExcept } from "@/lib/db";
import {
  tours,
  tourContents,
  toursFiles,
  toursLocations,
  schedules,
} from "@/lib/db/schema";
import {
  withAuth,
  requireAuth,
  validateActionInput,
  formAction,
} from "@/lib/action";
import { ActionError } from "@/lib/action/error";
import {
  createTourSchema,
  getTourSchema,
  listToursSchema,
  updateTourSchema,
  updateTourContentSchema,
  updateToursFilesSchema,
  updateToursLocationsSchema,
  deleteTourSchema,
} from "./schema";

const logger = new Logger();

export const createTour = formAction(withAuth(_createTour), createTourSchema);
async function _createTour(
  data: z.infer<typeof createTourSchema>,
  userId: string,
  redirectOnSuccess?: boolean,
) {
  let id: string;
  try {
    const result = await db.transaction(async (tx) => {
      const insertedTours = await tx
        .insert(tours)
        .values({
          userId,
          name: data.name,
          slug: data.slug,
          notifyTo: data.notifyTo,
        })
        .returning();

      const tour = insertedTours.at(0);
      if (!tour) {
        tx.rollback();
        throw new Error("Failed to insert tour.");
      }

      const insertedTourContents = await tx
        .insert(tourContents)
        .values({
          userId,
          tourId: tour.id,
          locale: defaultLocale,
          name: data.name,
          description: data.description,
        })
        .returning();

      return [
        {
          tour,
          contents: insertedTourContents,
        },
      ];
    });

    const tour = result.at(0)?.tour;
    if (tour) {
      revalidatePath("/user/tour", "layout");
    } else {
      throw new Error("Failed to insert tour.");
    }

    if (redirectOnSuccess) {
      id = tour.id;
    } else {
      return {
        data,
        result,
        count: result?.length,
        error: null,
      };
    }
  } catch (e) {
    logger.error(e);

    // @ts-ignore
    if (e.code === "SQLITE_CONSTRAINT") {
      return { data, count: -1, error: ActionError.UniqueConstraintError };
    }

    return { data, count: -1, error: ActionError.DatabaseError };
  }

  redirect(`/user/tour/${id}`);
}

export const getTourWithCache = cache(async (id: string) =>
  validateActionInput(withAuth(_getTour), getTourSchema)({ id }),
);
async function _getTour(data: z.infer<typeof getTourSchema>, userId: string) {
  try {
    const result = await db.query.tours.findMany({
      where: and(eq(tours.id, data.id), eq(tours.userId, userId)),
      with: {
        contents: {
          with: {
            schedules: true,
          },
        },
        toursFiles: {
          orderBy: (toursFiles, { asc }) => [asc(toursFiles.order)],
          with: {
            file: {
              with: {
                assets: true,
              },
            },
          },
        },
        toursLocations: {
          orderBy: (toursLocations, { asc }) => [asc(toursLocations.order)],
          with: {
            location: true,
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

export const listTours = validateActionInput(
  withAuth(_listTours),
  listToursSchema,
);
async function _listTours(
  data: z.infer<typeof listToursSchema>,
  userId: string,
) {
  try {
    const filters = [
      eq(tours.userId, userId),
      data.id ? ilike(tours.id, `%${data.id}%`) : undefined,
      data.name ? ilike(tours.name, `%${data.name}%`) : undefined,
    ];
    const [result, counts] = await Promise.all([
      db.query.tours.findMany({
        where: and(...filters),
        orderBy: sql.raw(`tours.${data.orderBy} ${data.order}`),
        limit: data.perPage,
        offset: data.perPage * (data.page - 1),
        with: {
          contents: true,
          toursFiles: {
            orderBy: (toursFiles, { asc }) => [asc(toursFiles.order)],
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
        .from(tours)
        .where(and(...filters)),
    ]);

    return { data, result, count: counts.at(0)?.count || 0, error: null };
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}

export const updateTour = formAction(withAuth(_updateTour), updateTourSchema);
async function _updateTour(
  data: z.infer<typeof updateTourSchema>,
  userId: string,
) {
  try {
    const result = await db
      .update(tours)
      .set({
        name: data.name,
        slug: data.slug,
        notifyTo: data.notifyTo,
      })
      .where(and(eq(tours.id, data.id), eq(tours.userId, userId)))
      .returning();

    revalidatePath("/user/tour", "layout");

    return {
      data,
      result,
      count: result.length,
      error: null,
    };
  } catch (e) {
    logger.error(e);

    // @ts-ignore
    if (e.code === "SQLITE_CONSTRAINT") {
      return { data, count: -1, error: ActionError.UniqueConstraintError };
    }

    return { data, count: -1, error: ActionError.DatabaseError };
  }
}

export const updateTourContent = formAction(
  withAuth(_updateTourContent),
  updateTourContentSchema,
);
async function _updateTourContent(
  data: z.infer<typeof updateTourContentSchema>,
  userId: string,
) {
  try {
    const result = await db.transaction(async (tx) => {
      const dataForTourContent = {
        userId,
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        meetingTime: data.meetingTime,
        meetingPoint: data.meetingPoint,
        parking: data.parking,
        clothing: data.clothing,
        minParticipants: data.minParticipants,
        maxParticipants: data.maxParticipants,
        languages: data.languages,
        ageRestrictions: data.ageRestrictions,
        services: data.services,
        cancel: data.cancel,
        requiredInformation: data.requiredInformation,
        contact: data.contact,
      };
      const updatedTourContents = await tx
        .insert(tourContents)
        .values({
          tourId: data.tourId,
          locale: data.locale,
          ...dataForTourContent,
        })
        .onConflictDoUpdate({
          target: [tourContents.tourId, tourContents.locale],
          set: dataForTourContent,
        })
        .returning();

      const updatedTourContent = updatedTourContents.at(0);
      if (!updatedTourContent) {
        tx.rollback();
        throw new Error("Failed to update tour content.");
      }

      const updatedSchedules = data.schedules
        ? await tx
            .insert(schedules)
            .values(
              data.schedules.map((schedule, index) => ({
                userId,
                tourContentId: updatedTourContent.id,
                order: index,
                kind: schedule.kind,
                heading: schedule.heading,
                details: schedule.details,
              })),
            )
            .onConflictDoUpdate({
              target: [schedules.tourContentId, schedules.order],
              set: conflictUpdateAllExcept(schedules),
            })
            .returning()
        : [];

      await tx
        .delete(schedules)
        .where(
          and(
            eq(schedules.userId, userId),
            eq(schedules.tourContentId, updatedTourContent.id),
            gte(schedules.order, data.schedules?.length || 0),
          ),
        );

      return [
        {
          tourContent: updatedTourContent,
          schedules: updatedSchedules,
        },
      ];
    });

    revalidatePath("/user/tour", "layout");

    return {
      data,
      result,
      count: result.length,
      error: null,
    };
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}

export const updateToursFiles = formAction(
  requireAuth(_updateToursFiles),
  updateToursFilesSchema,
);
async function _updateToursFiles(data: z.infer<typeof updateToursFilesSchema>) {
  try {
    const result = await db.transaction(async (tx) => {
      await tx.delete(toursFiles).where(eq(toursFiles.tourId, data.tourId));

      const result = await tx
        .insert(toursFiles)
        .values(
          data.fileIds.map((fileId, index) => ({
            tourId: data.tourId,
            fileId,
            order: index,
          })),
        )
        .onConflictDoUpdate({
          target: [toursFiles.tourId, toursFiles.fileId],
          set: conflictUpdateAllExcept(toursFiles),
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

export const updateToursLocations = formAction(
  requireAuth(_updateToursLocations),
  updateToursLocationsSchema,
);
async function _updateToursLocations(
  data: z.infer<typeof updateToursLocationsSchema>,
) {
  try {
    const result = await db.transaction(async (tx) => {
      await tx
        .delete(toursLocations)
        .where(eq(toursLocations.tourId, data.tourId));

      const result = await tx
        .insert(toursLocations)
        .values(
          data.locationIds.map((locationId, index) => ({
            tourId: data.tourId,
            locationId,
            order: index,
          })),
        )
        .onConflictDoUpdate({
          target: [toursLocations.tourId, toursLocations.locationId],
          set: conflictUpdateAllExcept(toursLocations),
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

export const deleteTour = formAction(withAuth(_deleteTour), deleteTourSchema);
async function _deleteTour(
  data: z.infer<typeof deleteTourSchema>,
  userId: string,
  redirectOnSuccess?: boolean,
) {
  try {
    const deletedTours = await db
      .delete(tours)
      .where(and(eq(tours.id, data.id), eq(tours.userId, userId)))
      .returning();

    revalidatePath("/user/tour", "layout");

    if (!redirectOnSuccess) {
      return {
        data,
        count: deletedTours.length,
        result: deletedTours,
        error: deletedTours.at(0) ? null : ActionError.DatabaseError,
      };
    }
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }

  redirect("/user/tour");
}
