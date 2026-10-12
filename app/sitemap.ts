import type { MetadataRoute } from "next";
import { blogPosts, blogPostUrl } from "@/lib/blog";

const SITE_URL = "https://www.crxfile.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL + "/",
      lastModified: new Date("2026-10-12T00:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: SITE_URL + "/",
          "zh-CN": SITE_URL + "/zh",
          "x-default": SITE_URL + "/"
        }
      }
    },
    {
      url: SITE_URL + "/zh",
      lastModified: new Date("2026-09-14T00:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: SITE_URL + "/",
          "zh-CN": SITE_URL + "/zh",
          "x-default": SITE_URL + "/"
        }
      }
    },
    {
      url: SITE_URL + "/blog",
      lastModified: new Date(blogPosts[0].modifiedAt),
      changeFrequency: "weekly",
      priority: 0.8
    },
    ...blogPosts.map((post) => ({
      url: blogPostUrl(post),
      lastModified: new Date(post.modifiedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7
    })),
    {
      url: SITE_URL + "/privacy-policy",
      lastModified: new Date("2026-09-14T00:00:00.000Z"),
      changeFrequency: "yearly",
      priority: 0.3
    },
    {
      url: SITE_URL + "/terms-of-service",
      lastModified: new Date("2026-09-14T00:00:00.000Z"),
      changeFrequency: "yearly",
      priority: 0.3
    }
  ];
}
