import { notFound } from "next/navigation";
import { appName } from "@/lib/config";
import xss from "xss";
import type { Locale } from "@/lib/i18n";
import { localeFromString } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { extractDescription } from "@/lib/utils";
import { basePath } from "@/lib/core/file";
import { getContentFor } from "@/lib/core/content";
import { InputKind } from "@/lib/form";
import { nl2br } from "@/lib/utils";
import {
  listAllToursWithCache,
  getTourBySlugWithCache,
} from "@/actions/public/tour";
import { createApplication } from "@/actions/public/application";

import { Container, Box, Grid, styled } from "@/styled-system/jsx";
import { Section } from "@/components/layout/Section";
import { Form } from "@/components/form/Form";
import { Eyecatch } from "@/components/file/Eyecatch";
import { Information } from "./_components/Infomation";
import { Locations } from "./_components/Locations";
import { Schedules } from "./_components/Schedules";
import {
  Timer,
  WalletCards,
  AlarmClock,
  MapPin,
  CarFront,
  Shirt,
  UserMinus,
  UserPlus,
  Earth,
  MessageSquareWarning,
} from "lucide-react";

export const revalidate = 300;

export async function generateStaticParams() {
  const { result } = await listAllToursWithCache();
  return result?.map((t) => ({ tourSlug: t.slug })) || [];
}

type Props = {
  params: Promise<{
    tourSlug: string;
    locale: Locale;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const p = await params;
  const locale = localeFromString(p.locale);
  const slug = p.tourSlug;

  const { result } = await getTourBySlugWithCache(slug);
  const tour = result?.at(0);

  if (!tour) {
    notFound();
  }

  const content = getContentFor(tour.contents, locale);
  const file = tour.toursFiles.map((tf) => tf.file)[0];
  const assets = file?.assets || [];

  const title = `${content?.name || tour.name} | ${appName}`;
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
      url: `/${locale}/tour/${slug}`,
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
  const slug = p.tourSlug;
  const locale = localeFromString(p.locale);
  const _dictionary = await getDictionary(locale);
  const dictionary = {
    page: _dictionary.pages.public.tour.details,
    general: _dictionary.general,
  };
  const { result } = await getTourBySlugWithCache(slug);
  const tour = result?.at(0);

  if (!tour) {
    notFound();
  } else {
    const files = tour.toursFiles.map((tf) => tf.file);
    const content = getContentFor(tour.contents, locale);

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
                {content?.name || tour.name}
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

              <styled.hr
                h="1px"
                w="full"
                mt={{ base: "4", lg: "6" }}
                border="none"
                bg="border.default"
              />

              <Box mt={{ base: "4", lg: "6" }}>
                <Information
                  list={[
                    {
                      dt: dictionary.page.sections.header.headings.duration,
                      dd: content?.duration || "-",
                      icon: <Timer size={16} />,
                    },
                    {
                      dt: dictionary.page.sections.header.headings.price,
                      dd: content?.price || "-",
                      icon: <WalletCards size={16} />,
                    },
                  ]}
                  separator={dictionary.general.colon}
                />
              </Box>
            </Box>

            <Eyecatch files={files} alt={tour.name} />
          </Box>
        </Container>

        <Container>
          <Section name={dictionary.page.sections.locations.name}>
            <Locations tourId={tour.id} locale={locale} />
          </Section>
        </Container>

        <Container>
          <Section name={dictionary.page.sections.information.name}>
            <Grid
              gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }}
              gap={{ base: "2", lg: "6" }}
            >
              <Information
                list={[
                  {
                    dt: dictionary.page.sections.information.headings.price,
                    dd: content?.price || "-",
                    icon: <WalletCards size={16} />,
                  },
                  {
                    dt: dictionary.page.sections.information.headings.duration,
                    dd: content?.duration || "-",
                    icon: <Timer size={16} />,
                  },
                  {
                    dt: dictionary.page.sections.information.headings
                      .meetingTime,
                    dd: content?.meetingTime || "-",
                    icon: <AlarmClock size={16} />,
                  },
                  {
                    dt: dictionary.page.sections.information.headings
                      .meetingPoint,
                    dd: content?.meetingPoint || "-",
                    icon: <MapPin size={16} />,
                  },
                  {
                    dt: dictionary.page.sections.information.headings.parking,
                    dd: content?.parking || "-",
                    icon: <CarFront size={16} />,
                  },
                  {
                    dt: dictionary.page.sections.information.headings.clothing,
                    dd: content?.clothing || "-",
                    icon: <Shirt size={16} />,
                  },
                ]}
                separator={dictionary.general.colon}
              />
              <Information
                list={[
                  {
                    dt: dictionary.page.sections.information.headings
                      .minParticipants,
                    dd: `${content?.minParticipants || "-"} ${dictionary.page.sections.information.units.participants}`,
                    icon: <UserMinus size={16} />,
                  },
                  {
                    dt: dictionary.page.sections.information.headings
                      .maxParticipants,
                    dd: `${content?.maxParticipants || "-"} ${dictionary.page.sections.information.units.participants}`,
                    icon: <UserPlus size={16} />,
                  },
                  {
                    dt: dictionary.page.sections.information.headings.languages,
                    dd: content?.languages || "-",
                    icon: <Earth size={16} />,
                  },
                  {
                    dt: dictionary.page.sections.information.headings
                      .ageRestrictions,
                    dd: content?.ageRestrictions || "-",
                    icon: <MessageSquareWarning size={16} />,
                  },
                ]}
                separator={dictionary.general.colon}
              />
            </Grid>
          </Section>
        </Container>

        <Container>
          <Section name={dictionary.page.sections.services.name}>
            <styled.p>{content?.services || "-"}</styled.p>
          </Section>
        </Container>

        <Container>
          <Section name={dictionary.page.sections.schedules.name}>
            <Schedules schedules={content?.schedules || []} />
          </Section>
        </Container>

        <Container>
          <Section name={dictionary.page.sections.cancel.name}>
            <p
              dangerouslySetInnerHTML={{
                __html: nl2br(xss(content?.cancel || "")),
              }}
            />
          </Section>
        </Container>

        <Container>
          <Section name={dictionary.page.sections.application.name}>
            <styled.p>{dictionary.page.sections.application.note}</styled.p>

            <Box maxW="640px" mt={{ base: "4", lg: "6" }}>
              <Form
                name="create-application"
                fields={[
                  {
                    name: "tourId",
                    input: { kind: InputKind.Hidden, defaultValue: tour.id },
                  },
                  {
                    name: "locale",
                    input: { kind: InputKind.Hidden, defaultValue: locale },
                  },
                  {
                    name: "date",
                    label:
                      dictionary.page.sections.application.inputs.date.name,
                    input: { kind: InputKind.Date, required: true },
                  },
                  {
                    name: "representative",
                    label:
                      dictionary.page.sections.application.inputs.representative
                        .name,
                    input: { kind: InputKind.Text, required: true },
                  },
                  {
                    name: "participants",
                    label:
                      dictionary.page.sections.application.inputs.participants
                        .name,
                    input: { kind: InputKind.Number, required: true, min: 1 },
                  },
                  {
                    name: "participantsDetails",
                    label:
                      dictionary.page.sections.application.inputs
                        .participantsDetails.name,
                    note: `${
                      dictionary.page.sections.application.inputs
                        .participantsDetails.note
                    }<br/>【${dictionary.page.sections.application.requiredInformation}】&nbsp;${content?.requiredInformation || "-"}`,
                    input: {
                      kind: InputKind.Textarea,
                      required: true,
                      rows: 8,
                      placeholder:
                        dictionary.page.sections.application.inputs
                          .participantsDetails.placeholder,
                    },
                  },
                  {
                    name: "email",
                    label:
                      dictionary.page.sections.application.inputs.email.name,
                    input: { kind: InputKind.Email, required: true },
                  },
                  {
                    name: "tel",
                    label: dictionary.page.sections.application.inputs.tel.name,
                    input: { kind: InputKind.Tel },
                  },
                  {
                    name: "remarks",
                    label:
                      dictionary.page.sections.application.inputs.remarks.name,
                    input: { kind: InputKind.Textarea, rows: 5 },
                  },
                ]}
                formAction={createApplication}
                submitLabel={dictionary.page.sections.application.submit}
                hideError
                withRecaptcha
                confirmation={{
                  title:
                    dictionary.page.sections.application.confirmation.title,
                  description:
                    dictionary.page.sections.application.confirmation
                      .description,
                  confirm:
                    dictionary.page.sections.application.confirmation.confirm,
                }}
              />
            </Box>
          </Section>
        </Container>

        <Container>
          <Section name={dictionary.page.sections.contact.name}>
            <p
              dangerouslySetInnerHTML={{
                __html: nl2br(xss(content?.contact || "")),
              }}
            />
          </Section>
        </Container>
      </>
    );
  }
}
