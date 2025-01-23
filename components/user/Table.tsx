"use client";

import { useState, useEffect } from "react";
import { Order, getOrderName, orderItems } from "@/lib/db";
import type { RawSearchParams } from "@/lib/router";
import { SearchParams } from "@/lib/router";
import { InputKind } from "@/lib/form";
import type { User } from "@/lib/core/user";
import { Role } from "@/lib/core/user";
import { getRoleName, getRoleVariant } from "@/lib/core/user";
import { listUsers } from "@/actions/admin/user";
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
  if (role !== Role.ADMIN) {
    return <p>This data is not available.</p>;
  }

  const searchParams = rawSearchParams
    ? SearchParams.fromRaw(rawSearchParams)
    : new SearchParams({});
  const defaultValues = {
    perPage: searchParams.getOne("perPage") || defaultPerPage,
    page: searchParams.getOne("page") || defaultPage,
    order: searchParams.getOne("order") || defaultOrder,
    orderBy: searchParams.getOne("orderBy") || defaultOrderBy,
    id: searchParams.getOne("id"),
    email: searchParams.getOne("email"),
    name: searchParams.getOne("name"),
    role: searchParams.getOne("role"),
  };
  type Params = typeof defaultValues;
  const [params, setParams] = useState(defaultValues);
  const [items, setItems] = useState<User[] | null>(null);
  const [count, setCount] = useState(0);

  const fetchUsers = async (params: Params) => {
    const { result, count } = await listUsers({
      perPage: Number.parseInt(params.perPage || defaultPerPage, 10),
      page: Number.parseInt(params.page || defaultPage, 10),
      order: (params.order || defaultOrder) as Order,
      orderBy: params.orderBy || defaultOrderBy,
      id: params.id,
      email: params.email,
      name: params.name,
      role: params.role as Role | undefined,
    });
    setItems(result || []);
    setCount(count);
  };

  // biome-ignore lint:
  useEffect(() => {
    fetchUsers(defaultValues);
  }, []);

  return (
    <Stack gap="6" overflowX="hidden">
      <HStack gap="2" flexWrap="wrap">
        {params.id && <Badge>id: {params.id}</Badge>}
        {params.email && <Badge>email: {params.email}</Badge>}
        {params.name && <Badge>name: {params.name}</Badge>}
        {params.role && <Badge>role: {params.role}</Badge>}
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
                <TableUI.Header>email</TableUI.Header>
                <TableUI.Header>name</TableUI.Header>
                <TableUI.Header>role</TableUI.Header>
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
                    <TableUI.Cell>{item.email}</TableUI.Cell>
                    <TableUI.Cell>{item.name}</TableUI.Cell>
                    <TableUI.Cell>
                      <Badge variant={getRoleVariant(item.role as Role)}>
                        {getRoleName(item.role as Role)}
                      </Badge>
                    </TableUI.Cell>
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
            perPage={Number.parseInt(params.perPage || defaultPerPage, 10)}
            page={Number.parseInt(params.page || defaultPage, 10)}
            onChange={(page) => {
              setParams((prev) => ({ ...prev, page: page.toString() }));
            }}
          />
        )}
        <Search
          label="ユーザー"
          fields={[
            {
              name: "id",
              label: "id",
              input: {
                kind: InputKind.Text,
              },
            },
            {
              name: "email",
              label: "email",
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
                kind: InputKind.Text,
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
                  { label: "email", value: "email" },
                  { label: "name", value: "name" },
                  { label: "role", value: "role" },
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
            fetchUsers(params as Params);
          }}
        />
      </HStack>
    </Stack>
  );
}
