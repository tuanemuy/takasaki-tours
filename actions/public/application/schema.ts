import { z } from "zod";
import { TextAreaSizes } from "@/lib/form";
import { Locale } from "@/lib/i18n";

export const createApplicationSchema = z.object({
  tourId: z.string().cuid2(),
  date: z.string().min(1).max(TextAreaSizes.S),
  representative: z.string().min(1).max(TextAreaSizes.S),
  participants: z.number().int(),
  participantsDetails: z.string().min(1).max(TextAreaSizes.L),
  email: z.string().email(),
  tel: z.string().max(TextAreaSizes.S).nullish(),
  remarks: z.string().max(TextAreaSizes.L).nullish(),
  locale: z.enum([Locale.JA, Locale.EN, Locale.ZH_HANS, Locale.ZH_HANT]),
});
