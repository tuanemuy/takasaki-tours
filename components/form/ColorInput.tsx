"use client";

import { useState } from "react";
import { parseColor } from "@/lib/ui";

import { HStack, Stack } from "@/styled-system/jsx";
import { ColorPicker } from "@/components/ui/color-picker";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { PipetteIcon } from "lucide-react";

type Props = {
  name?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  readOnly?: boolean;
};

export function ColorInput({
  name,
  defaultValue,
  onValueChange,
  required,
  readOnly,
}: Props) {
  const [value, setValue] = useState(defaultValue || "#000000");

  return (
    <ColorPicker.Root
      key={defaultValue}
      defaultValue={defaultValue ? parseColor(defaultValue) : undefined}
      onValueChange={(details) => {
        setValue(details.value.toString("hex"));
        onValueChange?.(details.value.toString("hex"));
      }}
      required={required}
      readOnly={readOnly || false}
    >
      <ColorPicker.Context>
        {(api) => (
          <>
            <input type="hidden" name={name} value={value} />
            <ColorPicker.Control>
              <ColorPicker.ChannelInput channel="hex" asChild>
                <Input />
              </ColorPicker.ChannelInput>
              <ColorPicker.Trigger asChild>
                <IconButton variant="outline">
                  <ColorPicker.Swatch value={api.value} />
                </IconButton>
              </ColorPicker.Trigger>
            </ColorPicker.Control>
            <ColorPicker.Positioner>
              <ColorPicker.Content>
                <Stack gap="3">
                  <ColorPicker.Area>
                    <ColorPicker.AreaBackground />
                    <ColorPicker.AreaThumb />
                  </ColorPicker.Area>
                  <HStack gap="3">
                    <ColorPicker.EyeDropperTrigger asChild>
                      <IconButton
                        size="xs"
                        variant="outline"
                        aria-label="Pick a color"
                      >
                        <PipetteIcon />
                      </IconButton>
                    </ColorPicker.EyeDropperTrigger>
                    <Stack gap="2" flex="1">
                      <ColorPicker.ChannelSlider channel="hue">
                        <ColorPicker.ChannelSliderTrack />
                        <ColorPicker.ChannelSliderThumb />
                      </ColorPicker.ChannelSlider>
                      <ColorPicker.ChannelSlider channel="alpha">
                        <ColorPicker.TransparencyGrid size="8px" />
                        <ColorPicker.ChannelSliderTrack />
                        <ColorPicker.ChannelSliderThumb />
                      </ColorPicker.ChannelSlider>
                    </Stack>
                  </HStack>
                  <HStack>
                    <ColorPicker.ChannelInput channel="hex" asChild>
                      <Input size="2xs" />
                    </ColorPicker.ChannelInput>
                  </HStack>
                </Stack>
              </ColorPicker.Content>
            </ColorPicker.Positioner>
          </>
        )}
      </ColorPicker.Context>
      <ColorPicker.HiddenInput />
    </ColorPicker.Root>
  );
}
