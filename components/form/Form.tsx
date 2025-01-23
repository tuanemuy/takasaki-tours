"use client";

import { useRouter } from "next/navigation";
import { useActionState, useRef, useState, useEffect } from "react";
import { getSrc } from "@/lib/core/file";
import type { NewSchedule } from "@/lib/core/schedule";
import type {
  Input,
  TextareaInput,
  NumberInput,
  MultipleInput,
  RadioGroupInput,
  ImageInput,
  MultipleImageInput,
  TableInput as TableInputType,
  MultipleTableInput as MultipleTableInputType,
  ExternalInput,
  SchedulesInput as SchedulesInputType,
} from "@/lib/form";
import { InputKind } from "@/lib/form";
import type { FormAction } from "@/lib/action";
import { useDictionary } from "@/lib/i18n/context";

import NextLink from "next/link";
import NextForm from "next/form";
import { Stack, HStack, styled } from "@/styled-system/jsx";
import { Button } from "@/components/ui/button";
import { Field as FieldUI } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup } from "@/components/ui/radio-group";
import { Dialog } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Portal } from "@/components/layout/Portal";
import { Select } from "@/components/form/Select";
import { ColorInput } from "@/components/form/ColorInput";
import { Switch } from "@/components/form/Switch";
import { FileInput } from "@/components/form/FileInput";
import { MultipleFileInput } from "@/components/form/MultipleFileInput";
import { type TableComponent, TableInput } from "@/components/form/TableInput";
import { MultipleTableInput } from "@/components/form/MultipleTableInput";
import { Table as UserTable } from "@/components/user/Table";
import { Table as LocationTable } from "@/components/location/Table";
import { SchedulesInput } from "@/components/form/SchedulesInput";
import { Status } from "@/components/form/Status";
import { Info, ExternalLink, X } from "lucide-react";

type Field = {
  label?: string;
  name: string;
  note?: string;
  input: Input;
};

type Props<TData, TResult> = {
  name: string;
  initialData?: TData;
  fields: Field[];
  formAction: FormAction<TData, TResult>;
  trailing?: React.ReactNode;
  submitLabel?: string;
  hideError?: boolean;
  withRecaptcha?: boolean;
  confirmation?: {
    title: string;
    description: string;
    confirm: string;
  };
};

export function Form<TData, TResult>({
  name,
  initialData,
  fields,
  formAction,
  trailing,
  submitLabel,
  hideError,
  withRecaptcha,
  confirmation,
}: Props<TData, TResult>) {
  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaRef = useRef<HTMLInputElement>(null);
  const formId = name;
  const dictionary = useDictionary();

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const [state, action, isPending] = useActionState(formAction, {
    data: initialData || ({} as TData),
    count: 0,
    error: null,
    issues: [],
  });

  // Workaround
  // https://github.com/vercel/next.js/pull/73063
  const router = useRouter();
  useEffect(() => {
    if (state.redirect) {
      router.push(state.redirect);
    }
  }, [router, state.redirect]);

  const invalidFields = state.issues?.flatMap((i) => i.path) || [];

  const submit = () => {
    if (withRecaptcha && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY, {
            action: "submit",
          })
          .then((token) => {
            if (recaptchaRef.current) {
              recaptchaRef.current.value = token;
              formRef.current?.requestSubmit();
            }
          });
      });
    } else {
      formRef.current?.requestSubmit();
    }

    setIsOpenDialog(false);
  };

  let index = 0;
  return (
    <>
      <NextForm id={formId} action={action} ref={formRef}>
        {withRecaptcha && (
          <input type="hidden" name="recaptchaToken" ref={recaptchaRef} />
        )}

        {fields.map((f) => {
          const kind = f.input.kind;
          if (kind !== InputKind.Hidden) {
            index += 1;
          }
          return (
            <FieldUI.Root
              key={f.name}
              invalid={invalidFields.includes(f.name)}
              mt={index !== 1 && kind !== InputKind.Hidden ? "6" : "0"}
            >
              {kind !== InputKind.Hidden && !f.input.noLabel && (
                <FieldUI.Label display="block" mb="2" fontWeight="bold">
                  {f.label || f.name} {f.input.required && "*"}
                </FieldUI.Label>
              )}

              {f.note && (
                <FieldUI.HelperText
                  dangerouslySetInnerHTML={{ __html: f.note }}
                  display="block"
                  mb="2"
                />
              )}

              {(kind === InputKind.Text ||
                kind === InputKind.Email ||
                kind === InputKind.Tel ||
                kind === InputKind.Password ||
                kind === InputKind.Date ||
                kind === InputKind.Month) && (
                <FieldUI.Input
                  type={kind}
                  name={!f.input.exclude ? f.name : undefined}
                  defaultValue={
                    (state.data[f.name as keyof TData] ||
                      f.input.defaultValue ||
                      "") as string
                  }
                  required={f.input.required}
                  readOnly={f.input.readOnly}
                  placeholder={f.input.placeholder || ""}
                  onChange={(event) => {
                    f.input.onChange?.(event.target.value);
                  }}
                />
              )}

              {kind === InputKind.Number && (
                <FieldUI.Input
                  type={kind}
                  name={!f.input.exclude ? `+${f.name}` : undefined}
                  defaultValue={
                    (state.data[f.name as keyof TData] ||
                      f.input.defaultValue ||
                      "") as string
                  }
                  min={(f.input as NumberInput).min}
                  max={(f.input as NumberInput).max}
                  required={f.input.required}
                  readOnly={f.input.readOnly}
                  onChange={(event) => {
                    f.input.onChange?.(event.target.value);
                  }}
                />
              )}

              {kind === InputKind.Color && (
                <FieldUI.Input asChild>
                  <ColorInput
                    name={!f.input.exclude ? f.name : undefined}
                    defaultValue={
                      (state.data[f.name as keyof TData] ||
                        f.input.defaultValue ||
                        "") as string
                    }
                    required={f.input.required}
                    readOnly={f.input.readOnly}
                    onValueChange={(value) => {
                      f.input.onChange?.(value);
                    }}
                  />
                </FieldUI.Input>
              )}

              {kind === InputKind.Textarea && (
                <FieldUI.Textarea
                  name={!f.input.exclude ? f.name : undefined}
                  defaultValue={
                    (state.data[f.name as keyof TData] ||
                      f.input.defaultValue ||
                      "") as string
                  }
                  rows={(f.input as TextareaInput).rows}
                  required={f.input.required}
                  readOnly={f.input.readOnly}
                  placeholder={f.input.placeholder || ""}
                  onChange={(event) => {
                    f.input.onChange?.(event.target.value);
                  }}
                  asChild
                >
                  <Textarea />
                </FieldUI.Textarea>
              )}

              {f.input.kind === InputKind.Select && (
                <FieldUI.Input asChild>
                  <Select
                    name={!f.input.exclude ? f.name : undefined}
                    items={(f.input as MultipleInput).items}
                    defaultValue={
                      (state.data[f.name as keyof TData] ||
                        f.input.defaultValue ||
                        "") as string
                    }
                    required={f.input.required}
                    readOnly={f.input.readOnly}
                    onValueChange={(value) => {
                      f.input.onChange?.(value);
                    }}
                  />
                </FieldUI.Input>
              )}

              {f.input.kind === InputKind.RadioGroup && (
                <FieldUI.Input asChild>
                  <RadioGroup.Root
                    name={!f.input.exclude ? f.name : undefined}
                    defaultValue={
                      (state.data[f.name as keyof TData] ||
                        f.input.defaultValue ||
                        "") as string
                    }
                    orientation={(f.input as RadioGroupInput).orientation}
                    onValueChange={(details) => {
                      f.input.onChange?.(details.value);
                    }}
                    readOnly={f.input.readOnly}
                  >
                    {(f.input as RadioGroupInput).items.map((item) => (
                      <RadioGroup.Item key={item.value} value={item.value}>
                        <RadioGroup.ItemControl />
                        <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                        <RadioGroup.ItemHiddenInput />
                      </RadioGroup.Item>
                    ))}
                  </RadioGroup.Root>
                </FieldUI.Input>
              )}

              {f.input.kind === InputKind.Switch && (
                <FieldUI.Input asChild>
                  <Switch
                    name={!f.input.exclude ? `&${f.name}` : undefined}
                    defaultValue={
                      (
                        state.data[f.name as keyof TData] ||
                        f.input.defaultValue
                      )?.toString() === "true"
                    }
                    required={f.input.required}
                    readOnly={f.input.readOnly}
                    onValueChange={(value) => {
                      f.input.onChange?.(value);
                    }}
                  />
                </FieldUI.Input>
              )}

              {kind === InputKind.Image && (
                <FieldUI.Input asChild>
                  <FileInput
                    name={!f.input.exclude ? f.name : undefined}
                    resizes={(f.input as ImageInput).resizes}
                    maxWidth={(f.input as ImageInput).maxWidth}
                    displayWidth={(f.input as ImageInput).displayWidth}
                    aspectRatio={(f.input as ImageInput).aspectRatio}
                    initialFileId={
                      (state.data[f.name as keyof TData] ||
                        f.input.defaultValue ||
                        "") as string
                    }
                    valueType={(f.input as ImageInput).valueType}
                    readOnly={f.input.readOnly}
                    onChange={(value, file) => {
                      f.input.onChange?.(value);
                      (f.input as ImageInput).onChangeImage?.({
                        id: file.id,
                        ...getSrc(file),
                      });
                    }}
                  />
                </FieldUI.Input>
              )}

              {kind === InputKind.MultipleImage && (
                <FieldUI.Input asChild>
                  <MultipleFileInput
                    name={!f.input.exclude ? f.name : undefined}
                    resizes={(f.input as ImageInput).resizes}
                    maxWidth={(f.input as ImageInput).maxWidth}
                    displayWidth={(f.input as ImageInput).displayWidth}
                    aspectRatio={(f.input as ImageInput).aspectRatio}
                    initialFileIds={
                      (state.data[f.name as keyof TData] as string[]) ||
                      (f.input as MultipleImageInput).defaultValues ||
                      []
                    }
                  />
                </FieldUI.Input>
              )}

              {f.input.kind === InputKind.External && (
                <HStack>
                  <Button asChild variant="outline">
                    <NextLink href={(f.input as ExternalInput).href}>
                      <ExternalLink />
                      {dictionary.buttons.edit}
                    </NextLink>
                  </Button>
                </HStack>
              )}

              {f.input.kind === InputKind.Hidden && (
                <input
                  type="hidden"
                  name={!f.input.exclude ? f.name : undefined}
                  defaultValue={
                    (state.data[f.name as keyof TData] ||
                      f.input.defaultValue ||
                      "") as string
                  }
                />
              )}

              {kind === InputKind.Table &&
                (() => {
                  let table: TableComponent | null;
                  switch ((f.input as TableInputType).table) {
                    case "user":
                      table = UserTable;
                      break;
                    case "location":
                      table = LocationTable;
                      break;
                    default:
                      table = null;
                  }

                  if (table) {
                    return (
                      <FieldUI.Input asChild>
                        <TableInput
                          name={!f.input.exclude ? f.name : undefined}
                          table={table}
                          defaultValue={
                            (state.data[f.name as keyof TData] ||
                              f.input.defaultValue ||
                              "") as string
                          }
                          required={f.input.required}
                          readOnly={f.input.readOnly}
                          role={(f.input as TableInputType).role}
                          onValueChange={(value) => {
                            f.input.onChange?.(value);
                          }}
                        />
                      </FieldUI.Input>
                    );
                  }
                })()}

              {kind === InputKind.MultipleTable &&
                (() => {
                  let table: TableComponent | null;
                  switch ((f.input as TableInputType).table) {
                    case "user":
                      table = UserTable;
                      break;
                    case "location":
                      table = LocationTable;
                      break;
                    default:
                      table = null;
                  }

                  if (table) {
                    return (
                      <FieldUI.Input asChild>
                        <MultipleTableInput
                          name={!f.input.exclude ? f.name : undefined}
                          table={table}
                          defaultValues={
                            (state.data[f.name as keyof TData] as string[]) ||
                            (f.input as MultipleTableInputType).defaultValues ||
                            []
                          }
                          defaultLabels={
                            (f.input as MultipleTableInputType).defaultLabels ||
                            []
                          }
                          role={(f.input as TableInputType).role}
                        />
                      </FieldUI.Input>
                    );
                  }
                })()}

              {kind === InputKind.Schedules && (
                <FieldUI.Input asChild>
                  <SchedulesInput
                    name={!f.input.exclude ? f.name : undefined}
                    defaultValues={
                      (state.data[f.name as keyof TData] as NewSchedule[]) ||
                      (f.input as SchedulesInputType).defaultValues ||
                      []
                    }
                  />
                </FieldUI.Input>
              )}

              <FieldUI.ErrorText>
                {dictionary.messages.invalidValue}
              </FieldUI.ErrorText>
            </FieldUI.Root>
          );
        })}
      </NextForm>

      {state.error && (
        <Alert.Root mt="6">
          <Alert.Icon asChild>
            <Info />
          </Alert.Icon>
          <Alert.Title>{dictionary.messages.failedToSend}</Alert.Title>
          <Alert.Description>
            {hideError
              ? dictionary.messages.tryAgain
              : dictionary.errors[state.error] || dictionary.messages.tryAgain}
          </Alert.Description>
        </Alert.Root>
      )}

      <HStack justifyContent="space-between" mt="6">
        {!confirmation && (
          <HStack alignItems="center" gap="6">
            <Button
              type="button"
              onClick={submit}
              loading={isPending}
              variant="outline"
            >
              {submitLabel ||
                (initialData
                  ? dictionary.buttons.save
                  : dictionary.buttons.add)}
            </Button>
            {initialData && (
              <Status
                status={isPending ? "pending" : state.error ? "error" : "saved"}
              />
            )}
          </HStack>
        )}

        {confirmation && (
          <>
            <Button
              type="button"
              variant="outline"
              loading={isPending}
              onClick={() => {
                if (formRef.current?.checkValidity()) {
                  setIsOpenDialog(true);
                } else {
                  formRef.current?.reportValidity();
                }
              }}
            >
              {submitLabel ||
                (initialData
                  ? dictionary.buttons.save
                  : dictionary.buttons.add)}
            </Button>
            <Dialog.Root
              open={isOpenDialog}
              onOpenChange={(details) => setIsOpenDialog(details.open)}
            >
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Stack gap="8" p="6">
                      <Stack gap="1">
                        <Dialog.Title>{confirmation.title}</Dialog.Title>
                        <Dialog.Description
                          dangerouslySetInnerHTML={{
                            __html: confirmation.description,
                          }}
                        />
                      </Stack>
                      <Stack gap="3" direction="row" w="full">
                        <Dialog.CloseTrigger asChild>
                          <Button
                            type="button"
                            variant="subtle"
                            w="full"
                            flexShrink="1"
                          >
                            {dictionary.buttons.cancel}
                          </Button>
                        </Dialog.CloseTrigger>
                        <Button
                          type="button"
                          onClick={submit}
                          loading={isPending}
                          width="full"
                          flexShrink="1"
                        >
                          {confirmation.confirm}
                        </Button>
                      </Stack>
                    </Stack>
                    <Dialog.CloseTrigger
                      asChild
                      position="absolute"
                      top="2"
                      right="2"
                    >
                      <IconButton
                        aria-label="Close Dialog"
                        variant="ghost"
                        size="sm"
                      >
                        <X />
                      </IconButton>
                    </Dialog.CloseTrigger>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          </>
        )}

        {trailing}
      </HStack>

      {withRecaptcha && (
        <styled.p
          mt="8"
          color="fg.subtle"
          css={{
            "& a": {
              textDecoration: "underline",
            },
          }}
        >
          This site is protected by reCAPTCHA and the Google&nbsp;
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </a>
          &nbsp;and&nbsp;
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noreferrer"
          >
            Terms of Service
          </a>
          &nbsp;apply.
        </styled.p>
      )}
    </>
  );
}
