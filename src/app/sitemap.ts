import { MetadataRoute } from "next";

// TITLE_MAP bilan sinxron — docs/[slug]/page.tsx dagi ro'yxat
const DOC_SLUGS = [
  "01-kirish",
  "02-ornatish",
  "03-birinchi-qadamlar",
  "04-toollar",
  "05-platforma",
  "06-faq",
  "07-troubleshooting",
];

const BASE_URL = "https://os.hacknow.uz";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const docEntries: MetadataRoute.Sitemap = DOC_SLUGS.map((slug) => ({
    url: `${BASE_URL}/docs/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/docs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...docEntries,
  ];
}
