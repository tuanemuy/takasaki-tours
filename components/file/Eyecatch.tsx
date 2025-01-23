"use client";

import { useState } from "react";
import { type FileWithAssets, getSrc } from "@/lib/core/file";

import { Box, Grid, styled } from "@/styled-system/jsx";

type Props = {
  files: FileWithAssets[];
  alt: string;
};

export function Eyecatch({ files, alt }: Props) {
  const images = files.map((f) => getSrc(f));
  const [selected, setSelected] = useState(images[0]);

  return (
    <Box position="relative" w="full">
      <Box w="full" aspectRatio="3/2" bg="bg.muted">
        {selected && (
          <styled.img
            src={selected.src}
            srcSet={selected.srcSet}
            sizes="100vw, (min-width: 1024px) 50vw"
            alt={alt}
            loading="lazy"
            w="full"
            objectFit="cover"
            objectPosition="50% 50%"
            aspectRatio="3/2"
          />
        )}
      </Box>
      <Grid gridTemplateColumns="repeat(5, 1fr)" gap="2" mt="2">
        {images.map((image) => {
          return (
            <styled.img
              key={image.src}
              src={image.src}
              srcSet={image.srcSet}
              sizes="20vw, (min-width) 10vw"
              alt="thumbnail"
              loading="lazy"
              onClick={() => setSelected(image)}
              aspectRatio="1/1"
              objectFit="cover"
              objectPosition="50% 50%"
              cursor="pointer"
            />
          );
        })}
      </Grid>
    </Box>
  );
}
