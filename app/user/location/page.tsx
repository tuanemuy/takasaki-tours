import type { RawSearchParams } from "@/lib/router";
import { SearchParams } from "@/lib/router";
import { type Order, getOrderName } from "@/lib/db";
import { orderItems, defaultOrder } from "@/lib/db";
import { InputKind } from "@/lib/form";
import { listLocations } from "@/actions/auth/location";

import Link from "next/link";
import { Grid, HStack } from "@/styled-system/jsx";
import { IconButton } from "@/components/ui/icon-button";
import { Badge } from "@/components/ui/badge";
import { Main } from "@/components/layout/Main";
import { Header } from "@/components/layout/Header";
import { Search } from "@/components/form/Search";
import { Pagination } from "@/components/form/Pagination";
import { Item } from "@/components/location/Item";
import { Plus, ListOrdered, ArrowUpDown, Layers } from "lucide-react";

type Props = {
  searchParams: Promise<RawSearchParams>;
};

const defaultPerPage = 12;

export default async function Page({ searchParams }: Props) {
  const rawSearchParams = await searchParams;
  const sp = SearchParams.fromRaw(rawSearchParams);
  const perPage = sp.getOneAsInt("perPage") ?? defaultPerPage;
  const page = sp.getOneAsInt("page") ?? 1;
  const order = (sp.getOne("order") as Order) ?? defaultOrder;
  const orderBy = sp.getOne("orderBy") ?? "createdAt";
  const id = sp.getOne("id");
  const name = sp.getOne("name");

  const { result, count } = await listLocations({
    perPage,
    page,
    order,
    orderBy,
    id,
    name,
  });

  return (
    <Main>
      <Header
        text="場所"
        buttons={[
          <Search
            key="search"
            label="場所"
            action="/user/location"
            fields={[
              {
                name: "id",
                label: "ID",
                input: {
                  kind: InputKind.Text,
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
                name: "orderBy",
                label: "並び替え",
                input: {
                  kind: InputKind.Select,
                  defaultValue: "id",
                  items: [
                    { label: "id", value: "id" },
                    { label: "name", value: "name" },
                    { label: "createdAt", value: "createdAt" },
                    { label: "updatedAt", value: "updatedAt" },
                  ],
                },
              },
              {
                name: "order",
                label: "順序",
                input: {
                  kind: InputKind.Select,
                  defaultValue: defaultOrder,
                  items: orderItems,
                },
              },
              {
                name: "perPage",
                label: "件数",
                input: {
                  kind: InputKind.Number,
                  defaultValue: defaultPerPage.toString(),
                },
              },
            ]}
            rawSearchParams={rawSearchParams}
          />,
          <IconButton key="add" variant="outline" size="sm" asChild>
            <Link href="/user/location/new">
              <Plus />
            </Link>
          </IconButton>,
        ]}
      />

      <HStack gap="2" flexWrap="wrap">
        {id && <Badge>ID: {id}</Badge>}
        {name && <Badge>Name: {name}</Badge>}
        {
          <Badge>
            <ListOrdered />
            {orderBy}
          </Badge>
        }
        {
          <Badge>
            <ArrowUpDown />
            {getOrderName(order)}
          </Badge>
        }
        {
          <Badge>
            <Layers />
            {perPage}
          </Badge>
        }
      </HStack>

      <Grid
        gridTemplateColumns={{
          base: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          xl: "repeat(4, 1fr)",
        }}
        gap="4"
      >
        {result?.map((location) => (
          <Link
            key={location.id}
            href={`/user/location/${location.id}?${sp.toString()}`}
            passHref
            legacyBehavior
          >
            <Item key={location.id} item={location} isButton />
          </Link>
        ))}
      </Grid>

      <HStack justifyContent="end">
        <Pagination
          count={count}
          perPage={perPage}
          page={page}
          redirect={{ basePath: "/user/location", rawSearchParams }}
        />
      </HStack>
    </Main>
  );
}
