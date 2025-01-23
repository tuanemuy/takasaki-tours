import { z } from "zod";
import { Order } from "@/lib/db";
import { Locale } from "@/lib/i18n";

export const createLocationSchema = z.object({
  name: z.string().min(1).max(50),
});

export const listLocationsSchema = z.object({
  perPage: z.number(),
  page: z.number(),
  order: z.enum([Order.ASC, Order.DESC]),
  orderBy: z.string().min(1),
  id: z.string().min(1).nullish(),
  userId: z.string().min(1).nullish(),
  name: z.string().min(1).nullish(),
});

export const updateLocationSchema = z.object({
  revisionId: z.string().cuid2().nullable(),
  name: z.string().min(1).max(50),
  locale: z.enum([Locale.JA, Locale.EN]),
  description: z.string().max(10000).nullish(),
  mapSrc: z.string().max(1000).nullish()
});
