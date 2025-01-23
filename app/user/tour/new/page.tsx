import { InputKind } from "@/lib/form";
import { createTour } from "@/actions/auth/tour";

import { Box } from "@/styled-system/jsx";
import { Main } from "@/components/layout/Main";
import { Header } from "@/components/layout/Header";
import { Form } from "@/components/form/Form";

export default async function Page() {
  return (
    <Main>
      <Header text="ツアーを追加" returnUrl="/user/tour" />

      <Box>
        <Form
          name="add-tour"
          fields={[
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
              name: "description",
              label: "説明",
              input: {
                kind: InputKind.Textarea,
                required: true,
                rows: 5,
              },
            },
          ]}
          formAction={createTour}
        />
      </Box>
    </Main>
  );
}
