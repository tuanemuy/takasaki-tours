import { z } from "zod";
import { Order } from "@/lib/db";
import { Locale } from "@/lib/i18n";
import { TextAreaSizes } from "@/lib/form";

export const createLocationSchema = z.object({
  name: z.string().min(1).max(TextAreaSizes.M),
  description: z.string().max(TextAreaSizes.XL).nullish(),
});

export const getLocationSchema = z.object({
  id: z.string().cuid2(),
});

export const listLocationsSchema = z.object({
  perPage: z.number(),
  page: z.number(),
  order: z.enum([Order.ASC, Order.DESC]),
  orderBy: z.string().min(1),
  id: z.string().min(1).nullish(),
  name: z.string().min(1).nullish(),
});

export const updateLocationSchema = z.object({
  id: z.string().cuid2(),
  name: z.string().min(1).max(TextAreaSizes.M),
});

export const updateLocationContentSchema = z.object({
  locationId: z.string().cuid2(),
  name: z.string().min(1).max(TextAreaSizes.M).nullish(),
  locale: z.enum([Locale.JA, Locale.EN, Locale.ZH_HANS, Locale.ZH_HANT]),
  description: z.string().max(TextAreaSizes.XL).nullish(),
  mapSrc: z.string().max(TextAreaSizes.L).nullish(),
});

export const updateLocationsFilesSchema = z.object({
  locationId: z.string().cuid2(),
  fileIds: z.array(z.string().cuid2()),
});

export const deleteLocationSchema = z.object({
  id: z.string().cuid2(),
});
