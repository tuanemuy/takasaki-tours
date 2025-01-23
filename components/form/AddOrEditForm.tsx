"use client";

import { useActionState } from "react";
import { getSrc } from "@/lib/core/file";
import type {
  Input,
  TextareaInput,
  MultipleInput,
  RadioGroupInput,
  ImageInput,
  TableInput as TableInputType,
  ExternalInput,
} from "@/lib/form";
import { InputKind } from "@/lib/form";
import type { FormAction } from "@/lib/action";
import { getErrorMessage } from "@/lib/action/error";

import NextLink from "next/link";
import NextForm from "next/form";
import { HStack } from "@/styled-system/jsx";
import { Button } from "@/components/ui/button";
import { Field as FieldUI } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup } from "@/components/ui/radio-group";
import { Select } from "@/components/form/Select";
import { ColorInput } from "@/components/form/ColorInput";
import { Switch } from "@/components/form/Switch";
import { FileInput } from "@/components/form/FileInput";
import { TableInput } from "@/components/form/TableInput";
import { Table as UserTable } from "@/components/user/Table";
import { Table as LocationTable } from "@/components/location/Table";
import { Status } from "@/components/form/Status";
import { Remove } from "./Remove";
import { Info, ExternalLink } from "lucide-react";

type Field = {
  label?: string;
  name: string;
  input: Input;
};

type Props<TData, TResult, UData, UResult> = {
  name: string;
  initialData?: TData;
  fields: Field[];
  addOrEdit: FormAction<TData, TResult>;
  remove?: FormAction<UData, UResult>;
  idToRemove?: string;
};

export function AddOrEditForm<TData, TResult, UData, UResult>({
  name,
  initialData,
  fields,
  addOrEdit,
  remove,
  idToRemove,
}: Props<TData, TResult, UData, UResult>) {
  const formId = name;

  const [addOrEditState, addOrEditAction, isPendingAddOrEdit] = useActionState(
    addOrEdit,
    { data: initialData || ({} as TData), count: 0, error: null, issues: [] },
  );

  const invalidFields = addOrEditState.issues?.flatMap((i) => i.path) || [];

  return (
    <>
      <NextForm id={formId} action={addOrEditAction}>
        {fields.map((f, index) => {
          const kind = f.input.kind;
          return (
            <FieldUI.Root
              key={f.name}
              invalid={invalidFields.includes(f.name)}
              mt={index !== 0 && kind !== InputKind.Hidden ? "4" : "0"}
            >
              {kind !== InputKind.Hidden && (
                <FieldUI.Label>
                  {f.label || f.name} {f.input.required && "*"}
                </FieldUI.Label>
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
                    (addOrEditState.data[f.name as keyof TData] ||
                      f.input.defaultValue ||
                      "") as string
                  }
                  required={f.input.required}
                  readOnly={f.input.readOnly}
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
                    (addOrEditState.data[f.name as keyof TData] ||
                      f.input.defaultValue ||
                      "") as string
                  }
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
                      (addOrEditState.data[f.name as keyof TData] ||
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
                    (addOrEditState.data[f.name as keyof TData] ||
                      f.input.defaultValue ||
                      "") as string
                  }
                  rows={(f.input as TextareaInput).rows}
                  required={f.input.required}
                  readOnly={f.input.readOnly}
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
                      (addOrEditState.data[f.name as keyof TData] ||
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
                      (addOrEditState.data[f.name as keyof TData] ||
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
                        addOrEditState.data[f.name as keyof TData] ||
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
                      (addOrEditState.data[f.name as keyof TData] ||
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

              {f.input.kind === InputKind.External && (
                <HStack>
                  <Button asChild variant="outline">
                    <NextLink href={(f.input as ExternalInput).href}>
                      <ExternalLink />
                      Edit
                    </NextLink>
                  </Button>
                </HStack>
              )}

              {f.input.kind === InputKind.Hidden && (
                <input
                  type="hidden"
                  name={!f.input.exclude ? f.name : undefined}
                  defaultValue={
                    (addOrEditState.data[f.name as keyof TData] ||
                      f.input.defaultValue ||
                      "") as string
                  }
                />
              )}

              {kind === InputKind.Table &&
                (f.input as TableInputType).table === "user" && (
                  <FieldUI.Input asChild>
                    <TableInput
                      name={!f.input.exclude ? f.name : undefined}
                      table={UserTable}
                      defaultValue={
                        (addOrEditState.data[f.name as keyof TData] ||
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
                )}

              {kind === InputKind.Table &&
                (f.input as TableInputType).table === "location" && (
                  <FieldUI.Input asChild>
                    <TableInput
                      name={!f.input.exclude ? f.name : undefined}
                      table={LocationTable}
                      defaultValue={
                        (addOrEditState.data[f.name as keyof TData] ||
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
                )}
              <FieldUI.ErrorText>正しく入力してください</FieldUI.ErrorText>
            </FieldUI.Root>
          );
        })}
      </NextForm>

      {addOrEditState.error && (
        <Alert.Root mt="6">
          <Alert.Icon asChild>
            <Info />
          </Alert.Icon>
          <Alert.Title>
            {initialData ? "更新" : "作成"}できませんでした
          </Alert.Title>
          <Alert.Description>
            {getErrorMessage(addOrEditState.error)}
          </Alert.Description>
        </Alert.Root>
      )}

      <HStack justifyContent="space-between" mt="6">
        <HStack alignItems="center" gap="6">
          <Button
            type="submit"
            form={formId}
            loading={isPendingAddOrEdit}
            variant="outline"
          >
            {initialData ? "更新する" : "作成する"}
          </Button>
          {initialData && (
            <Status
              status={
                isPendingAddOrEdit
                  ? "pending"
                  : addOrEditState.error
                    ? "error"
                    : "saved"
              }
            />
          )}
        </HStack>

        {idToRemove && remove && (
          <Remove id={idToRemove} removeAction={remove} />
        )}
      </HStack>
    </>
  );
}
