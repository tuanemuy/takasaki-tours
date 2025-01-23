"use client";

import { useState } from "react";
import type { RawSearchParams } from "@/lib/router";
import { SearchParams } from "@/lib/router";
import type { Input, MultipleInput } from "@/lib/form";
import { InputKind } from "@/lib/form";

import Form from "next/form";
import { Stack } from "@/styled-system/jsx";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Drawer } from "@/components/ui/drawer";
import { Field as FieldUI } from "@/components/ui/field";
import { Portal } from "@/components/layout/Portal";
import { Select } from "@/components/form/Select";
import { NumberInput } from "@/components/ui/number-input";
import { SearchIcon, X } from "lucide-react";

export type Field = {
  name: string;
  label: string;
  input: Input;
};

type Props = {
  label: string;
  fields: Field[];
  rawSearchParams?: RawSearchParams;
  defaultParams?: { [key: string]: string | undefined };
  action?: string;
  onSubmit?: (params: { [key: string]: string | undefined }) => void;
};

export function Search({
  label,
  fields,
  rawSearchParams,
  defaultParams,
  action,
  onSubmit,
}: Props) {
  const searchParams = rawSearchParams
    ? SearchParams.fromRaw(rawSearchParams)
    : null;

  const initialParams = defaultParams || {};
  if (searchParams) {
    for (const f of fields) {
      initialParams[f.name] =
        searchParams.getOne(f.name) || f.input.defaultValue;
    }
  }

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <IconButton variant="outline" size="sm">
          <SearchIcon />
        </IconButton>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner zIndex="calc(var(--z-index-modal) + 1)">
          {action && (
            <Drawer.Content asChild>
              <Form action={action}>
                <Inner
                  label={label}
                  fields={fields}
                  action={action}
                  initialParams={initialParams}
                />
              </Form>
            </Drawer.Content>
          )}
          {onSubmit && (
            <Drawer.Content>
              <Inner
                label={label}
                fields={fields}
                initialParams={initialParams}
                onSubmit={onSubmit}
              />
            </Drawer.Content>
          )}
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

type InnerProps = {
  label: string;
  fields: Field[];
  initialParams: { [key: string]: string | undefined };
  action?: string;
  onSubmit?: (params: { [key: string]: string | undefined }) => void;
};

function Inner({ label, fields, initialParams, action, onSubmit }: InnerProps) {
  const [inputs, setInputs] = useState(initialParams);

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>検索</Drawer.Title>
        <Drawer.Description>{label}を検索</Drawer.Description>
        <Drawer.CloseTrigger asChild position="absolute" top="3" right="4">
          <IconButton variant="ghost">
            <X />
          </IconButton>
        </Drawer.CloseTrigger>
      </Drawer.Header>
      <Drawer.Body>
        <Stack gap="4">
          {fields.map((f) => {
            if (f.input.kind === InputKind.Text) {
              return (
                <FieldUI.Root key={f.name}>
                  <FieldUI.Label>{f.label}</FieldUI.Label>
                  <FieldUI.Input
                    type="text"
                    name={f.name}
                    defaultValue={initialParams[f.name] || f.input.defaultValue}
                    onChange={(event) =>
                      setInputs({
                        ...inputs,
                        [f.name]: event.target.value,
                      })
                    }
                  />
                </FieldUI.Root>
              );
            }

            if (f.input.kind === InputKind.Number) {
              return (
                <FieldUI.Root key={f.name}>
                  <FieldUI.Label>{f.label}</FieldUI.Label>
                  <NumberInput
                    name={f.name}
                    defaultValue={initialParams[f.name] || f.input.defaultValue}
                    onValueChange={(details) =>
                      setInputs({
                        ...inputs,
                        [f.name]: details.value,
                      })
                    }
                  />
                </FieldUI.Root>
              );
            }

            if (f.input.kind === InputKind.Select) {
              return (
                <FieldUI.Root key={f.name}>
                  <FieldUI.Label>{f.label}</FieldUI.Label>
                  <Select
                    name={f.name}
                    items={(f.input as MultipleInput).items}
                    defaultValue={initialParams[f.name] || f.input.defaultValue}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        [f.name]: value,
                      }))
                    }
                  />
                </FieldUI.Root>
              );
            }
          })}
        </Stack>
      </Drawer.Body>
      <Drawer.Footer gap="3">
        <Drawer.CloseTrigger asChild>
          <Button variant="outline">キャンセル</Button>
        </Drawer.CloseTrigger>
        {action && (
          <Drawer.CloseTrigger asChild>
            <Button type="submit">検索</Button>
          </Drawer.CloseTrigger>
        )}
        {onSubmit && (
          <Drawer.CloseTrigger asChild>
            <Button type="button" onClick={() => onSubmit(inputs)}>
              検索
            </Button>
          </Drawer.CloseTrigger>
        )}
      </Drawer.Footer>
    </>
  );
}
