import type { Locale } from "@/lib/i18n";
import { localeFromString } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";

import Link from "next/link";
import { Container, styled } from "@/styled-system/jsx";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{
    tourSlug: string;
    locale: Locale;
  }>;
};

export default async function Page({ params }: Props) {
  const p = await params;
  const slug = p.tourSlug;
  const locale = localeFromString(p.locale);
  const dictionary = (await getDictionary(locale)).pages.public.tour.thanks;

  return (
    <Container pt={{ base: "10", lg: "20" }}>
      <styled.h1 fontSize="2rem" fontWeight="bold">
        {dictionary.title}
      </styled.h1>
      <styled.p
        mt="4"
        dangerouslySetInnerHTML={{ __html: dictionary.message }}
      />

      <Button asChild variant="outline" mt="6">
        <Link href={`/${locale}/tour/${slug}`}>{dictionary.back}</Link>
      </Button>
    </Container>
  );
}
