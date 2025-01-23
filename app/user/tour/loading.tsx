import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { IconButton } from "@/components/ui/icon-button";
import { Main } from "@/components/layout/Main";
import { Header } from "@/components/layout/Header";
import { Plus } from "lucide-react";

export default async function Page() {
  return (
    <Main>
      <Header
        text="ツアー"
        buttons={[
          <IconButton key="add" variant="outline" size="sm" asChild>
            <Link href="/user/tour/new">
              <Plus />
            </Link>
          </IconButton>,
        ]}
      />

      <Skeleton h="md" />
    </Main>
  );
}
