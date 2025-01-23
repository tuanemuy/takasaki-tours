import { useState } from "react";
import type { NewSchedule } from "@/lib/core/schedule";

import { Box, Stack, HStack } from "@/styled-system/jsx";
import { IconButton } from "@/components/ui/icon-button";
import { ScheduleInput } from "./ScheduleInput";
import { X } from "lucide-react";

type Props = {
  name?: string;
  defaultValues?: NewSchedule[];
  required?: boolean;
  readOnly?: boolean;
};

export function SchedulesInput({ name, defaultValues, readOnly }: Props) {
  const [values, setValues] = useState<NewSchedule[]>(defaultValues || []);

  return (
    <Stack gap="4">
      {values.map((value, index) => {
        const key = `${value}${index}`;
        return (
          <HStack key={key} gap="2" w="full">
            <Box flexGrow="1">
              <ScheduleInput
                name={`${name}[${index}]`}
                defaultValue={value}
                onValueChange={(value) => {
                  if (value) {
                    const newValues = [...values];
                    newValues[index] = value;
                    setValues(newValues);
                  }
                }}
              />
            </Box>

            {!readOnly && (
              <IconButton
                type="button"
                onClick={() => {
                  const newValues = [...values];
                  newValues.splice(index, 1);
                  setValues(newValues);
                }}
                variant="subtle"
              >
                <X size={16} />
              </IconButton>
            )}
          </HStack>
        );
      })}

      {!readOnly && (
        <ScheduleInput
          key={values.length}
          onValueChange={(value) => {
            if (value) {
              const newValues = [...values];
              newValues.push(value);
              setValues(newValues);
            }
          }}
        />
      )}
    </Stack>
  );
}
