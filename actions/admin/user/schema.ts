import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { Order } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { Role } from "@/lib/core/user";

export const createUserSchema = createInsertSchema(users);

export const listUsersSchema = z.object({
  perPage: z.number(),
  page: z.number(),
  order: z.enum([Order.ASC, Order.DESC]),
  orderBy: z.string().min(1),
  id: z.string().min(1).nullish(),
  email: z.string().min(1).nullish(),
  name: z.string().min(1).nullish(),
  role: z.enum([Role.ADMIN, Role.USER]).nullish(),
});

export const updateUserSchema = createUpdateSchema(users);

export const deleteUserSchema = z.object({
  id: z.string().cuid2(),
});
