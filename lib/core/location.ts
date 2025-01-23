import type {
  locations,
  locationContents,
  locationsFiles,
} from "@/lib/db/schema";
import type { FileWithAssets } from "./file";

export type Location = typeof locations.$inferSelect;

export type LocationContent = typeof locationContents.$inferSelect;

export type LocationsFiles = (typeof locationsFiles.$inferSelect & {
  file: FileWithAssets;
})[];

export type LocationWithFiles = Location & {
  locationsFiles: LocationsFiles;
};

export type LocationWithFilesAndContents = Location & {
  contents: LocationContent[];
  locationsFiles: LocationsFiles;
};

export type FullLocation = LocationWithFilesAndContents;
