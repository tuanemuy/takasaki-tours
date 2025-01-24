import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/config";
import { defaultLocale } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/${defaultLocale}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          ja: `${baseUrl}/ja`,
          "zh-Hans": `${baseUrl}/zh-Hans`,
          "zh-Hant": `${baseUrl}/zh-Hant`,
        },
      },
    },
    {
      url: `${baseUrl}/${defaultLocale}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      alternates: {
        languages: {
          en: `${baseUrl}/en/privacy-policy`,
          ja: `${baseUrl}/ja/privacy-policy`,
          "zh-Hans": `${baseUrl}/zh-Hans/privacy-policy`,
          "zh-Hant": `${baseUrl}/zh-Hant/privacy-policy`,
        },
      },
    },
  ];
}
