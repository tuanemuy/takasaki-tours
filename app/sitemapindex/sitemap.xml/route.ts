import { baseUrl } from "@/lib/config";

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap><loc>${baseUrl}/sitemap/sitemap.xml</loc></sitemap>
      <sitemap><loc>${baseUrl}/sitemapindex/tour/sitemap.xml</loc></sitemap>
      <sitemap><loc>${baseUrl}/sitemapindex/location/sitemap.xml</loc></sitemap>
    </sitemapindex>
  `;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
