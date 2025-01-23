import Link from "next/link";
import { IconButton } from "@/components/ui/icon-button";
import { CircleUser } from "lucide-react";

export default function DefaultTrailing() {
  return (
    <IconButton variant="ghost" size="sm" asChild>
      <Link href="/user/settings">
        <CircleUser />
      </Link>
    </IconButton>
  );
}
