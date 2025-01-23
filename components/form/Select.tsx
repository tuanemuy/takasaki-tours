"use client";

import { useState } from "react";

import {
  Select as SelectUI,
  createListCollection,
} from "@/components/ui/select";
import { Check, ChevronsUpDown } from "lucide-react";

type Props = {
  name?: string;
  items: {
    label: string;
    value: string;
  }[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  readOnly?: boolean;
};

export function Select({
  name,
  items,
  defaultValue,
  onValueChange,
  required,
  readOnly,
}: Props) {
  const [value, setValue] = useState(defaultValue || "");

  return (
    <SelectUI.Root
      key={defaultValue}
      collection={createListCollection({ items })}
      defaultValue={defaultValue ? [defaultValue] : undefined}
      onValueChange={(details) => {
        setValue(details.value[0]);
        onValueChange?.(details.value[0]);
      }}
      positioning={{ sameWidth: true }}
      required={required || false}
      readOnly={readOnly || false}
    >
      <input type="hidden" name={name} value={value} />
      <SelectUI.Control>
        <SelectUI.Trigger>
          <SelectUI.ValueText placeholder="選択してください" />
          <ChevronsUpDown />
        </SelectUI.Trigger>
      </SelectUI.Control>
      <SelectUI.Positioner>
        <SelectUI.Content>
          <SelectUI.Item key="empty" item={{ labe: "", value: "" }}>
            <SelectUI.ItemText>-</SelectUI.ItemText>
            <SelectUI.ItemIndicator>
              <Check />
            </SelectUI.ItemIndicator>
          </SelectUI.Item>
          {items.map((item) => (
            <SelectUI.Item key={item.value} item={item}>
              <SelectUI.ItemText>{item.label}</SelectUI.ItemText>
              <SelectUI.ItemIndicator>
                <Check />
              </SelectUI.ItemIndicator>
            </SelectUI.Item>
          ))}
        </SelectUI.Content>
      </SelectUI.Positioner>
    </SelectUI.Root>
  );
}
