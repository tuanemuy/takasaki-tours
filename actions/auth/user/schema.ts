import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(1).max(50),
  introduction: z.string().nullish(),
  thumbnailId: z.string().cuid2().nullish(),
});
