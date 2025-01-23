"use client";

import { useState } from "react";

import { Switch as SwitchUI } from "@/components/ui/switch";

type Props = {
  name?: string;
  label?: string;
  defaultValue?: boolean;
  onValueChange?: (checked: boolean) => void;
  required?: boolean;
  readOnly?: boolean;
};

export function Switch({
  name,
  label,
  defaultValue,
  onValueChange,
  required,
  readOnly,
}: Props) {
  const [value, setValue] = useState(defaultValue || false);

  return (
    <SwitchUI
      key={defaultValue?.toString()}
      defaultChecked={defaultValue}
      onCheckedChange={(details) => {
        setValue(details.checked);
        onValueChange?.(details.checked);
      }}
      readOnly={readOnly || false}
    >
      {label ? label : ""}
      <input type="hidden" name={name} value={value.toString()} />
    </SwitchUI>
  );
}
