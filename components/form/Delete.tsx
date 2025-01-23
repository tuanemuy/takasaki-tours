"use client";

import { useActionState } from "react";
import type { FormAction } from "@/lib/action";

import NextForm from "next/form";
import { Stack } from "@/styled-system/jsx";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Dialog } from "@/components/ui/dialog";
import { Portal } from "@/components/layout/Portal";
import { X } from "lucide-react";

type Props<TData, TResult> = {
  id: string;
  deleteAction: FormAction<TData, TResult>;
};

export function Delete<TData, TResult>({
  id,
  deleteAction,
}: Props<TData, TResult>) {
  const [_state, action, isPending] = useActionState(deleteAction, {
    data: { id } as TData,
    count: 0,
    error: null,
    issues: [],
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button type="button" variant="subtle" size="sm">
          削除する
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Stack gap="8" p="6">
              <Stack gap="1">
                <Dialog.Title>本当に削除しますか？</Dialog.Title>
                <Dialog.Description>
                  削除したデータを元に戻すことはできません。
                </Dialog.Description>
              </Stack>
              <NextForm action={action} style={{ width: "100%" }}>
                <Stack gap="3" direction="row" w="full">
                  <Dialog.CloseTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      w="full"
                      flexShrink="1"
                    >
                      キャンセル
                    </Button>
                  </Dialog.CloseTrigger>
                  <input type="hidden" name="id" value={id} />
                  <Button
                    type="submit"
                    loading={isPending}
                    width="full"
                    flexShrink="1"
                  >
                    削除する
                  </Button>
                </Stack>
              </NextForm>
            </Stack>
            <Dialog.CloseTrigger asChild position="absolute" top="2" right="2">
              <IconButton aria-label="Close Dialog" variant="ghost" size="sm">
                <X />
              </IconButton>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
