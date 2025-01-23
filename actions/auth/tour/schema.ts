import { z } from "zod";
import { Order } from "@/lib/db";
import { Locale } from "@/lib/i18n";
import { ScheduleKind } from "@/lib/core/schedule";
import { TextAreaSizes } from "@/lib/form";

const slugPattern = /^[A-Za-z]\w+/;

export const createTourSchema = z.object({
  slug: z.string().regex(slugPattern).min(5).max(TextAreaSizes.S),
  notifyTo: z.string().email(),
  name: z.string().min(1).max(TextAreaSizes.M),
  description: z.string().max(TextAreaSizes.XL).nullish(),
});

export const getTourSchema = z.object({
  id: z.string().cuid2(),
});

export const listToursSchema = z.object({
  perPage: z.number(),
  page: z.number(),
  order: z.enum([Order.ASC, Order.DESC]),
  orderBy: z.string().min(1),
  id: z.string().min(1).nullish(),
  name: z.string().min(1).nullish(),
});

export const updateTourSchema = z.object({
  id: z.string().cuid2(),
  name: z.string().min(1).max(TextAreaSizes.M),
  slug: z.string().regex(slugPattern).min(5).max(TextAreaSizes.S),
  notifyTo: z.string().email(),
});

export const updateTourContentSchema = z.object({
  tourId: z.string().cuid2(),
  name: z.string().min(1).max(TextAreaSizes.M),
  locale: z.enum([Locale.JA, Locale.EN, Locale.ZH_HANS, Locale.ZH_HANT]),
  description: z.string().max(TextAreaSizes.XL).nullish(),
  price: z.string().max(TextAreaSizes.M).nullish(),
  duration: z.string().max(TextAreaSizes.M).nullish(),
  meetingTime: z.string().max(TextAreaSizes.M).nullish(),
  meetingPoint: z.string().max(TextAreaSizes.M).nullish(),
  parking: z.string().max(TextAreaSizes.M).nullish(),
  clothing: z.string().max(TextAreaSizes.M).nullish(),
  minParticipants: z.number().int().nullish(),
  maxParticipants: z.number().int().nullish(),
  languages: z.string().max(TextAreaSizes.M).nullish(),
  ageRestrictions: z.string().max(TextAreaSizes.M).nullish(),
  services: z.string().max(TextAreaSizes.L).nullish(),
  cancel: z.string().max(TextAreaSizes.L).nullish(),
  requiredInformation: z.string().max(TextAreaSizes.M).nullish(),
  contact: z.string().max(TextAreaSizes.L).nullish(),
  schedules: z
    .array(
      z.object({
        kind: z.enum([ScheduleKind.LOCATION, ScheduleKind.MOVEMENT]),
        heading: z.string().min(1).max(TextAreaSizes.S),
        details: z.string().max(TextAreaSizes.M).nullish(),
      }),
    )
    .optional(),
});

export const updateToursFilesSchema = z.object({
  tourId: z.string().cuid2(),
  fileIds: z.array(z.string().cuid2()),
});

export const updateToursLocationsSchema = z.object({
  tourId: z.string().cuid2(),
  locationIds: z.array(z.string().cuid2()),
});

export const deleteTourSchema = z.object({
  id: z.string().cuid2(),
});
