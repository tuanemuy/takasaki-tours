"use server";

import { cache } from "react";
import type { z } from "zod";
import { eq } from "drizzle-orm";
import { Logger } from "@/lib/logger";
import { db } from "@/lib/db/client";
import { files, assets } from "@/lib/db/schema";
import { validateActionInput } from "@/lib/action";
import { ActionError } from "@/lib/action/error";
import {
  getFileWithAssetsSchema,
  getFileByPathSchema,
  listAssetsSchema,
  listAssetsByFilePathSchema,
} from "./schema";

const logger = new Logger();

export const getFileWithAssetsWithCache = cache(async (id: string) =>
  getFileWithAssets({ id }),
);
export const getFileWithAssets = validateActionInput(
  _getFileWithAssets,
  getFileWithAssetsSchema,
);
async function _getFileWithAssets(
  data: z.infer<typeof getFileWithAssetsSchema>,
) {
  try {
    /*
    const [fileResult, assetsResult] = await Promise.all([
      db.select().from(files).where(eq(files.id, data.id)),
      db.select().from(assets).where(eq(assets.fileId, data.id)),
    ]);
    */
    const result = await db.query.files.findMany({
      where: eq(files.id, data.id),
      limit: 1,
      with: { assets: true },
    });

    return {
      data,
      result,
      count: result.length,
      error: result.length > 0 ? null : ActionError.NotFoundError,
    };
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}

export const getFileByPathWithCache = cache(async (path: string) =>
  getFileByPath({ path }),
);
export const getFileByPath = validateActionInput(
  _getFileByPath,
  getFileByPathSchema,
);
async function _getFileByPath(data: z.infer<typeof getFileByPathSchema>) {
  try {
    const result = await db
      .select()
      .from(files)
      .where(eq(files.path, data.path));
    return {
      data,
      result,
      count: result.length,
      error: result.length > 0 ? null : ActionError.NotFoundError,
    };
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}

export const listAssetsWithCache = cache(async (fileId: string) =>
  listAssets({ fileId }),
);
export const listAssets = validateActionInput(_listAssets, listAssetsSchema);
async function _listAssets(data: z.infer<typeof listAssetsSchema>) {
  try {
    const result = await db
      .select()
      .from(assets)
      .where(eq(assets.fileId, data.fileId));

    return { data, result, count: result.length, error: null };
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}

export const listAssetsByFilePathWithCache = cache(async (filePath: string) =>
  listAssetsByFilePath({ filePath }),
);
export const listAssetsByFilePath = validateActionInput(
  _listAssetsByFilePath,
  listAssetsByFilePathSchema,
);
async function _listAssetsByFilePath(
  data: z.infer<typeof listAssetsByFilePathSchema>,
) {
  try {
    const result = await db
      .select()
      .from(assets)
      .where(eq(files.path, data.filePath));

    return { data, result, count: result.length, error: null };
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }
}
