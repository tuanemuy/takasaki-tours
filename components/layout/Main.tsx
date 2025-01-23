import { Box, Stack } from "@/styled-system/jsx";

type Props = {
  heading?: React.ReactNode;
  children: React.ReactNode;
};

export function Main({ children }: Props) {
  return (
    <Box position="relative" w="full" h="full" overflowY="scroll">
      <Stack
        position="relative"
        gap={{ base: "8", md: "10" }}
        p={{ base: "6", md: "8" }}
      >
        {children}
      </Stack>
    </Box>
  );
}
