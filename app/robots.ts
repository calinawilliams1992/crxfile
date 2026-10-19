import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"]
    },
    sitemap: "http://www.crxfile.xyz/sitemap/sitemap.xml",
    host: "https://www.crxfile.xyz"
  };
}
