import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: "https://www.crxfile.xyz",
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: "https://www.crxfile.xyz",
          "zh-CN": "https://www.crxfile.xyz/zh",
          "x-default": "https://www.crxfile.xyz"
        }
      }
    },
    {
      url: "https://www.crxfile.xyz/zh",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: "https://www.crxfile.xyz",
          "zh-CN": "https://www.crxfile.xyz/zh",
          "x-default": "https://www.crxfile.xyz"
        }
      }
    }
  ];
}
