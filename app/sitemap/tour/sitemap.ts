export const revalidate = 3600;
export const dynamicParams = true;

import type { MetadataRoute } from "next";
import { baseUrl, sitemapPerPage } from "@/lib/config";
import { defaultLocale } from "@/lib/i18n";
import { Order } from "@/lib/db";
import { getErrorMessage } from "@/lib/action/error";
import { countTours, listTours } from "@/actions/public/tour";

export async function generateSitemaps() {
  const { count } = await countTours();
  const pages = Math.ceil(count / sitemapPerPage);
  return [...Array(pages)].map((_, i) => {
    return { id: i };
  });
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const { result, error } = await listTours({
    page: Number.parseInt(id, 10) + 1,
    perPage: sitemapPerPage,
    order: Order.ASC,
    orderBy: "id",
  });

  if (!result) {
    throw new Error(error ? getErrorMessage(error) : "Failed to fetch tours.");
  }

  return result.map((tour) => {
    return {
      url: `${baseUrl}/${defaultLocale}/tour/${tour.slug}`,
      lastModified: tour.updatedAt,
      alternates: {
        languages: {
          en: `${baseUrl}/en/tour/${tour.slug}`,
          ja: `${baseUrl}/ja/tour/${tour.slug}`,
        },
      },
    };
  });
}
