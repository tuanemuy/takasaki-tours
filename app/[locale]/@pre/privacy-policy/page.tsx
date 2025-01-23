import { localeFromString } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";

import { BreadCrumb } from "@/components/layout/BreadCrumb";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: Props) {
  const locale = localeFromString((await params).locale);
  const dictionary = (await getDictionary(locale)).pages.public.privacyPolicy;

  return (
    <BreadCrumb
      links={[
        {
          href: "/",
          label: "/",
        },
        {
          href: `/${locale}`,
          label: locale,
        },
        {
          href: `/${locale}/pivacy-policy`,
          label: dictionary.h1,
        },
      ]}
    />
  );
}
