import { localeFromString } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: Props) {
  const locale = localeFromString((await params).locale);
  const dictionary = (await getDictionary(locale)).pages.public.index;

  return dictionary.h1;
}
