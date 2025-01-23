"use client";

import { Toast } from "@/components/ui/toast";
import { IconButton } from "@/components/ui/icon-button";
import { X } from "lucide-react";

export const toaster = Toast.createToaster({
  placement: "bottom-end",
  overlap: true,
  gap: 16,
});

export function Toaster() {
  return (
    <Toast.Toaster toaster={toaster}>
      {(toast) => (
        <Toast.Root key={toast.id}>
          <Toast.Title>{toast.title}</Toast.Title>
          <Toast.Description>{toast.description}</Toast.Description>
          <Toast.CloseTrigger asChild>
            <IconButton size="sm" variant="link">
              <X />
            </IconButton>
          </Toast.CloseTrigger>
        </Toast.Root>
      )}
    </Toast.Toaster>
  );
}
