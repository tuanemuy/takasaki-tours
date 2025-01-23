import { HStack, styled } from "@/styled-system/jsx";

type Props = {
  name: string;
};

export function Heading({ name }: Props) {
  return (
    <HStack alignItems="center" gap="8">
      <styled.h2
        flexShrink="0"
        flexGrow="0"
        fontSize="1.5rem"
        fontWeight="bold"
        whiteSpace="nowrap"
      >
        {name}
      </styled.h2>
      <styled.hr
        flexShrink="1"
        flexGrow="1"
        w="full"
        h="1px"
        bg="border.default"
      />
    </HStack>
  );
}
