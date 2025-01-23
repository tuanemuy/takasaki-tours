import type { users } from "@/lib/db/schema";

export type User = typeof users.$inferSelect;

export const Role = {
  ADMIN: "admin",
  USER: "user",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const roleItems = Object.values(Role).map((value) => {
  return {
    label: getRoleName(value),
    value,
  };
});

export function stringToRole(str: string): Role | undefined {
  switch (str) {
    case "admin":
      return Role.ADMIN;
    case "user":
      return Role.USER;
    default:
      return undefined;
  }
}

export function getRoleName(role?: Role): string {
  switch (role) {
    case Role.ADMIN:
      return "Admin";
    case Role.USER:
      return "User";
    default:
      return "Unknown";
  }
}

export function getRoleVariant(role?: Role): "solid" | "subtle" | "outline" {
  switch (role) {
    case Role.ADMIN:
      return "solid";
    case Role.USER:
      return "outline";
    default:
      return "subtle";
  }
}
