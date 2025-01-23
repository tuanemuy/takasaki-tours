import { z } from "zod";

export const deleteFileSchema = z.object({
  path: z.string().min(1),
});
