import { useState } from "react";
import type { RawSearchParams } from "@/lib/router";
import type { Role } from "@/lib/core/user";
import type { TableAction } from "@/types/table";

import { Box, Stack, HStack } from "@/styled-system/jsx";
import { IconButton } from "@/components/ui/icon-button";
import { TableInput } from "./TableInput";
import { X } from "lucide-react";

type Props = {
  name?: string;
  table: React.FC<{
    rawSearchParams?: RawSearchParams;
    actions?: TableAction[];
    role: Role;
  }>;
  defaultValues?: string[];
  defaultLabels?: string[];
  role: Role;
};

export function MultipleTableInput({
  name,
  table,
  defaultValues,
  defaultLabels,
  role,
}: Props) {
  const [values, setValues] = useState<string[]>(defaultValues || []);
  const [labels, setLabels] = useState<string[]>(defaultLabels || []);

  return (
    <Stack gap="4">
      {values.map((value, index) => {
        const key = `${value}${index}`;
        return (
          <HStack key={key} gap="2" w="full">
            <Box flexGrow="1">
              <TableInput
                name={`${name}[]`}
                table={table}
                defaultValue={value}
                defaultValueLabel={labels[index]}
                onValueChange={(value, label) => {
                  const newValues = [...values];
                  newValues[index] = value;
                  setValues(newValues);
                  if (label) {
                    const newLabels = [...labels];
                    newLabels[index] = label;
                    setLabels(newLabels);
                  }
                }}
                required
                role={role}
              />
            </Box>

            <IconButton
              type="button"
              onClick={() => {
                const newValues = [...values];
                newValues.splice(index, 1);
                const newLabels = [...labels];
                newLabels.splice(index, 1);
                setValues(newValues);
                setLabels(newLabels);
              }}
              variant="subtle"
            >
              <X size={16} />
            </IconButton>
          </HStack>
        );
      })}

      <TableInput
        key={values.length}
        table={table}
        onValueChange={(value, label) => {
          const newValues = [...values];
          newValues.push(value);
          setValues(newValues);
          if (label) {
            const newLabels = [...labels];
            newLabels.push(label);
            setLabels(newLabels);
          }
        }}
        role={role}
      />
    </Stack>
  );
}
