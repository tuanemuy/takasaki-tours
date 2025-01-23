import type { RawSearchParams } from "@/lib/router";
import { SearchParams } from "@/lib/router";
import { type Order, getOrderName, orderItems, defaultOrder } from "@/lib/db";
import { InputKind } from "@/lib/form";
import {
  ApplicationStatus,
  stringToApplicationStatus,
  getApplicationStatusLabel,
  getApplicationStatusColor,
} from "@/lib/core/application";
import { listTourApplications } from "@/actions/auth/application";

import Link from "next/link";
import { Box, HStack } from "@/styled-system/jsx";
import { IconButton } from "@/components/ui/icon-button";
import { Badge } from "@/components/ui/badge";
import { Table } from "@/components/ui/table";
import { Main } from "@/components/layout/Main";
import { Header } from "@/components/layout/Header";
import { Pagination } from "@/components/form/Pagination";
import { Search } from "@/components/form/Search";
import { Tour } from "./_components/Tour";
import { ListOrdered, ArrowUpDown, Layers, ChevronRight } from "lucide-react";

type Props = {
  params: Promise<{
    tourId: string;
  }>;
  searchParams: Promise<RawSearchParams>;
};

const defaultPerPage = 12;

export default async function Page({ params, searchParams }: Props) {
  const tourId = (await params).tourId;
  const rawSearchParams = await searchParams;
  const sp = SearchParams.fromRaw(rawSearchParams);
  const perPage = sp.getOneAsInt("perPage") ?? defaultPerPage;
  const page = sp.getOneAsInt("page") ?? 1;
  const order = (sp.getOne("order") as Order) ?? defaultOrder;
  const orderBy = sp.getOne("orderBy") ?? "createdAt";
  const id = sp.getOne("id");
  const representative = sp.getOne("representative");
  const email = sp.getOne("email");
  const rawStatus = sp.getOne("status");
  const status = rawStatus ? stringToApplicationStatus(rawStatus) : undefined;

  const { result, count } = await listTourApplications({
    tourId,
    perPage,
    page,
    order,
    orderBy,
    id,
    representative,
    email,
    status,
  });

  return (
    <Main>
      <Header
        text="申し込み"
        returnUrl={`/user/tour/${tourId}`}
        buttons={[
          <Search
            key="search"
            label="申し込み"
            action={`/user/tour/${tourId}/application`}
            fields={[
              {
                name: "id",
                label: "ID",
                input: {
                  kind: InputKind.Text,
                },
              },
              {
                name: "representative",
                label: "代表者氏名",
                input: {
                  kind: InputKind.Text,
                },
              },
              {
                name: "email",
                label: "メールアドレス",
                input: {
                  kind: InputKind.Text,
                },
              },
              {
                name: "status",
                label: "ステータス",
                input: {
                  kind: InputKind.Select,
                  items: Object.values(ApplicationStatus).map((value) => ({
                    label: getApplicationStatusLabel(value),
                    value,
                  })),
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
                    { label: "status", value: "status" },
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
        ]}
      />

      <Box>
        <Tour tourId={tourId} />
      </Box>

      <HStack gap="2" flexWrap="wrap">
        {id && <Badge>ID: {id}</Badge>}
        {email && <Badge>Email: {email}</Badge>}
        {representative && <Badge>Representative: {representative}</Badge>}
        {status && <Badge>Status: {getApplicationStatusLabel(status)}</Badge>}
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

      <Box overflowX="scroll">
        <Table.Root>
          <Table.Head>
            <Table.Row>
              <Table.Header>id</Table.Header>
              <Table.Header>status</Table.Header>
              <Table.Header>representative</Table.Header>
              <Table.Header>email</Table.Header>
              <Table.Header>createdAt</Table.Header>
              <Table.Header />
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {result?.map((item) => {
              return (
                <Table.Row key={item.id}>
                  <Table.Cell
                    maxW="32"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {item.id}
                  </Table.Cell>
                  <Table.Cell>
                    <Box
                      px="3"
                      py="1"
                      fontSize="0.75rem"
                      fontWeight="bold"
                      lineHeight="1.25"
                      color="bg.default"
                      bgColor={getApplicationStatusColor(item.status)}
                      borderRadius="100"
                      textAlign="center"
                    >
                      {getApplicationStatusLabel(item.status)}
                    </Box>
                  </Table.Cell>
                  <Table.Cell>{item.representative}</Table.Cell>
                  <Table.Cell>{item.email}</Table.Cell>
                  <Table.Cell>{item.createdAt}</Table.Cell>
                  <Table.Cell>
                    <HStack justifyContent="end" gap="2">
                      <IconButton variant="outline" size="xs" asChild>
                        <Link
                          href={`/user/tour/${tourId}/application/${item.id}`}
                        >
                          <ChevronRight />
                        </Link>
                      </IconButton>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>

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
