import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/sitemapindex/",
        "/sitemap/",
        "/ja/",
        "/en/",
        "/zh-Hans/",
        "/zh-Hant/",
      ],
    },
    sitemap: [`${baseUrl}/sitemapindex/sitemap.xml`],
  };
}
