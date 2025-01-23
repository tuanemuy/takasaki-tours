import type { File, FileWithAssets } from "@/lib/core/file";
import { getSrc } from "@/lib/core/file";
import { useFileUpload } from "@/hooks/file";

import { Box, styled } from "@/styled-system/jsx";
import { toaster } from "@/components/ui/toaster";
import { Plus } from "lucide-react";

const defaultMaxWidth = 1500;

type Props = {
  name?: string;
  resizes: number[];
  maxWidth?: number;
  displayWidth?: number;
  aspectRatio?: number;
  initialFile?: File;
  initialFileId?: string;
  initialFileJson?: string;
  valueType?: "id" | "json";
  readOnly?: boolean;
  onChange?: (value: string, file: FileWithAssets) => void;
};

export function FileInput({
  name,
  resizes,
  maxWidth,
  displayWidth,
  aspectRatio,
  initialFile,
  initialFileId,
  initialFileJson,
  valueType,
  readOnly,
  onChange,
}: Props) {
  const { inputRef, uploaded, onChangeInput } = useFileUpload({
    resizes,
    maxWidth: maxWidth || defaultMaxWidth,
    aspectRatio,
    initialFile,
    initialFileId,
    initialFileJson,
    onUpload: () => {
      toaster.create({
        title: "Processing...",
        description: "ファイルをアップロードしています",
      });
    },
    onUploaded: (uploaded) => {
      if (!readOnly && onChange) {
        onChange(uploadedToValue(uploaded, valueType), uploaded);
      }
    },
    onSuccess: (description) => {
      toaster.create({
        title: "Success",
        description,
      });
    },
    onError: (description) => {
      toaster.create({
        title: "Error",
        description,
      });
    },
  });

  return (
    <>
      <Box
        position="relative"
        p="3"
        border="1px solid"
        borderColor="border.default"
        borderRadius="md"
        maxW="100%"
        bg="bg.subtle"
        cursor="pointer"
        overflow="hidden"
        style={{
          width: displayWidth ? `${displayWidth}px` : "100%",
          maxWidth: "40vw",
          aspectRatio: aspectRatio?.toString() || "3/2",
        }}
        onClick={() => {
          if (!readOnly) {
            inputRef.current?.click();
          }
        }}
      >
        {uploaded &&
          (() => {
            const src = getSrc(uploaded);
            return (
              <styled.img
                src={src.src}
                srcSet={src.srcSet}
                sizes={`${displayWidth}px`}
                alt="Uploaded"
                w="full"
                h="full"
                objectFit="cover"
              />
            );
          })()}

        {!uploaded && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="full"
            h="full"
            color="fg.muted"
          >
            <Plus />
          </Box>
        )}
      </Box>
      {uploaded && (
        <input
          type="hidden"
          name={name}
          value={uploadedToValue(uploaded, valueType)}
        />
      )}
      <styled.input
        type="file"
        ref={inputRef}
        onChange={!readOnly ? onChangeInput : undefined}
        display="none"
      />
    </>
  );
}

function uploadedToValue(file: FileWithAssets, valueType?: string) {
  const src = getSrc(file);
  switch (valueType) {
    case "id":
      return file.id;
    case "json":
      return JSON.stringify({
        id: file.id,
        ...src,
      });
    default:
      return file.id;
  }
}
