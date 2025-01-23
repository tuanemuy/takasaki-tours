import { getSrc } from "@/lib/core/file";
import { getFileWithAssetsWithCache } from "@/actions/public/file";

import { Box, styled } from "@/styled-system/jsx";

type Props = {
  fileId: string;
};

export async function Thumbnail({ fileId }: Props) {
  const { result } = await getFileWithAssetsWithCache(fileId);
  const file = result?.at(0);
  const srcs = file ? getSrc(file) : null;

  return (
    <Box
      position="relative"
      w="12"
      h="auto"
      aspectRatio="1/1"
      bg="bg.muted"
      border="1px solid"
      borderColor="border.muted"
      borderRadius="50%"
      overflow="hidden"
    >
      {srcs && (
        <styled.img
          src={srcs?.src}
          alt="サムネイル"
          srcSet={srcs?.srcSet}
          w="full"
          h="full"
          objectFit="cover"
          objectPosition="50% 50%"
        />
      )}
    </Box>
  );
}
