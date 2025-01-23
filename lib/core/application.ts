export const ApplicationStatus = {
  NEW: "new",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELED: "canceled",
} as const;
export type ApplicationStatus =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export function stringToApplicationStatus(
  status: string,
): ApplicationStatus | undefined {
  switch (status) {
    case ApplicationStatus.NEW:
      return ApplicationStatus.NEW;
    case ApplicationStatus.APPROVED:
      return ApplicationStatus.APPROVED;
    case ApplicationStatus.REJECTED:
      return ApplicationStatus.REJECTED;
    case ApplicationStatus.CANCELED:
      return ApplicationStatus.CANCELED;
  }
}

export function getApplicationStatusLabel(status: ApplicationStatus): string {
  switch (status) {
    case ApplicationStatus.NEW:
      return "新規";
    case ApplicationStatus.APPROVED:
      return "承認";
    case ApplicationStatus.REJECTED:
      return "拒否";
    case ApplicationStatus.CANCELED:
      return "キャンセル";
    default:
      status satisfies never;
      throw new Error("Unreachable");
  }
}

export function getApplicationStatusColor(status: ApplicationStatus) {
  switch (status) {
    case ApplicationStatus.NEW:
      return "amber.light.9";
    case ApplicationStatus.APPROVED:
      return "grass.light.9";
    case ApplicationStatus.REJECTED:
      return "gray.light.9";
    case ApplicationStatus.CANCELED:
      return "gray.light.9";
    default:
      status satisfies never;
      throw new Error("Unreachable");
  }
}
