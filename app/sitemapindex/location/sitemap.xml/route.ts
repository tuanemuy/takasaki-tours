export const revalidate = 3600;
export const dynamicParams = true;

import { sitemapPerPage } from "@/lib/config";
import { countLocations } from "@/actions/public/location";

export async function GET() {
  const { count } = await countLocations();
  const pages = Math.ceil(count / sitemapPerPage);
  const sitemaps = [...Array(pages)].map((_, i) => {
    return `<sitemap><loc>${process.env.NEXT_PUBLIC_BASE_URL}/sitemap/location/sitemap/${i}.xml</loc></sitemap>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemaps.join("")}
    </sitemapindex>
  `;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
