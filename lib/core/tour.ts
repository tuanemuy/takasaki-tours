import type { tours, tourContents, toursFiles } from "@/lib/db/schema";
import type { Schedule } from "./schedule";
import type { FileWithAssets } from "./file";

export type Tour = Omit<typeof tours.$inferSelect, "notifyTo">;

export type TourContent = typeof tourContents.$inferSelect;

export type FullTourContent = TourContent & {
  schedules: Schedule[];
};

export type ToursFiles = (typeof toursFiles.$inferSelect & {
  file: FileWithAssets;
})[];

export type TourWithFiles = Tour & {
  toursFiles: ToursFiles;
};

export type TourWithFilesAndContents = Tour & {
  contents: TourContent[];
  toursFiles: ToursFiles;
};

export type TourWithFilesAndFullContents = Tour & {
  contents: FullTourContent[];
  toursFiles: ToursFiles;
};

export type FullTour = TourWithFilesAndFullContents;

export const TourStatus = {
  PUBLIC: "public",
  PRIVATE: "private",
} as const;
export type TourStatus = (typeof TourStatus)[keyof typeof TourStatus];
