import { z } from "zod";
import { Order } from "@/lib/db";
import { ApplicationStatus } from "@/lib/core/application";
import { TextAreaSizes } from "@/lib/form";

export const getApplicationSchema = z.object({
  id: z.string().cuid2(),
});

export const listTourApplicationsSchema = z.object({
  tourId: z.string().cuid2(),
  perPage: z.number(),
  page: z.number(),
  order: z.enum([Order.ASC, Order.DESC]),
  orderBy: z.string().min(1),
  id: z.string().min(1).nullish(),
  representative: z.string().min(1).nullish(),
  email: z.string().min(1).nullish(),
  status: z
    .enum([
      ApplicationStatus.NEW,
      ApplicationStatus.APPROVED,
      ApplicationStatus.CANCELED,
      ApplicationStatus.REJECTED,
    ])
    .nullish(),
});

export const updateApplicationSchema = z.object({
  id: z.string().cuid2(),
  status: z.enum([
    ApplicationStatus.NEW,
    ApplicationStatus.APPROVED,
    ApplicationStatus.CANCELED,
    ApplicationStatus.REJECTED,
  ]),
  note: z.string().max(TextAreaSizes.M).nullish(),
});
