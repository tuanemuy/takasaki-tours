export const revalidate = 3600;
export const dynamicParams = true;

import type { MetadataRoute } from "next";
import { baseUrl, sitemapPerPage } from "@/lib/config";
import { defaultLocale } from "@/lib/i18n";
import { Order } from "@/lib/db";
import { getErrorMessage } from "@/lib/action/error";
import { countLocations, listLocations } from "@/actions/public/location";

export async function generateSitemaps() {
  const { count } = await countLocations();
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
  const { result, error } = await listLocations({
    page: Number.parseInt(id, 10) + 1,
    perPage: sitemapPerPage,
    order: Order.ASC,
    orderBy: "id",
  });

  if (!result) {
    throw new Error(
      error ? getErrorMessage(error) : "Failed to fetch locations.",
    );
  }

  return result.map((location) => {
    return {
      url: `${baseUrl}/${defaultLocale}/location/${location.id}`,
      lastModified: location.updatedAt,
      alternates: {
        languages: {
          en: `${baseUrl}/en/location/${location.id}`,
          ja: `${baseUrl}/ja/location/${location.id}`,
        },
      },
    };
  });
}
