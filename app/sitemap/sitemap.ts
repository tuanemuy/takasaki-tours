import type { MetadataRoute } from "next";
import { defaultLocale } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${defaultLocale}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      alternates: {
        languages: {
          en: `${process.env.NEXT_PUBLIC_BASE_URL}/en`,
          ja: `${process.env.NEXT_PUBLIC_BASE_URL}/ja`,
          "zh-Hans": `${process.env.NEXT_PUBLIC_BASE_URL}/zh-Hans`,
          "zh-Hant": `${process.env.NEXT_PUBLIC_BASE_URL}/zh-Hant`,
        },
      },
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${defaultLocale}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      alternates: {
        languages: {
          en: `${process.env.NEXT_PUBLIC_BASE_URL}/en/privacy-policy`,
          ja: `${process.env.NEXT_PUBLIC_BASE_URL}/ja/privacy-policy`,
          "zh-Hans": `${process.env.NEXT_PUBLIC_BASE_URL}/zh-Hans/privacy-policy`,
          "zh-Hant": `${process.env.NEXT_PUBLIC_BASE_URL}/zh-Hant/privacy-policy`,
        },
      },
    },
  ];
}
