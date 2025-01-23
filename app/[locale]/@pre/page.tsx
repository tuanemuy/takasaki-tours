import { localeFromString } from "@/lib/i18n";

import { BreadCrumb } from "@/components/layout/BreadCrumb";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: Props) {
  const locale = localeFromString((await params).locale);

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
      ]}
    />
  );
}
