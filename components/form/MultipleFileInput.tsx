import { useState } from "react";
import type { File } from "@/lib/core/file";

import { Box, Flex, styled } from "@/styled-system/jsx";
import { FileInput } from "./FileInput";
import { X } from "lucide-react";

type Props = {
  name?: string;
  resizes: number[];
  maxWidth?: number;
  displayWidth?: number;
  aspectRatio?: number;
  initialFiles?: File[];
  initialFileIds?: string[];
};

export function MultipleFileInput({
  name,
  resizes,
  maxWidth,
  displayWidth,
  aspectRatio,
  initialFiles,
  initialFileIds,
}: Props) {
  const [files, setFiles] = useState<(File | string)[]>(
    initialFiles || initialFileIds || [],
  );

  return (
    <Flex gap="4" flexWrap="wrap">
      {files.map((file, index) => {
        return (
          <Box
            key={typeof file === "string" ? file : file.id}
            position="relative"
          >
            <FileInput
              name={`${name}[]`}
              resizes={resizes}
              maxWidth={maxWidth}
              displayWidth={displayWidth}
              aspectRatio={aspectRatio}
              initialFile={typeof file === "string" ? undefined : file}
              initialFileId={typeof file === "string" ? file : undefined}
              valueType="id"
              onChange={(file) => {
                const newFiles = [...files];
                newFiles[index] = file;
                setFiles(newFiles);
              }}
            />

            <styled.button
              onClick={() => {
                const newFiles = [...files];
                newFiles.splice(index, 1);
                setFiles(newFiles);
              }}
              position="absolute"
              top="0"
              right="0"
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="6"
              h="6"
              transform="translate(50%, -50%)"
              bg="bg.default"
              border="1px solid"
              borderColor="border.default"
              borderRadius="50%"
              cursor="pointer"
            >
              <X size={12} />
            </styled.button>
          </Box>
        );
      })}

      <FileInput
        key={files.length}
        resizes={resizes}
        maxWidth={maxWidth}
        displayWidth={displayWidth}
        aspectRatio={aspectRatio}
        valueType="id"
        onChange={(file) => {
          const newFiles = [...files];
          newFiles.push(file);
          setFiles(newFiles);
        }}
      />
    </Flex>
  );
}
