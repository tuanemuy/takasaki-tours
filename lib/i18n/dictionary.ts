import "server-only";
import { Locale } from "@/lib/i18n";

const dictionaries = {
  [Locale.JA]: () => import("@/lib/i18n/dictionaries/ja.json"),
  [Locale.EN]: () => import("@/lib/i18n/dictionaries/en.json"),
  [Locale.ZH_HANS]: () => import("@/lib/i18n/dictionaries/zh-Hans.json"),
  [Locale.ZH_HANT]: () => import("@/lib/i18n/dictionaries/zh-Hant.json"),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}
