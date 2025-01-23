import type { files, assets } from "../db/schema";

export type File = typeof files.$inferSelect;
export type Asset = typeof assets.$inferSelect;

export type FileWithAssets = File & { assets: Asset[] };

export const basePath = "/api/file";

export function getPath(file: FileWithAssets, label?: string) {
  return file.assets.filter((a) => a.label === label).at(0)?.path || file.path;
}

export function getSrc(file: FileWithAssets, label?: string) {
  const path =
    file.assets.filter((a) => a.label === label || a.label === "default").at(0)
      ?.path || file.path;
  return {
    src: `${basePath}/${path}`,
    srcSet: getSrcSet(file.assets),
  };
}

export function getSrcWithAssets(assets: Asset[], label?: string) {
  const path = assets
    .filter(
      (a) => a.label === label || a.label === "default" || a.label === "origin",
    )
    .at(0)?.path;
  return { src: `${basePath}/${path}`, srcSet: getSrcSet(assets) };
}

export function getSrcSet(assets: Asset[]) {
  return assets
    .map((a) => {
      return `${basePath}/${a.path} ${a.width}w`;
    })
    .join(",");
}
