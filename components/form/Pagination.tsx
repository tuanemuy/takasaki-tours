"use client";

import { useRouter } from "next/navigation";
import type { RawSearchParams } from "@/lib/router";
import { SearchParams } from "@/lib/router";

import { Pagination as PaginationUI } from "@/components/ui/pagination";

type Props = {
  count: number;
  perPage: number;
  page: number;
  redirect?: {
    basePath: string;
    rawSearchParams: RawSearchParams;
  };
  onChange?: (page: number) => void;
};

export function Pagination({
  count,
  perPage,
  page,
  redirect,
  onChange,
}: Props) {
  const router = useRouter();
  return (
    <PaginationUI
      count={count}
      pageSize={perPage}
      page={page}
      onPageChange={(details) => {
        if (redirect) {
          const searchParams = SearchParams.fromRaw(redirect.rawSearchParams);
          const newSearchParams = searchParams.replace("page", [
            details.page.toString(),
          ]);
          router.push(`${redirect.basePath}?${newSearchParams.toString()}`);
        }
        onChange?.(details.page);
      }}
    />
  );
}
