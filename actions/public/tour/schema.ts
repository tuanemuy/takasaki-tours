import { z } from "zod";
import { Order } from "@/lib/db";

export const getTourSchema = z.object({
  id: z.string().cuid2(),
});

export const getTourBySlugSchema = z.object({
  slug: z.string().min(1),
});

export const listToursSchema = z.object({
  perPage: z.number(),
  page: z.number(),
  order: z.enum([Order.ASC, Order.DESC]),
  orderBy: z.string().min(1),
  id: z.string().min(1).nullish(),
  userId: z.string().cuid2().nullish(),
  name: z.string().min(1).nullish(),
});

export const listTourLocationsSchema = z.object({
  tourId: z.string().cuid2(),
});
