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
  modifiedAt: "2026-10-13T00:00:00.000Z",
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

export const chromeExtensionBackupPost = {
  path: "/blog/backup-chrome-extension-package",
  title: "A Practical Chrome Extension Package Backup Workflow",
  description:
    "Back up a Chrome extension package with a CRX file, verified version, store URL, and SHA-256 checksum. Includes a tested example and a free backup record template.",
  category: "Package backups",
  publishedAt: "2026-10-12T00:00:00.000Z",
  modifiedAt: "2026-10-12T00:00:00.000Z",
  readingMinutes: 5
} satisfies BlogPost;

export const extensionSourceReviewPost = {
  path: "/blog/view-chrome-extension-source-without-installing",
  title: "How to Inspect Extension Source Without Installing It",
  description:
    "View Chrome extension source without installing it. Download a ZIP, read manifest.json, trace scripts and network calls, and try a small source review example.",
  category: "Source inspection",
  publishedAt: "2026-10-13T00:00:00.000Z",
  modifiedAt: "2026-10-20T00:00:00.000Z",
  readingMinutes: 5
} satisfies BlogPost;

export const chromeExtensionManifestPost = {
  path: "/blog/read-chrome-extension-manifest",
  title: "How to Read a Chrome Extension Manifest",
  description:
    "Read a Chrome extension manifest.json with an annotated Manifest V3 example. Understand version fields, permissions, service workers, and content script matches.",
  category: "Manifest JSON",
  publishedAt: "2026-10-18T00:00:00.000Z",
  modifiedAt: "2026-10-23T00:00:00.000Z",
  readingMinutes: 5
} satisfies BlogPost;

export const chromeExtensionPermissionsPost = {
  path: "/blog/chrome-extension-permissions-explained",
  title: "Chrome Extension Permissions: What Each Field Tells You",
  description:
    "Chrome extension permissions explained with a review table and Manifest V3 example. Understand API permissions, host access, optional grants, and activeTab.",
  category: "Extension permissions",
  publishedAt: "2026-10-20T00:00:00.000Z",
  modifiedAt: "2026-10-22T00:00:00.000Z",
  readingMinutes: 5
} satisfies BlogPost;

export const hostPermissionsVsActiveTabPost = {
  path: "/blog/host-permissions-vs-activetab",
  title: "Host Permissions vs activeTab in Chrome Extensions",
  description:
    "Compare host_permissions and activeTab in Chrome extensions with two Manifest V3 examples. Learn access scope, grant lifetime, scripting, and common mistakes.",
  category: "Extension site access",
  publishedAt: "2026-10-22T00:00:00.000Z",
  modifiedAt: "2026-10-22T00:00:00.000Z",
  readingMinutes: 5
} satisfies BlogPost;

export const contentScriptInspectionPost = {
  path: "/blog/inspect-extension-content-scripts",
  title: "How to Trace an Extension’s Content Scripts",
  description:
    "Inspect Chrome extension content scripts: trace manifest matches to JavaScript files, follow DOM changes and messages, and try an original page-marking example.",
  category: "Content script inspection",
  publishedAt: "2026-10-23T00:00:00.000Z",
  modifiedAt: "2026-10-24T16:44:55.000Z",
  readingMinutes: 5
} satisfies BlogPost;

export const serviceWorkerPost = {
  path: "/blog/chrome-extension-service-worker",
  title: "Finding What an MV3 Service Worker Does",
  description:
    "Chrome extension service worker explained: trace an MV3 background file through events, messages, storage, and network calls with an annotated source example.",
  category: "MV3 service workers",
  publishedAt: "2026-10-24T16:44:55.000Z",
  modifiedAt: "2026-10-24T16:44:55.000Z",
  readingMinutes: 5
} satisfies BlogPost;

export const blogPosts: readonly BlogPost[] = [
  chromeDownloadPost,
  chromeExtensionIdPost,
  edgeDownloadPost,
  chromeExtensionBackupPost,
  extensionSourceReviewPost,
  chromeExtensionManifestPost,
  chromeExtensionPermissionsPost,
  hostPermissionsVsActiveTabPost,
  contentScriptInspectionPost,
  serviceWorkerPost
].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export function blogPostUrl(post: BlogPost) {
  return `https://www.crxfile.xyz${post.path}`;
}

export function blogPostDate(publishedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai"
  }).format(new Date(publishedAt));
}
