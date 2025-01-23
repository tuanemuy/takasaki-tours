import { InputKind } from "@/lib/form";
import {
  type RawSearchParams,
  SearchParams,
  handleActionError,
} from "@/lib/router";
import {
  ApplicationStatus,
  getApplicationStatusLabel,
} from "@/lib/core/application";
import {
  getApplicationWithCache,
  updateApplication,
} from "@/actions/auth/application";

import { Box } from "@/styled-system/jsx";
import { Main } from "@/components/layout/Main";
import { Header } from "@/components/layout/Header";
import { Form } from "@/components/form/Form";
import { Tour } from "../_components/Tour";

type Props = {
  params: Promise<{
    tourId: string;
    applicationId: string;
  }>;
  searchParams: Promise<RawSearchParams>;
};

export default async function Page({ params, searchParams }: Props) {
  const { tourId, applicationId } = await params;
  const sp = SearchParams.fromRaw(await searchParams);
  const { result, error } = await getApplicationWithCache(applicationId);
  const application = result?.at(0);

  if (!application) {
    handleActionError(error);
  } else {
    return (
      <Main>
        <Header
          text="申し込みを編集"
          returnUrl={`/user/tour/${tourId}/application?${sp.toString()}`}
        />

        <Box>
          <Tour tourId={tourId} />
        </Box>

        <Box>
          <Form
            name="edit-application"
            fields={[
              {
                name: "id",
                input: {
                  kind: InputKind.Hidden,
                  required: true,
                },
              },
              {
                name: "status",
                label: "ステータス",
                input: {
                  kind: InputKind.Select,
                  items: Object.values(ApplicationStatus).map((status) => ({
                    label: getApplicationStatusLabel(status),
                    value: status,
                  })),
                },
              },
              {
                name: "note",
                label: "メモ",
                input: {
                  kind: InputKind.Textarea,
                  rows: 5,
                },
              },
              {
                name: "date",
                label: "希望日時",
                input: {
                  kind: InputKind.Date,
                  defaultValue: application.date,
                  readOnly: true,
                  exclude: true,
                },
              },
              {
                name: "representative",
                label: "代表者氏名",
                input: {
                  kind: InputKind.Text,
                  defaultValue: application.representative,
                  exclude: true,
                  readOnly: true,
                },
              },
              {
                name: "email",
                label: "メールアドレス",
                input: {
                  kind: InputKind.Email,
                  defaultValue: application.email,
                  exclude: true,
                  readOnly: true,
                },
              },
              {
                name: "tel",
                label: "電話番号",
                input: {
                  kind: InputKind.Tel,
                  defaultValue: application.tel || "",
                  exclude: true,
                  readOnly: true,
                },
              },
              {
                name: "participants",
                label: "人数",
                input: {
                  kind: InputKind.Number,
                  defaultValue: application.participants.toString(),
                  exclude: true,
                  readOnly: true,
                },
              },
              {
                name: "participantsDetails",
                label: "参加者",
                input: {
                  kind: InputKind.Textarea,
                  defaultValue: application.participantsDetails,
                  exclude: true,
                  readOnly: true,
                  rows: 5,
                },
              },
              {
                name: "remarks",
                label: "備考",
                input: {
                  kind: InputKind.Textarea,
                  defaultValue: application.remarks || "",
                  exclude: true,
                  readOnly: true,
                  rows: 5,
                },
              },
              {
                name: "locale",
                label: "言語",
                input: {
                  kind: InputKind.Text,
                  defaultValue: application.locale,
                  exclude: true,
                  readOnly: true,
                },
              },
            ]}
            initialData={{
              id: application.id,
              note: application.note,
              status: application.status,
            }}
            formAction={updateApplication}
          />
        </Box>
      </Main>
    );
  }
}
