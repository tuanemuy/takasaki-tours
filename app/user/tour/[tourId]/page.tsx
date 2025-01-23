import { InputKind } from "@/lib/form";
import {
  type RawSearchParams,
  SearchParams,
  handleActionError,
} from "@/lib/router";
import { locales, defaultLocale, localeToLabel } from "@/lib/i18n";
import { Role } from "@/lib/core/user";
import { getContentFor } from "@/lib/core/content";
import type { NewSchedule } from "@/lib/core/schedule";
import {
  getTourWithCache,
  updateTour,
  updateTourContent,
  updateToursFiles,
  updateToursLocations,
  deleteTour,
} from "@/actions/auth/tour";

import Link from "next/link";
import { Box } from "@/styled-system/jsx";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Main } from "@/components/layout/Main";
import { Header } from "@/components/layout/Header";
import { Form } from "@/components/form/Form";
import { Delete } from "@/components/form/Delete";

type Props = {
  params: Promise<{
    tourId: string;
  }>;
  searchParams: Promise<RawSearchParams>;
};

export default async function Page({ params, searchParams }: Props) {
  const { tourId } = await params;
  const sp = SearchParams.fromRaw(await searchParams);
  const { result, error } = await getTourWithCache(tourId);
  const tour = result?.at(0);

  if (!tour) {
    handleActionError(error);
  } else {
    return (
      <Main>
        <Header
          text="ツアーを編集"
          returnUrl={`/user/tour?${sp.toString()}`}
          buttons={[
            <Button key="application" asChild variant="outline">
              <Link href={`/user/tour/${tourId}/application`}>
                申し込み一覧
              </Link>
            </Button>,
          ]}
        />

        <Box>
          <Heading as="h2" fontSize="lg">
            基本情報
          </Heading>

          <Box mt="4">
            <Form
              name="edit-tour"
              fields={[
                {
                  name: "id",
                  input: {
                    kind: InputKind.Hidden,
                    required: true,
                  },
                },
                {
                  name: "slug",
                  label: "スラッグ",
                  note: "半角英数字・5文字以上",
                  input: {
                    kind: InputKind.Text,
                    required: true,
                  },
                },
                {
                  name: "name",
                  label: "名称",
                  input: {
                    kind: InputKind.Text,
                    required: true,
                  },
                },
                {
                  name: "notifyTo",
                  label: "通知先メールアドレス",
                  input: {
                    kind: InputKind.Email,
                    required: true,
                  },
                },
              ]}
              initialData={{
                id: tour.id,
                name: tour.name,
                slug: tour.slug,
                notifyTo: tour.notifyTo,
              }}
              formAction={updateTour}
            />
          </Box>
        </Box>

        <Box>
          <Heading as="h2" fontSize="lg">
            画像
          </Heading>

          <Box mt="4">
            <Form
              name="edit-tours-files"
              fields={[
                {
                  name: "tourId",
                  input: {
                    kind: InputKind.Hidden,
                  },
                },
                {
                  name: "fileIds",
                  input: {
                    kind: InputKind.MultipleImage,
                    aspectRatio: 3 / 2,
                    resizes: [1280, 640],
                    displayWidth: 256,
                    noLabel: true,
                  },
                },
              ]}
              initialData={{
                tourId: tour.id,
                fileIds: tour.toursFiles.map((tf) => tf.fileId),
              }}
              formAction={updateToursFiles}
            />
          </Box>
        </Box>

        <Box>
          <Heading as="h2" fontSize="lg">
            訪れる場所
          </Heading>

          <Box mt="4">
            <Form
              name="edit-tours-locations"
              fields={[
                {
                  name: "tourId",
                  input: {
                    kind: InputKind.Hidden,
                  },
                },
                {
                  name: "locationIds",
                  input: {
                    kind: InputKind.MultipleTable,
                    noLabel: true,
                    table: "location",
                    role: Role.USER,
                    defaultLabels: tour.toursLocations.map(
                      (tl) => tl.location.name,
                    ),
                  },
                },
              ]}
              initialData={{
                tourId: tour.id,
                locationIds: tour.toursLocations.map((tl) => tl.locationId),
              }}
              formAction={updateToursLocations}
            />
          </Box>
        </Box>

        <Box>
          <Heading as="h2" fontSize="lg">
            詳細
          </Heading>

          <Tabs.Root defaultValue={defaultLocale} mt="4">
            <Tabs.List>
              {locales.map((locale) => (
                <Tabs.Trigger key={locale} value={locale}>
                  {localeToLabel(locale)}
                </Tabs.Trigger>
              ))}
              <Tabs.Indicator />
            </Tabs.List>
            {locales.map((locale) => {
              const content = getContentFor(tour.contents, locale);
              return (
                <Tabs.Content key={locale} value={locale}>
                  <Form
                    name={`edit-tour-content-${locale}`}
                    fields={[
                      {
                        name: "locale",
                        input: {
                          kind: InputKind.Hidden,
                        },
                      },
                      {
                        name: "tourId",
                        input: {
                          kind: InputKind.Hidden,
                        },
                      },
                      {
                        name: "name",
                        label: "名称",
                        input: {
                          kind: InputKind.Text,
                        },
                      },
                      {
                        name: "description",
                        label: "説明",
                        input: {
                          kind: InputKind.Textarea,
                          rows: 10,
                        },
                      },
                      {
                        name: "price",
                        label: "料金",
                        input: {
                          kind: InputKind.Text,
                          rows: 5,
                        },
                      },
                      {
                        name: "duration",
                        label: "所要時間",
                        input: {
                          kind: InputKind.Text,
                        },
                      },
                      {
                        name: "meetingTime",
                        label: "集合時間",
                        input: {
                          kind: InputKind.Text,
                        },
                      },
                      {
                        name: "meetingPoint",
                        label: "集合場所",
                        input: {
                          kind: InputKind.Text,
                        },
                      },
                      {
                        name: "parking",
                        label: "駐車場",
                        input: {
                          kind: InputKind.Text,
                        },
                      },
                      {
                        name: "clothing",
                        label: "服装",
                        input: {
                          kind: InputKind.Text,
                        },
                      },
                      {
                        name: "minParticipants",
                        label: "最少人数",
                        input: {
                          kind: InputKind.Number,
                        },
                      },
                      {
                        name: "maxParticipants",
                        label: "最大人数",
                        input: {
                          kind: InputKind.Number,
                        },
                      },
                      {
                        name: "languages",
                        label: "対応言語",
                        input: {
                          kind: InputKind.Text,
                        },
                      },
                      {
                        name: "ageRestrictions",
                        label: "年齢制限",
                        input: {
                          kind: InputKind.Text,
                        },
                      },
                      {
                        name: "services",
                        label: "料金に含まれるサービス",
                        input: {
                          kind: InputKind.Textarea,
                          rows: 5,
                        },
                      },
                      {
                        name: "cancel",
                        label: "キャンセルについて",
                        input: {
                          kind: InputKind.Textarea,
                          rows: 5,
                        },
                      },
                      {
                        name: "requiredInformation",
                        label: "必須項目",
                        input: {
                          kind: InputKind.Text,
                        },
                      },
                      {
                        name: "contact",
                        label: "問い合わせ先",
                        input: {
                          kind: InputKind.Textarea,
                          rows: 5,
                        },
                      },
                      {
                        name: "schedules",
                        label: "スケジュール",
                        input: {
                          kind: InputKind.Schedules,
                        },
                      },
                    ]}
                    initialData={{
                      tourId: tour.id,
                      locale,
                      name: content?.name ?? "",
                      description: content?.description,
                      price: content?.price,
                      duration: content?.duration,
                      meetingTime: content?.meetingTime,
                      meetingPoint: content?.meetingPoint,
                      parking: content?.parking,
                      clothing: content?.clothing,
                      minParticipants: content?.minParticipants,
                      maxParticipants: content?.maxParticipants,
                      languages: content?.languages,
                      ageRestrictions: content?.ageRestrictions,
                      services: content?.services,
                      cancel: content?.cancel,
                      requiredInformation: content?.requiredInformation,
                      contact: content?.contact,
                      schedules: content?.schedules as NewSchedule[],
                    }}
                    formAction={updateTourContent}
                  />
                </Tabs.Content>
              );
            })}
          </Tabs.Root>
        </Box>

        <Box>
          <Heading as="h2" fontSize="lg">
            削除
          </Heading>

          <Box mt="4">
            <Delete id={tourId} deleteAction={deleteTour} />
          </Box>
        </Box>
      </Main>
    );
  }
}
