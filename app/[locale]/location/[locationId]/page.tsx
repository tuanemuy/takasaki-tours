import { notFound } from "next/navigation";
import { appName } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { localeFromString } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { extractDescription } from "@/lib/utils";
import { basePath } from "@/lib/core/file";
import { getContentFor } from "@/lib/core/content";
import {
  listAllLocationsWithCache,
  getLocationWithCache,
} from "@/actions/public/location";

import { Container, Box, styled } from "@/styled-system/jsx";
import { Section } from "@/components/layout/Section";
import { Eyecatch } from "@/components/file/Eyecatch";
import { Tours } from "./_components/Tours";

export const revalidate = 300;

export async function generateStaticParams() {
  const { result } = await listAllLocationsWithCache();
  return result?.map((l) => ({ locationId: l.id })) || [];
}

type Props = {
  params: Promise<{
    locationId: string;
    locale: Locale;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const p = await params;
  const locale = localeFromString(p.locale);
  const id = p.locationId;

  const { result } = await getLocationWithCache(id);
  const location = result?.at(0);

  if (!location) {
    notFound();
  }

  const content = getContentFor(location.contents, locale);
  const file = location.locationsFiles.map((lf) => lf.file)[0];
  const assets = file?.assets || [];

  const title = `${content?.name || location.name} | ${appName}`;
  const description = extractDescription(content?.description || "");
  const images = assets.map((a) => ({
    url: `${basePath}/${a.path}`,
    width: a.width,
    height: file.aspectRatio
      ? Math.round(a.width / file.aspectRatio)
      : Math.round((a.width * 630) / 1200),
  }));

  return {
    title,
    description,
    openGraph: {
      url: `/${locale}/location/${id}`,
      title,
      description,
      siteName: appName,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function Page({ params }: Props) {
  const p = await params;
  const id = p.locationId;
  const locale = localeFromString(p.locale);
  const _dictionary = await getDictionary(locale);
  const dictionary = {
    page: _dictionary.pages.public.location.details,
    general: _dictionary.general,
  };
  const { result, error } = await getLocationWithCache(id);
  const location = result?.at(0);

  if (!location) {
    notFound();
  } else {
    const files = location.locationsFiles.map((lf) => lf.file);
    const content = getContentFor(location.contents, locale);

    return (
      <>
        <Container pt={{ base: "10", lg: "20" }}>
          <Box
            display={{ base: "flex", lg: "grid" }}
            gridTemplateColumns="1fr 1fr"
            flexDirection="column-reverse"
            gap="8"
          >
            <Box w="full">
              <styled.h1
                fontSize={{ base: "1.5rem", lg: "2rem" }}
                fontWeight="bold"
              >
                {content?.name || location.name}
              </styled.h1>

              <Box
                mt={{ base: "4", lg: "4" }}
                css={{
                  "& p:not(:first-child)": {
                    mt: "1rem",
                  },
                }}
              >
                {content?.description
                  ?.split(/\r?\n/)
                  .filter((p) => p !== "")
                  .map((p) => (
                    <p key={p}>{p}</p>
                  ))}
              </Box>
            </Box>

            <Eyecatch files={files} alt={location.name} />
          </Box>
        </Container>

        <Container>
          <Section name={dictionary.page.sections.tours.name}>
            <Tours locationId={id} locale={locale} />
          </Section>
        </Container>
      </>
    );
  }
}
