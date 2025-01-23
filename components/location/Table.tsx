"use client";

import { useState, useEffect } from "react";
import { Order, getOrderName, orderItems } from "@/lib/db";
import type { RawSearchParams } from "@/lib/router";
import { SearchParams } from "@/lib/router";
import { InputKind } from "@/lib/form";
import { Role } from "@/lib/core/user";
import type { Location } from "@/lib/core/location";
import { listLocations as listLocationsForAdmin } from "@/actions/admin/location";
import { listLocations as listLocationsForUser } from "@/actions/auth/location";
import type { TableAction } from "@/types/table";

import { Box, Stack, HStack } from "@/styled-system/jsx";
import { IconButton } from "@/components/ui/icon-button";
import { Table as TableUI } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "@/components/form/Search";
import { Pagination } from "@/components/form/Pagination";

type Props = {
  rawSearchParams?: RawSearchParams;
  actions?: TableAction[];
  role: Role;
};

const defaultPerPage = "30";
const defaultPage = "1";
const defaultOrder = Order.ASC;
const defaultOrderBy = "id";

export function Table({ rawSearchParams, actions, role }: Props) {
  const searchParams = rawSearchParams
    ? SearchParams.fromRaw(rawSearchParams)
    : new SearchParams({});
  const defaultValues = {
    perPage: searchParams.getOne("perPage") || defaultPerPage,
    page: searchParams.getOne("page") || defaultPage,
    order: searchParams.getOne("order") || defaultOrder,
    orderBy: searchParams.getOne("orderBy") || defaultOrderBy,
    id: searchParams.getOne("id"),
    userId: searchParams.getOne("userId"),
    name: searchParams.getOne("name"),
  };
  type Params = typeof defaultValues;
  const [params, setParams] = useState(defaultValues);
  const [items, setItems] = useState<Location[] | null>(null);
  const [count, setCount] = useState(0);

  const listLocations =
    role === Role.ADMIN ? listLocationsForAdmin : listLocationsForUser;
  const fetchLocations = async (params: Params) => {
    const { result, count } = await listLocations({
      perPage: Number.parseInt(params.perPage, 10),
      page: Number.parseInt(params.page, 10),
      order: (params.order || defaultOrder) as Order,
      orderBy: params.orderBy || defaultOrderBy,
      id: params.id,
      userId: params.userId,
      name: params.name,
    });
    setItems(result || []);
    setCount(count);
  };

  // biome-ignore lint:
  useEffect(() => {
    fetchLocations(defaultValues);
  }, []);

  return (
    <Stack gap="6" overflowX="hidden">
      <HStack gap="2" flexWrap="wrap">
        {params.id && <Badge>id: {params.id}</Badge>}
        {params.name && <Badge>name: {params.name}</Badge>}
        {params.userId && <Badge>userId: {params.userId}</Badge>}
        {params.perPage && <Badge>perPage: {params.perPage}</Badge>}
        {params.orderBy && <Badge>orderBy: {params.orderBy}</Badge>}
        {params.order && (
          <Badge>order: {getOrderName(params.order as Order)}</Badge>
        )}
      </HStack>
      {!items && <Skeleton h="sm" />}
      {items && (
        <Box overflowX="scroll">
          <TableUI.Root>
            <TableUI.Head>
              <TableUI.Row>
                <TableUI.Header>id</TableUI.Header>
                <TableUI.Header>name</TableUI.Header>
                <TableUI.Header />
              </TableUI.Row>
            </TableUI.Head>
            <TableUI.Body>
              {items?.map((item) => {
                return (
                  <TableUI.Row key={item.id}>
                    <TableUI.Cell
                      maxW="32"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {item.id}
                    </TableUI.Cell>
                    <TableUI.Cell>{item.name}</TableUI.Cell>
                    <TableUI.Cell>
                      <HStack justifyContent="end" gap="2">
                        {actions?.map((action) => {
                          return (
                            <IconButton
                              key={action.name}
                              type="button"
                              onClick={() =>
                                action.onClick(item.id, item.name || undefined)
                              }
                              variant="outline"
                              size="xs"
                            >
                              <action.icon />
                            </IconButton>
                          );
                        })}
                      </HStack>
                    </TableUI.Cell>
                  </TableUI.Row>
                );
              })}
            </TableUI.Body>
          </TableUI.Root>
        </Box>
      )}
      <HStack justifyContent="end" gap="4">
        {count > 0 && (
          <Pagination
            count={count}
            perPage={Number.parseInt(params.perPage, 10)}
            page={Number.parseInt(params.page, 10)}
            onChange={(page) => {
              setParams((prev) => ({ ...prev, page: page.toString() }));
              fetchLocations({ ...params, page: page.toString() });
            }}
          />
        )}
        <Search
          label="場所"
          fields={[
            {
              name: "id",
              label: "id",
              input: {
                kind: InputKind.Text,
              },
            },
            {
              name: "name",
              label: "name",
              input: {
                kind: InputKind.Text,
              },
            },
            {
              name: "userId",
              label: "userId",
              input: {
                kind: InputKind.Table,
                table: "user",
              },
            },
            {
              name: "perPage",
              label: "perPage",
              input: {
                kind: InputKind.Number,
              },
            },
            {
              name: "orderBy",
              label: "orderBy",
              input: {
                kind: InputKind.Select,
                defaultValue: defaultOrderBy,
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
              label: "order",
              input: {
                kind: InputKind.Select,
                defaultValue: defaultOrder,
                items: orderItems,
              },
            },
          ]}
          rawSearchParams={rawSearchParams}
          onSubmit={(params) => {
            setParams({ ...params, page: "1" } as Params);
            fetchLocations(params as Params);
          }}
        />
      </HStack>
    </Stack>
  );
}
