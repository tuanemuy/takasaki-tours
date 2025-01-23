"use server";

import { cache } from "react";
import type { z } from "zod";
import { sql, eq, ilike, and, asc, count } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { Logger } from "@/lib/logger";
import { tours, toursLocations } from "@/lib/db/schema";
import { TourStatus } from "@/lib/core/tour";
import { validateActionInput } from "@/lib/action";
import { ActionError } from "@/lib/action/error";
import {
  getTourSchema,
  getTourBySlugSchema,
  listToursSchema,
  listTourLocationsSchema,
} from "./schema";

const logger = new Logger();

export const getTourWithCache = cache(async (id: string) =>
  validateActionInput(_getTour, getTourSchema)({ id }),
);
async function _getTour(data: z.infer<typeof getTourSchema>) {
  try {
    const result = await db.query.tours.findMany({
      where: and(eq(tours.id, data.id), eq(tours.status, TourStatus.PUBLIC)),
      columns: {
        notifyTo: false,
      },
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
      },
    });
    return { data, result, count: result.length, error: null };
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}

export const getTourBySlugWithCache = cache(async (slug: string) =>
  validateActionInput(_getTourBySlug, getTourBySlugSchema)({ slug }),
);
async function _getTourBySlug(data: z.infer<typeof getTourBySlugSchema>) {
  try {
    const result = await db.query.tours.findMany({
      where: and(
        eq(tours.slug, data.slug),
        eq(tours.status, TourStatus.PUBLIC),
      ),
      columns: {
        notifyTo: false,
      },
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
      },
    });
    return { data, result, count: result.length, error: null };
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}

export const listTours = validateActionInput(_listTours, listToursSchema);
async function _listTours(data: z.infer<typeof listToursSchema>) {
  try {
    const filters = [
      eq(tours.status, TourStatus.PUBLIC),
      data.id ? ilike(tours.id, `%${data.id}%`) : undefined,
      data.name ? ilike(tours.name, `%${data.name}%`) : undefined,
      data.userId ? eq(tours.userId, data.userId) : undefined,
    ];
    const [result, counts] = await Promise.all([
      db.query.tours.findMany({
        where: and(...filters),
        orderBy: sql.raw(`tours.${data.orderBy} ${data.order}`),
        limit: data.perPage,
        offset: data.perPage * (data.page - 1),
        columns: {
          notifyTo: false,
        },
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

export const listAllToursWithCache = cache(async () => _listAllTours());
async function _listAllTours() {
  try {
    const result = await db.query.tours.findMany({
      where: eq(tours.status, TourStatus.PUBLIC),
      orderBy: [asc(tours.id)],
      columns: {
        notifyTo: false,
      },
    });

    return { result, error: null };
  } catch (e) {
    logger.error(e);
    return { error: ActionError.DatabaseError };
  }
}

export async function countTours() {
  try {
    const counts = await db
      .select({
        count: count(),
      })
      .from(tours)
      .where(eq(tours.status, TourStatus.PUBLIC));

    return { count: counts.at(0)?.count || 0, error: null };
  } catch (e) {
    logger.error(e);
    return { count: -1, error: ActionError.DatabaseError };
  }
}

export const listTourLocationsWithCache = cache(async (tourId: string) =>
  validateActionInput(_listTourLocations, listTourLocationsSchema)({ tourId }),
);
async function _listTourLocations(
  data: z.infer<typeof listTourLocationsSchema>,
) {
  try {
    const [result, counts] = await Promise.all([
      db.query.toursLocations.findMany({
        where: eq(toursLocations.tourId, data.tourId),
        orderBy: [asc(toursLocations.order)],
        with: {
          location: {
            with: {
              contents: true,
              locationsFiles: {
                orderBy: (locationsFiles, { asc }) => [
                  asc(locationsFiles.order),
                ],
                with: {
                  file: {
                    with: {
                      assets: true,
                    },
                  },
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
        .from(toursLocations)
        .where(eq(toursLocations.tourId, data.tourId)),
    ]);

    return {
      data,
      result: result.map((r) => r.location),
      count: counts.at(0)?.count || 0,
      error: null,
    };
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}
