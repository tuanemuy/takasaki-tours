import { getUserWithCache } from "@/actions/auth/user";
import { handleActionError } from "@/lib/router";
import { InputKind } from "@/lib/form";
import { signOut } from "@/lib/auth";
import { updateUserWithForm } from "@/actions/auth/user";

import { Box } from "@/styled-system/jsx";
import { Button } from "@/components/ui/button";
import { Main } from "@/components/layout/Main";
import { Header } from "@/components/layout/Header";
import { AddOrEditForm } from "@/components/form/AddOrEditForm";

export default async function Page() {
  const { result, error } = await getUserWithCache();
  const user = result?.[0]?.user;
  const profile = result?.[0]?.profile;
  if (!user) {
    return handleActionError(error);
  }

  return (
    <Main>
      <Header text="ユーザー設定" returnUrl="/user" />

      <Box>
        <AddOrEditForm
          name="edit-user"
          fields={[
            {
              name: "email",
              label: "Email",
              input: {
                kind: InputKind.Email,
                defaultValue: user.email || undefined,
                readOnly: true,
              },
            },
            {
              name: "name",
              label: "Name",
              input: {
                kind: InputKind.Text,
                required: true,
              },
            },
            {
              name: "introduction",
              label: "Introduction",
              input: {
                kind: InputKind.Textarea,
                rows: 5,
              },
            },
            {
              name: "thumbnailId",
              label: "Thumbnail",
              input: {
                kind: InputKind.Image,
                displayWidth: 256,
                resizes: [1024],
                aspectRatio: 1,
              },
            },
          ]}
          initialData={{
            name: user.name || "",
            introduction: profile?.introduction,
            thumbnailId: profile?.thumbnailId,
          }}
          addOrEdit={updateUserWithForm}
        />
      </Box>

      <Box>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button type="submit" variant="subtle" size="sm">
            ログアウト
          </Button>
        </form>
      </Box>
    </Main>
  );
}
