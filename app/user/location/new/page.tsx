import { InputKind } from "@/lib/form";
import { createLocation } from "@/actions/auth/location";

import { Box } from "@/styled-system/jsx";
import { Main } from "@/components/layout/Main";
import { Header } from "@/components/layout/Header";
import { Form } from "@/components/form/Form";

export default async function Page() {
  return (
    <Main>
      <Header text="場所を追加" returnUrl="/user/location" />

      <Box>
        <Form
          name="add-location"
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
              name: "description",
              label: "説明",
              input: {
                kind: InputKind.Textarea,
                required: true,
                rows: 5,
              },
            },
          ]}
          formAction={createLocation}
        />
      </Box>
    </Main>
  );
}
