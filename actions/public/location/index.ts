"use server";

import { cache } from "react";
import type { z } from "zod";
import { sql, eq, ilike, and, asc, count } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { Logger } from "@/lib/logger";
import { locations, toursLocations } from "@/lib/db/schema";
import { validateActionInput } from "@/lib/action";
import { ActionError } from "@/lib/action/error";
import {
  getLocationSchema,
  listLocationsSchema,
  listLocationToursSchema,
} from "./schema";

const logger = new Logger();

export const getLocationWithCache = cache(async (id: string) =>
  validateActionInput(_getLocation, getLocationSchema)({ id }),
);
async function _getLocation(data: z.infer<typeof getLocationSchema>) {
  try {
    const result = await db.query.locations.findMany({
      where: and(eq(locations.id, data.id)),
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
  _listLocations,
  listLocationsSchema,
);
async function _listLocations(data: z.infer<typeof listLocationsSchema>) {
  try {
    const filters = [
      data.id ? ilike(locations.id, `%${data.id}%`) : undefined,
      data.name ? ilike(locations.name, `%${data.name}%`) : undefined,
      data.userId ? eq(locations.userId, data.userId) : undefined,
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

export const listAllLocationsWithCache = cache(async () => _listAllLocations());
async function _listAllLocations() {
  try {
    const result = await db.query.tours.findMany({
      orderBy: [asc(locations.id)],
    });

    return { result, error: null };
  } catch (e) {
    logger.error(e);
    return { error: ActionError.DatabaseError };
  }
}

export async function countLocations() {
  try {
    const counts = await db
      .select({
        count: count(),
      })
      .from(locations);

    return { count: counts.at(0)?.count || 0, error: null };
  } catch (e) {
    logger.error(e);
    return { count: -1, error: ActionError.DatabaseError };
  }
}

export const listLocationToursWithCache = cache(async (locationId: string) =>
  validateActionInput(
    _listLocationTours,
    listLocationToursSchema,
  )({ locationId }),
);
async function _listLocationTours(
  data: z.infer<typeof listLocationToursSchema>,
) {
  try {
    const [result, counts] = await Promise.all([
      db.query.toursLocations.findMany({
        where: eq(toursLocations.locationId, data.locationId),
        orderBy: [asc(toursLocations.order)],
        with: {
          tour: {
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
          },
        },
      }),
      db
        .select({
          count: count(),
        })
        .from(toursLocations)
        .where(eq(toursLocations.locationId, data.locationId)),
    ]);

    return {
      data,
      result: result.map((r) => r.tour),
      count: counts.at(0)?.count || 0,
      error: null,
    };
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}
