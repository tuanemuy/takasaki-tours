import { type Schedule, ScheduleKind } from "@/lib/core/schedule";

import { Box, Stack, HStack, styled } from "@/styled-system/jsx";
import { MapPin } from "lucide-react";

type Props = {
  schedules: Schedule[];
};

export function Schedules({ schedules }: Props) {
  return (
    <Stack gap="0">
      {schedules.map((schedule, index) => (
        <Box
          key={schedule.id}
          position="relative"
          pb={index === schedules.length - 1 ? "0" : { base: "4", lg: "6" }}
        >
          <Box
            position="absolute"
            zIndex="1"
            left="calc(1rem - 0.5px)"
            top="0"
            w="1px"
            h={index !== schedules.length - 1 ? "100%" : "1rem"}
            bg="fg.default"
          />
          {schedule.kind === ScheduleKind.LOCATION && (
            <>
              <HStack position="relative" zIndex="2" gap="1rem">
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexShrink="0"
                  w="2rem"
                  h="2rem"
                  bg="fg.default"
                  borderRadius="md"
                >
                  <MapPin size={18} color="#ffffff" />
                </Box>
                <styled.h3 fontWeight="bold">{schedule.heading}</styled.h3>
              </HStack>
              {schedule.details && (
                <styled.p ml="3rem">{schedule.details}</styled.p>
              )}
            </>
          )}

          {schedule.kind === ScheduleKind.MOVEMENT && (
            <>
              <HStack position="relative" zIndex="2" gap="1rem">
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexShrink="0"
                  w="2rem"
                  h="2rem"
                >
                  <Box
                    w=".75rem"
                    h=".75rem"
                    bg="fg.default"
                    borderRadius="50%"
                  />
                </Box>
                <styled.h3>{schedule.heading}</styled.h3>
              </HStack>
              {schedule.details && (
                <styled.p ml="3rem">{schedule.details}</styled.p>
              )}
            </>
          )}
        </Box>
      ))}
    </Stack>
  );
}
