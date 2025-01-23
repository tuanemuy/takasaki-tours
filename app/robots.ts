import type { MetadataRoute } from "next";

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
    sitemap: [`${process.env.NEXT_PUBLIC_BASE_URL}/sitemapindex/sitemap.xml`],
  };
}
