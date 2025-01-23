import { InputKind } from "@/lib/form";
import {
  type RawSearchParams,
  SearchParams,
  handleActionError,
} from "@/lib/router";
import { Locale, defaultLocale, localeToLabel } from "@/lib/i18n";
import { getContentFor } from "@/lib/core/content";
import {
  getLocationWithCache,
  updateLocation,
  updateLocationContent,
  updateLocationsFiles,
  deleteLocation,
} from "@/actions/auth/location";

import { Box } from "@/styled-system/jsx";
import { Heading } from "@/components/ui/heading";
import { Main } from "@/components/layout/Main";
import { Header } from "@/components/layout/Header";
import { Tabs } from "@/components/ui/tabs";
import { Form } from "@/components/form/Form";
import { Delete } from "@/components/form/Delete";

type Props = {
  params: Promise<{
    locationId: string;
  }>;
  searchParams: Promise<RawSearchParams>;
};

export default async function Page({ params, searchParams }: Props) {
  const { locationId } = await params;
  const sp = SearchParams.fromRaw(await searchParams);
  const { result, error } = await getLocationWithCache(locationId);
  const location = result?.at(0);

  if (!location) {
    handleActionError(error);
  } else {
    return (
      <Main>
        <Header
          text="場所を編集"
          returnUrl={`/user/location?${sp.toString()}`}
        />

        <Box>
          <Heading as="h2" fontSize="lg">
            基本情報
          </Heading>

          <Box mt="4">
            <Form
              name="edit-location"
              fields={[
                {
                  name: "id",
                  input: {
                    kind: InputKind.Hidden,
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
              ]}
              initialData={{
                id: location.id,
                name: location.name,
              }}
              formAction={updateLocation}
            />
          </Box>
        </Box>

        <Box>
          <Heading as="h2" fontSize="lg">
            画像
          </Heading>

          <Box mt="4">
            <Form
              name="edit-locations-files"
              fields={[
                {
                  name: "locationId",
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
                locationId: location.id,
                fileIds: location.locationsFiles.map((lf) => lf.fileId),
              }}
              formAction={updateLocationsFiles}
            />
          </Box>
        </Box>

        <Box>
          <Heading as="h2" fontSize="lg">
            詳細
          </Heading>

          <Tabs.Root defaultValue={defaultLocale} mt="4">
            <Tabs.List>
              {Object.values(Locale).map((locale) => (
                <Tabs.Trigger key={locale} value={locale}>
                  {localeToLabel(locale)}
                </Tabs.Trigger>
              ))}
              <Tabs.Indicator />
            </Tabs.List>
            {Object.values(Locale).map((locale) => {
              const content = getContentFor(location.contents, locale);
              return (
                <Tabs.Content key={locale} value={locale}>
                  <Form
                    name={`edit-location-content-${locale}`}
                    fields={[
                      {
                        name: "locale",
                        input: {
                          kind: InputKind.Hidden,
                        },
                      },
                      {
                        name: "locationId",
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
                        name: "mapSrc",
                        label: "埋め込み地図のURL",
                        input: {
                          kind: InputKind.Textarea,
                          rows: 5,
                        },
                      },
                    ]}
                    initialData={{
                      locale,
                      locationId: location.id,
                      name: content?.name,
                      description: content?.description,
                      mapSrc: content?.mapSrc,
                    }}
                    formAction={updateLocationContent}
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
            <Delete id={locationId} deleteAction={deleteLocation} />
          </Box>
        </Box>
      </Main>
    );
  }
}
