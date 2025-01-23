import { appName } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { localeFromString } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { Order } from "@/lib/db";
import { listTours } from "@/actions/public/tour";

import Link from "next/link";
import { Container, Box, Grid, styled } from "@/styled-system/jsx";
import { Button } from "@/components/ui/button";
import { Item } from "@/components/tour/PublicItem";
import { Section } from "@/components/layout/Section";
import { ArrowRight } from "lucide-react";

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const locale = localeFromString((await params).locale);
  const dictionary = (await getDictionary(locale)).pages.public.index;

  const title = dictionary.meta.title;
  const description = dictionary.meta.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: appName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page({ params }: Props) {
  const locale = localeFromString((await params).locale);
  const dictionary = (await getDictionary(locale)).pages.public.index;
  const { result } = await listTours({
    perPage: 3,
    page: 1,
    order: Order.DESC,
    orderBy: "createdAt",
  });

  return (
    <>
      <Container pt={{ base: "10", lg: "20" }}>
        <Box
          display={{ base: "flex", lg: "grid" }}
          gridTemplateColumns="1fr 1fr"
          flexDirection="column-reverse"
          gap="8"
          alignItems="center"
        >
          <Box w="full">
            <styled.img
              src="/images/logo.png"
              alt="TAKASAKI TOURS"
              w={{ base: "320px", lg: "512px" }}
              maxW="100%"
              aspectRatio="797/64"
            />

            <styled.h2
              mt={{ base: "5", lg: "8" }}
              fontSize={{ base: "1.1rem", lg: "1.5rem" }}
              fontWeight="bold"
            >
              {dictionary.title}
            </styled.h2>

            <styled.p mt={{ base: "2", lg: "3" }}>
              {dictionary.overview}
            </styled.p>
          </Box>

          <styled.img
            src="/images/mv.jpg"
            alt="高崎市の風景"
            w="full"
            aspectRatio="1280/853"
          />
        </Box>
      </Container>

      <Container>
        <Section name={dictionary.sections.tours.name}>
          <Grid
            gridTemplateColumns={{
              base: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={{ base: "8", lg: "6" }}
          >
            {result?.map((tour) => (
              <Item key={tour.id} item={tour} locale={locale} />
            ))}
          </Grid>

          <Button asChild variant="link" mt={{ base: "8", lg: "12" }}>
            <Link href={`/${locale}/tour`}>
              {dictionary.sections.tours.more}
              <ArrowRight />
            </Link>
          </Button>
        </Section>
      </Container>
    </>
  );
}
