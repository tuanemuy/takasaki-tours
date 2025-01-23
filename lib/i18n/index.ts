import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

export const Locale = {
  JA: "ja",
  EN: "en",
  ZH_HANS: "zh-Hans",
  ZH_HANT: "zh-Hant",
} as const;
export type Locale = (typeof Locale)[keyof typeof Locale];

export const defaultLocale = Locale.JA;
export const locales = Object.values(Locale);

export function localeFromString(value: string): Locale {
  switch (value) {
    case "ja":
      return Locale.JA;
    case "en":
      return Locale.EN;
    case "zh-Hans":
      return Locale.ZH_HANS;
    case "zh-Hant":
      return Locale.ZH_HANT;
    default:
      return defaultLocale;
  }
}

export function localeFromRequest(request: NextRequest): string | undefined {
  const languages = new Negotiator({
    headers: Object.fromEntries(request.headers.entries()),
  }).languages();
  return match(languages, locales, defaultLocale);
}

export function localeToLabel(locale: Locale) {
  switch (locale) {
    case Locale.JA:
      return "ja";
    case Locale.EN:
      return "en";
    case Locale.ZH_HANS:
      return "zh-Hans";
    case Locale.ZH_HANT:
      return "zh-Hant";
    default:
      locale satisfies never;
  }
}
