"use client";

import { useRef, useEffect, useState } from "react";
import { createId } from "@paralleldrive/cuid2";
import type { File, FileWithAssets } from "@/lib/core/file";
import { uploadFile, deleteFile } from "@/actions/auth/file";
import { getFileWithAssetsWithCache } from "@/actions/public/file";

type UseFileUploadParams = {
  resizes: number[];
  maxWidth?: number;
  aspectRatio?: number; // width / height
  initialFile?: File | File;
  initialFileId?: string;
  initialFileJson?: string;
  onUpload: () => void;
  onUploaded: (file: FileWithAssets) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

export function useFileUpload({
  resizes,
  maxWidth,
  aspectRatio,
  initialFile,
  initialFileId,
  initialFileJson,
  onUpload,
  onUploaded,
  onSuccess,
  onError,
}: UseFileUploadParams) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState<FileWithAssets | null>(
    initialFile ? { ...initialFile, assets: [] } : null,
  );

  useEffect(() => {
    if (initialFileId && !uploaded) {
      (async () => {
        const { result } = await getFileWithAssetsWithCache(initialFileId);
        if (result?.[0] && !uploaded) {
          setUploaded(result[0]);
        }
      })();
    } else if (initialFileJson && !uploaded) {
      (async () => {
        const json = JSON.parse(initialFileJson);
        const { result } = await getFileWithAssetsWithCache(json.id);
        if (result?.[0] && !uploaded) {
          setUploaded(result[0]);
        }
      })();
    }
  }, [initialFileId, initialFileJson, uploaded]);

  const onChangeInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);

    if (!file) {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    onUpload();

    if (uploaded && uploaded.id !== initialFile?.id) {
      try {
        await deleteFile({ path: uploaded.path });
      } catch (e) {
        console.log("不要なファイルを削除できませんでした");
      }
    }

    let mimeType = file.type;
    let converted: Blob = file;
    if (
      typeof window !== "undefined" &&
      (file.type === "image/heic" || file.type === "image/heif")
    ) {
      try {
        const heic2any = require("heic2any");
        const jpeg = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 1,
        });

        if (!Array.isArray(jpeg)) {
          converted = jpeg;
          mimeType = "image/jpeg";
        }
      } catch (_e) {
        console.error("ファイルを変換できませんでした");
      }
    }

    const name = createId();
    const body = new Uint8Array(await converted.arrayBuffer());
    const { result } = await uploadFile({
      name,
      body,
      mimeType,
      resizes,
      maxWidth,
      aspectRatio,
    });

    if (result?.[0]) {
      onSuccess("ファイルをアップロードしました");
      onUploaded(result[0]);
      setUploaded(result[0]);
    } else {
      onError("ファイルをアップロードできませんでした");
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return { inputRef, uploaded, onChangeInput };
}
