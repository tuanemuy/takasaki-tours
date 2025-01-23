import { appName } from "@/lib/config";
import type { RawSearchParams } from "@/lib/router";
import { SearchParams } from "@/lib/router";
import type { Locale } from "@/lib/i18n";
import { localeFromString } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { defaultOrder } from "@/lib/db";
import { listTours } from "@/actions/public/tour";

import { Container, Grid, styled } from "@/styled-system/jsx";
import { Item } from "@/components/tour/PublicItem";
import { Pagination } from "@/components/form/Pagination";

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
  searchParams: Promise<RawSearchParams>;
};

export async function generateMetadata({ params }: Props) {
  const locale = localeFromString((await params).locale);
  const dictionary = (await getDictionary(locale)).pages.public.tour.list;

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

export default async function Page({ params, searchParams }: Props) {
  const locale = localeFromString((await params).locale);
  const dictionary = (await getDictionary(locale)).pages.public.tour.list;
  const rawSearchParams = await searchParams;
  const sp = SearchParams.fromRaw(rawSearchParams);
  const perPage = 12;
  const page = sp.getOneAsInt("page") ?? 1;

  const { result, count } = await listTours({
    perPage,
    page,
    order: defaultOrder,
    orderBy: "createdAt",
  });

  return (
    <>
      <Container pt={{ base: "10", lg: "20" }}>
        <styled.h1 fontSize="2rem" fontWeight="bold">
          {dictionary.h1}
        </styled.h1>
      </Container>

      <Container pt={{ base: "10", lg: "20" }}>
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
      </Container>

      <Container pt={{ base: "10", lg: "20" }}>
        <Pagination
          count={count}
          perPage={perPage}
          page={page}
          redirect={{ basePath: "/tour", rawSearchParams }}
        />
      </Container>
    </>
  );
}
