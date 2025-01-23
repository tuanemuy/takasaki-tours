import type { LocationWithFilesAndContents } from "@/lib/core/location";
import { getContentFor } from "@/lib/core/content";
import { getSrc } from "@/lib/core/file";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";

import Link from "next/link";
import { Box, Stack, styled } from "@/styled-system/jsx";

type Props = {
  item: LocationWithFilesAndContents;
  locale: Locale;
};

export async function Item({ item, locale }: Props) {
  const dictionary = (await getDictionary(locale)).general;
  const firstLocationsFiles = item.locationsFiles.at(0);
  const src = firstLocationsFiles ? getSrc(firstLocationsFiles.file) : null;
  const content = getContentFor(item.contents, locale);

  return (
    <Stack justifyContent="space-between" w="100%" h="100%">
      <Box>
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
              loading="lazy"
            />
          )}
        </Box>

        <Box mt="4">
          <styled.h3 fontSize="1.25rem" fontWeight="bold">
            {content ? content.name : item.name}
          </styled.h3>
          <styled.p mt="2">
            {content?.description?.slice(0, 72) || ""}...
          </styled.p>
        </Box>
      </Box>

      <Link href={`/${locale}/location/${item.id}`}>
        <Box
          w="full"
          mt="2"
          p="2"
          textAlign="center"
          border="1px solid"
          borderColor="fg.default"
        >
          {dictionary.more}
        </Box>
      </Link>
    </Stack>
  );
}
