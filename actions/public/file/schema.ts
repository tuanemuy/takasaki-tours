import { z } from "zod";

export const getFileWithAssetsSchema = z.object({
  id: z.string().cuid2(),
});

export const getFileByPathSchema = z.object({
  path: z.string().min(1),
});

export const listAssetsSchema = z.object({
  fileId: z.string().cuid2(),
});

export const listAssetsByFilePathSchema = z.object({
  filePath: z.string().min(1),
});
