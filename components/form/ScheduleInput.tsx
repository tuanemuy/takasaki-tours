"use client";

import { useState, useRef } from "react";
import {
  type NewSchedule,
  ScheduleKind,
  stringToScheduleKind,
  scheduleKindToLabel,
} from "@/lib/core/schedule";

import { Box, Stack, HStack, styled } from "@/styled-system/jsx";
import { Drawer } from "@/components/ui/drawer";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Select } from "@/components/form/Select";
import { Portal } from "@/components/layout/Portal";
import { ArrowDown, MapPin, PenSquare, Plus, X } from "lucide-react";

type Props = {
  name?: string;
  defaultValue?: NewSchedule;
  onValueChange?: (value: NewSchedule | null) => void;
  readOnly?: boolean;
};

export function ScheduleInput({
  name,
  defaultValue,
  onValueChange,
  readOnly,
}: Props) {
  const headingRef = useRef<HTMLInputElement>(null);
  const detailsRef = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<ScheduleKind | undefined>(
    defaultValue?.kind || ScheduleKind.LOCATION,
  );
  const [errors, setErrors] = useState<{
    kind?: string;
    heading?: string;
  }>({});

  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || null);

  const save = () => {
    const heading = headingRef.current?.value;
    const details = detailsRef.current?.value;
    if (heading && kind) {
      const newValue = { kind, heading, details };
      setValue(newValue);
      onValueChange?.(newValue);
      setIsOpen(false);
    } else {
      setErrors({
        kind: kind ? undefined : "正しく入力してください",
        heading: heading ? undefined : "正しく入力してください",
      });
    }
  };

  return (
    <HStack gap="2">
      {name && (
        <>
          <input
            type="hidden"
            name={`${name}.kind`}
            value={value?.kind}
            required
          />
          <input
            type="hidden"
            name={`${name}.heading`}
            value={value?.heading}
            required
          />
          {value?.details && (
            <input
              type="hidden"
              name={`${name}.details`}
              value={value.details}
            />
          )}
        </>
      )}
      {value && (
        <Box
          position="relative"
          w="full"
          px="3"
          border="1px solid"
          borderColor="border.default"
          borderRadius="sm"
          overflowX="scroll"
        >
          <HStack alignItems="center" h="10">
            {value.kind === ScheduleKind.LOCATION && (
              <Icon flexShrink="0">
                <MapPin size={20} />
              </Icon>
            )}
            {value.kind === ScheduleKind.MOVEMENT && (
              <Icon flexShrink="0">
                <ArrowDown size={20} />
              </Icon>
            )}
            <styled.h3 flexShrink="0" fontWeight="bold">
              {value.heading}
            </styled.h3>
            <styled.p flexShrink="0">{value.details}</styled.p>
          </HStack>
        </Box>
      )}
      {!readOnly && (
        <Drawer.Root
          open={isOpen}
          onOpenChange={(details) => setIsOpen(details.open)}
        >
          <Drawer.Trigger asChild>
            <IconButton variant="outline">
              {value ? <PenSquare /> : <Plus />}
            </IconButton>
          </Drawer.Trigger>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>
                    スケジュールを{defaultValue ? "編集" : "追加"}
                  </Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <Stack gap="4">
                    <Field.Root invalid={!!errors.kind}>
                      <Field.Label>種類</Field.Label>
                      <Field.Input asChild>
                        <Select
                          name="kind"
                          items={Object.values(ScheduleKind).map((value) => ({
                            label: scheduleKindToLabel(value),
                            value,
                          }))}
                          onValueChange={(value) =>
                            setKind(stringToScheduleKind(value))
                          }
                          defaultValue={
                            defaultValue?.kind || ScheduleKind.LOCATION
                          }
                          required
                          readOnly={readOnly}
                        />
                      </Field.Input>
                      <Field.ErrorText>{errors.heading}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.heading}>
                      <Field.Label>見出し</Field.Label>
                      <Field.Input
                        type="text"
                        ref={headingRef}
                        defaultValue={defaultValue?.heading}
                        required
                        readOnly={readOnly}
                      />
                      <Field.ErrorText>{errors.heading}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>詳細</Field.Label>
                      <Field.Input
                        type="text"
                        ref={detailsRef}
                        defaultValue={defaultValue?.details || ""}
                        readOnly={readOnly}
                      />
                    </Field.Root>
                  </Stack>
                </Drawer.Body>
                <Drawer.Footer gap="3">
                  <Drawer.CloseTrigger asChild>
                    <Button type="button" variant="outline">
                      キャンセル
                    </Button>
                  </Drawer.CloseTrigger>
                  {!readOnly && (
                    <Button type="button" onClick={save}>
                      {defaultValue ? "編集" : "追加"}
                    </Button>
                  )}
                </Drawer.Footer>
                <Drawer.CloseTrigger
                  asChild
                  position="absolute"
                  top="2"
                  right="2"
                >
                  <IconButton
                    type="button"
                    aria-label="Close Drawer"
                    variant="ghost"
                    size="sm"
                  >
                    <X />
                  </IconButton>
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      )}
    </HStack>
  );
}
