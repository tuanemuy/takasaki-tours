import type { Locale } from "@/lib/i18n";

export type Content = {
  locale: Locale;
};

export function getContentFor<T extends Content>(
  contents: T[],
  locale: Locale,
): T | null {
  return contents.filter((content) => content.locale === locale)[0] || null;
}
