import { localeFromString } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";

import { BreadCrumb } from "@/components/layout/BreadCrumb";

type Props = {
  params: Promise<{
    locale: string;
    locationId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const p = await params;
  const locale = localeFromString(p.locale);
  const id = p.locationId;
  const dictionary = (await getDictionary(locale)).pages.public.location.list;

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
          href: `/${locale}/location`,
          label: dictionary.h1,
        },
        {
          href: `/${locale}/location/${id}`,
          label: id,
        },
      ]}
    />
  );
}
