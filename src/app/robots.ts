import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/docs/*"],
      disallow: ["/api/*"],
    },
    sitemap: "https://os.hacknow.uz/sitemap.xml",
  };
}
