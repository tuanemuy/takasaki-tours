import type { LucideIcon } from "lucide-react";

export type TableAction = {
  name: string;
  icon: LucideIcon;
  onClick: (id: string, label?: string) => void;
};
