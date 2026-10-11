export const BLOG_URL = "https://www.crxfile.xyz/blog";

type BlogPost = {
  path: `/blog/${string}`;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  modifiedAt: string;
  readingMinutes: number;
};

export const chromeDownloadPost = {
  path: "/blog/download-chrome-extension-crx",
  title: "How to Download a CRX File from the Chrome Web Store",
  description:
    "Learn how to download a CRX file or ZIP source package from a public Chrome Web Store or Edge Add-ons listing with CRXFile.",
  category: "Chrome Web Store",
  publishedAt: "2026-07-25T00:00:00.000Z",
  modifiedAt: "2026-10-11T00:00:00.000Z",
  readingMinutes: 7
} satisfies BlogPost;

export const chromeExtensionIdPost = {
  path: "/blog/find-chrome-extension-id",
  title: "How to Find a Chrome Extension ID",
  description:
    "Find a Chrome extension ID in its Web Store URL or in chrome://extensions. See a real 32-character example, check common mistakes, and learn what an ID identifies.",
  category: "Extension IDs",
  publishedAt: "2026-10-07T00:00:00.000Z",
  modifiedAt: "2026-10-11T00:00:00.000Z",
  readingMinutes: 5
} satisfies BlogPost;

export const edgeDownloadPost = {
  path: "/blog/download-edge-extension-crx",
  title: "How to Get a CRX from Microsoft Edge Add-ons",
  description:
    "Download an Edge extension CRX or ZIP from Microsoft Edge Add-ons. Follow a tested store URL example, check the package version, and fix common download errors.",
  category: "Microsoft Edge Add-ons",
  publishedAt: "2026-10-11T00:00:00.000Z",
  modifiedAt: "2026-10-11T00:00:00.000Z",
  readingMinutes: 5
} satisfies BlogPost;

export const blogPosts: readonly BlogPost[] = [
  chromeDownloadPost,
  chromeExtensionIdPost,
  edgeDownloadPost
].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export function blogPostUrl(post: BlogPost) {
  return `https://www.crxfile.xyz${post.path}`;
}

export function blogPostDate(publishedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  }).format(new Date(publishedAt));
}
