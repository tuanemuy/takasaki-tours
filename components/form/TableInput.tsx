"use client";

import { useState } from "react";
import type { RawSearchParams } from "@/lib/router";
import type { Role } from "@/lib/core/user";
import type { TableAction } from "@/types/table";

import { HStack } from "@/styled-system/jsx";
import { Dialog } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Portal } from "@/components/layout/Portal";
import { ChevronRight, Search, X } from "lucide-react";

export type TableComponent = React.FC<{
  rawSearchParams?: RawSearchParams;
  actions?: TableAction[];
  role: Role;
}>;

type Props = {
  name?: string;
  table: TableComponent;
  defaultValue?: string;
  defaultValueLabel?: string;
  onValueChange?: (value: string, label?: string) => void;
  required?: boolean;
  readOnly?: boolean;
  role: Role;
};

export function TableInput({
  name,
  table,
  defaultValue,
  defaultValueLabel,
  onValueChange,
  readOnly,
  required,
  role,
}: Props) {
  const Table = table;
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [valueLabel, setValueLabel] = useState(defaultValueLabel || "");

  return (
    <HStack gap="2">
      <input type="hidden" name={name} value={value} required={required} />
      {value && (
        <Input
          type="text"
          value={value ? `${valueLabel} (${value})` : ""}
          readOnly
        />
      )}
      {!readOnly && (
        <Dialog.Root
          open={isOpen}
          onOpenChange={(details) => setIsOpen(details.open)}
        >
          <Dialog.Trigger asChild>
            <IconButton variant="outline">
              <Search />
            </IconButton>
          </Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content w="3xl" maxW="94%" p="6">
                <Table
                  actions={[
                    {
                      name: "select",
                      icon: ChevronRight,
                      onClick: (id: string, label?: string) => {
                        setValue(id);
                        setValueLabel(label || id);
                        onValueChange?.(id, label);
                        setIsOpen(false);
                      },
                    },
                  ]}
                  role={role}
                />
                <Dialog.CloseTrigger
                  asChild
                  position="absolute"
                  top="2"
                  right="2"
                >
                  <IconButton
                    type="button"
                    aria-label="Close Dialog"
                    variant="ghost"
                    size="sm"
                  >
                    <X />
                  </IconButton>
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      )}
      {value && !readOnly && !required && (
        <IconButton
          type="button"
          onClick={() => {
            setValue("");
            setValueLabel("");
            onValueChange?.("");
          }}
          variant="subtle"
        >
          <X />
        </IconButton>
      )}
    </HStack>
  );
}
