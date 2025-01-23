import { notFound, forbidden } from "next/navigation";
import { ActionError } from "@/lib/action/error";

export type RawSearchParams = { [key: string]: string | string[] | undefined };

export class SearchParams {
  constructor(public readonly params: { [key: string]: string[] }) {}

  static fromRaw(params: RawSearchParams): SearchParams {
    const p: { [key: string]: string[] } = {};

    for (const key in params) {
      if (params[key] !== undefined && params[key] !== "") {
        p[key] = [params[key] as string | string[]].flat();
      }
    }

    return new SearchParams(p);
  }

  replace(key: string, value: string[]): SearchParams {
    const newParams = { ...this.params };
    newParams[key] = value;
    return new SearchParams(newParams);
  }

  get(key: string): string[] {
    return this.params[key];
  }

  getAsInt(key: string): number[] {
    return this.params[key].map((p) => Number.parseInt(p, 10));
  }

  getOne(key: string, index = 0): string | undefined {
    return this.params[key]?.at(index);
  }

  getOneAsInt(key: string, index = 0): number | undefined {
    const param = this.params[key]?.at(index);
    if (!param) {
      return undefined;
    }
    return Number.parseInt(param, 10);
  }

  toString(): string {
    return new URLSearchParams(
      Object.entries(this.params).map(([key, value]) => {
        return [key, value.join(",")];
      }),
    ).toString();
  }
}

export function handleActionError(error?: ActionError | null) {
  switch (error) {
    case ActionError.NotFoundError:
      return notFound();
    case ActionError.UnauthorizedError:
      return forbidden();
    default:
      return null;
  }
}
