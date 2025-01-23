import type { ZodSchema, ZodIssue } from "zod";
import { parseFormData } from "parse-nested-form-data";
import { auth } from "@/lib/auth";
import { Logger } from "@/lib/logger";
import { ActionError } from "./error";

const logger = new Logger();

export type BaseActionResult<TData, TResult> = {
  data: TData;
  result?: TResult[];
  count: number;
  error: ActionError | null;
  redirect?: string; // Server Action内でリダイレクトできないバグがある？から
};

export type ValidatedActionResult<TData, TResult> = BaseActionResult<
  TData,
  TResult
> & {
  issues: ZodIssue[];
};

export type ActionResult<TData, TResult> =
  | BaseActionResult<TData, TResult>
  | ValidatedActionResult<TData, TResult>;

export type AsyncActionResult<TData, TResult> =
  | Promise<ActionResult<TData, TResult>>
  | ActionResult<TData, TResult>;

export type Action<TData, TResult> = (
  data: TData,
  // biome-ignore lint/suspicious/noExplicitAny:
  ...args: any[]
) => Promise<ActionResult<TData, TResult>> | ActionResult<TData, TResult>;

export type ValidatedAction<TData, TResult> = (
  data: TData,
  // biome-ignore lint/suspicious/noExplicitAny:
  ...args: any[]
) =>
  | Promise<ValidatedActionResult<TData, TResult>>
  | ValidatedActionResult<TData, TResult>;

export function withAuth<TData, TResult>(
  f: (
    data: TData,
    userId: string,
    // biome-ignore lint/suspicious/noExplicitAny:
    ...args: any[]
  ) => AsyncActionResult<TData, TResult>,
): Action<TData, TResult> {
  // biome-ignore lint/suspicious/noExplicitAny:
  return async (data: TData, ...args: any[]) => {
    try {
      const session = await auth();
      if (!session) {
        return {
          data,
          count: -1,
          error: ActionError.UnauthorizedError,
        };
      }
      return f(data, session.user.id, ...args);
    } catch (e) {
      logger.error(e);
      return { data, count: -1, error: ActionError.AuthError };
    }
  };
}

export function requireAuth<TData, TResult>(
  f: Action<TData, TResult>,
): Action<TData, TResult> {
  // biome-ignore lint/suspicious/noExplicitAny:
  return async (data: TData, ...args: any[]) => {
    try {
      const session = await auth();
      if (session) {
        return f(data, ...args);
      }
    } catch (e) {
      logger.error(e);
    }
    return { data, count: -1, error: ActionError.AuthError };
  };
}

export function requireAdmin<TData, TResult>(
  f: Action<TData, TResult>,
): Action<TData, TResult> {
  // biome-ignore lint/suspicious/noExplicitAny:
  return async (data: TData, ...args: any[]) => {
    try {
      const session = await auth();
      if (session?.user.role === "admin") {
        return f(data, ...args);
      }
    } catch (e) {
      logger.error(e);
    }
    return { data, count: -1, error: ActionError.AuthError };
  };
}

export function validateActionInput<TData, TResult>(
  f: Action<TData, TResult>,
  schema: ZodSchema,
): ValidatedAction<TData, TResult> {
  // biome-ignore lint/suspicious/noExplicitAny:
  return async (data: TData, ...args: any[]) => {
    const validated = schema.safeParse(data);
    if (!validated.success) {
      logger.error(validated.error);
      return {
        data: data as TData,
        count: -1,
        error: ActionError.ValidationError,
        issues: validated.error.issues,
      };
    }

    const res = await f(validated.data, ...args);
    return {
      ...res,
      issues: [],
    } as ValidatedActionResult<TData, TResult>;
  };
}

export function validateActionResult<TData, TResult>(
  f: Action<TData, TResult>,
  schema: ZodSchema,
) {
  // biome-ignore lint/suspicious/noExplicitAny:
  return async (data: TData, ...args: any[]) => {
    const res = await f(data, ...args);
    return {
      ...res,
      result: res.result
        ?.map((r) => {
          try {
            return schema.parse(r);
          } catch (e) {
            return null;
          }
        })
        .filter((parsed): parsed is TResult => parsed !== null),
    };
  };
}

export function forUseActionState<TData, TResult>(
  f: (
    data: TData,
    prevState?: ActionResult<TData, TResult>,
  ) => Promise<ActionResult<TData, TResult>> | ActionResult<TData, TResult>,
) {
  return async (prevState: ActionResult<TData, TResult>, data: TData) => {
    return f(data, prevState);
  };
}

export type FormAction<TData, TResult> = (
  prevState: ValidatedActionResult<TData, TResult>,
  formData: FormData,
) =>
  | Promise<ValidatedActionResult<TData, TResult>>
  | ValidatedActionResult<TData, TResult>;

export function formAction<TData, TResult>(
  f: (
    data: TData,
    prevState?: ActionResult<TData, TResult>,
  ) => Promise<ActionResult<TData, TResult>> | ActionResult<TData, TResult>,
  schema: ZodSchema,
  withRecaptcha?: boolean,
): FormAction<TData, TResult> {
  return async (
    prevState: ValidatedActionResult<TData, TResult>,
    formData: FormData,
  ) => {
    let data: ReturnType<typeof parseFormData>;
    try {
      data = parseFormData(formData, {
        transformEntry: ([path, value], defaultTransform) => {
          return value === ""
            ? {
                path,
                value: null,
              }
            : defaultTransform([path, value]);
        },
      });
    } catch (e) {
      logger.error(e);
      return {
        ...prevState,
        error: ActionError.ValidationError,
        issues: [],
      };
    }

    if (withRecaptcha) {
      try {
        const res = await fetch(
          `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SECRET_KEY}&response=${data.recaptchaToken}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );
        const result = await res.json();
        if (!result.success) {
          return {
            ...prevState,
            error: ActionError.ReCAPTCHAError,
            issues: [],
          };
        }
      } catch (e) {
        return {
          ...prevState,
          error: ActionError.ReCAPTCHAError,
          issues: [],
        };
      }
    }

    return validateActionInput(f, schema)(data as TData, prevState);
  };
}
