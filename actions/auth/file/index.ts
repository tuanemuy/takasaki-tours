"use server";

import { Storage } from "@google-cloud/storage";
import type { z } from "zod";
import sharp from "sharp";
// import mime from "mime";
import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { files, assets } from "@/lib/db/schema";
import { Logger } from "@/lib/logger";
import { validateActionInput, withAuth } from "@/lib/action";
import { ActionError } from "@/lib/action/error";
import { deleteFileSchema } from "./schema";

const storage = new Storage();
const logger = new Logger();

export type UploadFileOptions = {
  name: string;
  body: Uint8Array;
  mimeType?: string;
  resizes: number[];
  maxWidth?: number;
  aspectRatio?: number;
  withoutEnlargement?: boolean;
};
export const uploadFile = withAuth(_uploadFile);
async function _uploadFile(data: UploadFileOptions, userId: string) {
  const { name, body, maxWidth, resizes, aspectRatio, withoutEnlargement } =
    data;
  let originalBuffer: Buffer;
  let originalWidth: number;
  let convertedBuffers: Buffer[];
  try {
    const originalFile = sharp(Buffer.from(body));
    const { data, info } = maxWidth
      ? await sharp(Buffer.from(body))
          .rotate()
          .resize({
            width: maxWidth,
            height: aspectRatio
              ? Math.round(maxWidth / aspectRatio)
              : undefined,
            withoutEnlargement,
          })
          .toBuffer({ resolveWithObject: true })
      : await originalFile.toBuffer({ resolveWithObject: true });
    originalBuffer = data;
    originalWidth = info.width;
    convertedBuffers = await Promise.all([
      ...resizes.map((width) =>
        sharp(originalBuffer)
          .resize({
            width,
            height: aspectRatio ? Math.round(width / aspectRatio) : undefined,
            withoutEnlargement,
          })
          .webp()
          .toBuffer(),
      ),
      sharp(originalBuffer).webp().toBuffer(),
    ]);
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.ImageConversionError };
  }

  const uniqueName = `${name}-${createId()}`;
  const keys = [
    ...resizes.map((width) => `uploads/${userId}/${uniqueName}@${width}.webp`),
    `uploads/${userId}/${uniqueName}.webp`,
  ];

  try {
    await Promise.all(
      keys.map((key, index) =>
        storage
          .bucket(process.env.GCS_BUCKET_NAME)
          .file(key)
          .save(convertedBuffers[index]),
      ),
    );
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.StorageError };
  }

  try {
    const result = await db.transaction(async (tx) => {
      const insertedFiles = await tx
        .insert(files)
        .values({
          userId,
          path: keys[keys.length - 1],
          mimeType: "images/webp",
          aspectRatio,
        })
        .returning();
      const insertedAssets = await tx
        .insert(assets)
        .values([
          ...resizes.map((width, index) => ({
            fileId: insertedFiles[0].id,
            label: `webp@${width}`,
            width,
            path: keys[index],
            mimeType: "image/webp",
          })),
          {
            fileId: insertedFiles[0].id,
            label: "default",
            width: resizes[0] || originalWidth,
            path: keys[0],
            mimeType: "image/webp",
          },
        ])
        .returning();

      return [{ ...insertedFiles[0], assets: insertedAssets }];
    });
    return { data, result, count: result.length, error: null };
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}

export const deleteFile = withAuth(
  validateActionInput(_deleteFile, deleteFileSchema),
);
async function _deleteFile(
  data: z.infer<typeof deleteFileSchema>,
  userId: string,
) {
  type Deleted = { id: string; path: string };
  let deletedFiles: Deleted[] = [];
  let deletedAssets: Deleted[] = [];
  try {
    await db.transaction(async (tx) => {
      deletedFiles = await tx
        .delete(files)
        .where(and(eq(files.userId, userId), eq(files.path, data.path)))
        .returning({ id: files.id, path: files.path });
      if (deletedFiles[0]) {
        deletedAssets = await tx
          .delete(assets)
          .where(eq(assets.fileId, deletedFiles[0].id))
          .returning({ id: assets.id, path: assets.path });
      }
    });
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }

  try {
    await Promise.all(
      [...deletedFiles, ...deletedAssets].map((deleted) =>
        storage.bucket(process.env.GCS_BUCKET_NAME).file(deleted.path).delete(),
      ),
    );
    return {
      data,
      result: deletedFiles,
      count: deletedFiles.length,
      error: null,
    };
  } catch (e) {
    return {
      data,
      result: deletedFiles,
      count: deletedFiles.length,
      error: ActionError.StorageError,
    };
  }
}
