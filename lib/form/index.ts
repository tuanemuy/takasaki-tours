import type { Role } from "@/lib/core/user";
import type { NewSchedule } from "@/lib/core/schedule";

export const InputKind = {
  Text: "text",
  Email: "email",
  Tel: "tel",
  Password: "password",
  Number: "number",
  Textarea: "textarea",
  File: "file",
  Image: "image",
  MultipleImage: "multiple-image",
  Switch: "switch",
  Color: "color",
  Date: "date",
  Month: "month",
  Select: "select",
  Checkbox: "checkbox",
  RadioGroup: "radio-group",
  Table: "table",
  MultipleTable: "multiple-table",
  External: "external",
  Hidden: "hidden",
  Schedules: "schedules",
} as const;
export type InputKind = (typeof InputKind)[keyof typeof InputKind];

export type InputOptions = {
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  exclude?: boolean;
  noLabel?: boolean;
  note?: string;
  onChange?: (value: string | boolean) => void;
};

export type BaseInput = {
  kind: InputKind;
} & InputOptions;

export type TextareaInput = BaseInput & {
  rows: number;
};

export const TextAreaSizes = {
  S: 100,
  M: 300,
  L: 1000,
  XL: 10000,
} as const;

export type NumberInput = BaseInput & {
  min?: number;
  max?: number;
};

export type MultipleInput = BaseInput & {
  items: {
    label: string;
    value: string;
  }[];
};

export type RadioGroupInput = MultipleInput & {
  orientation?: "horizontal" | "vertical";
};

export type SwitchInput = BaseInput & {
  label?: string;
};

export type ImageInput = BaseInput & {
  resizes: number[];
  maxWidth?: number;
  displayWidth?: number;
  aspectRatio?: number;
  valueType?: "id" | "json";
  onChangeImage?: (image: {
    id: string;
    src: string;
    srcSet: string;
  }) => void;
};

export type MultipleImageInput = BaseInput & {
  resizes: number[];
  aspectRatio: number;
  maxWidth?: number;
  displayWidth?: number;
  defaultValues?: string[];
};

export type TableInput = BaseInput & {
  table: string;
  role: Role;
};

export type MultipleTableInput = TableInput & {
  defaultValues?: string[];
  defaultLabels?: string[];
};

export type ExternalInput = BaseInput & {
  href: string;
};

export type SchedulesInput = BaseInput & {
  defaultValues?: NewSchedule[];
};

export type Input =
  | BaseInput
  | TextareaInput
  | NumberInput
  | MultipleInput
  | RadioGroupInput
  | SwitchInput
  | ImageInput
  | TableInput
  | MultipleTableInput
  | ExternalInput
  | SchedulesInput;
