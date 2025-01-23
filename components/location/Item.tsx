import type { FullLocation } from "@/lib/core/location";
import { getSrc } from "@/lib/core/file";

import { Box, styled } from "@/styled-system/jsx";

type Props = {
  item: FullLocation;
  isButton?: boolean;
};

export function Item({ item, isButton }: Props) {
  const firstLocationsFiles = item.locationsFiles.at(0);
  const src = firstLocationsFiles ? getSrc(firstLocationsFiles.file) : null;

  return (
    <Box
      w="100%"
      h="100%"
      bg="bg.default"
      borderRadius="md"
      boxShadow="md"
      overflow="hidden"
      cursor={isButton ? "pointer" : "default"}
      transitionDuration="normal"
      css={{
        _hover: isButton
          ? {
              boxShadow: "sm",
              transform: "scale(0.996)",
            }
          : undefined,
      }}
    >
      <Box w="100%" aspectRatio="3/2" bg="bg.muted">
        {src && (
          <styled.img
            src={src.src}
            srcSet={src.srcSet}
            sizes="512px"
            alt={item.name}
            w="full"
            h="full"
            objectFit="cover"
          />
        )}
      </Box>

      <Box p="4">
        <styled.h3 fontWeight="bold">{item.name}</styled.h3>
        <styled.p fontSize="sm" color="fg.muted">
          {item.createdAt}
        </styled.p>
      </Box>
    </Box>
  );
}
