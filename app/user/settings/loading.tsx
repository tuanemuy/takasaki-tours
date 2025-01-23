import { Skeleton } from "@/components/ui/skeleton";
import { Main } from "@/components/layout/Main";
import { Header } from "@/components/layout/Header";

export default async function Page() {
  return (
    <Main>
      <Header text="ユーザー設定" returnUrl="/user" />

      <Skeleton h="md" />
    </Main>
  );
}
