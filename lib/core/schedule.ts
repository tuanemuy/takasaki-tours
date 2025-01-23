import type { schedules } from "@/lib/db/schema";

export type Schedule = typeof schedules.$inferSelect;

export const ScheduleKind = {
  LOCATION: "location",
  MOVEMENT: "movement",
} as const;
export type ScheduleKind = (typeof ScheduleKind)[keyof typeof ScheduleKind];

export type NewSchedule = {
  kind: ScheduleKind;
  heading: string;
  details?: string | null;
};

export function stringToScheduleKind(str: string): ScheduleKind | undefined {
  switch (str) {
    case "location":
      return ScheduleKind.LOCATION;
    case "movement":
      return ScheduleKind.MOVEMENT;
    default:
      return undefined;
  }
}

export function scheduleKindToLabel(kind?: ScheduleKind): string {
  switch (kind) {
    case ScheduleKind.LOCATION:
      return "場所";
    case ScheduleKind.MOVEMENT:
      return "移動";
    default:
      return "Unknown";
  }
}
