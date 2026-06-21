import { storeSourceUrl, type Store } from "./input";
import { configureProxyFromEnv } from "./proxy";
import { EnvHttpProxyAgent, fetch as undiciFetch, type Dispatcher, type RequestInit as UndiciRequestInit } from "undici";

export type ExtensionMeta = {
  id: string;
  store: Store;
  name: string;
  iconUrl: string | null;
  version: string | null;
  developer: string | null;
  summary: string | null;
  rating: string | null;
  users: string | null;
  sourceUrl: string;
  metadataSource: "store-page" | "update-service" | "id-fallback";
};

type UpdateInfo = {
  version: string | null;
  codebase: string | null;
  status: string | null;
};

type StorePageInfo = {
  name: string | null;
  iconUrl: string | null;
  developer: string | null;
  summary: string | null;
  rating: string | null;
  users: string | null;
};

export class CrxDownloadError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly upstreamUrl: string,
    readonly detail?: string
  ) {
    super(message);
    this.name = "CrxDownloadError";
  }
}

const browserProdVersion = process.env.CRXFILE_BROWSER_PROD_VERSION ?? "150.0.7871.24";
const browserMajorVersion = browserProdVersion.split(".")[0] || "150";
const userAgent =
  `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserMajorVersion}.0.0.0 Safari/537.36`;

configureProxyFromEnv();

const cacheTtlMs = 60 * 60 * 1000;
const fallbackCacheTtlMs = 5 * 60 * 1000;
const metadataFetchTimeoutMs = 3000;

const globalCache = globalThis as typeof globalThis & {
  __crxfileMetaCache?: Map<string, { expiresAt: number; value: ExtensionMeta }>;
  __crxfileProxyDispatcher?: Dispatcher;
};

const metaCache = globalCache.__crxfileMetaCache ?? new Map<string, { expiresAt: number; value: ExtensionMeta }>();
globalCache.__crxfileMetaCache = metaCache;

export async function resolveExtensionMeta(id: string, store: Store): Promise<ExtensionMeta> {
  const key = `${store}:${id}`;
  const cached = metaCache.get(key);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const [updateInfo, pageInfo] = await Promise.all([
    fetchUpdateInfo(id, store).catch(() => ({ version: null, codebase: null, status: null })),
    fetchStorePageInfo(id, store).catch(() => ({
      name: null,
      iconUrl: null,
      developer: null,
      summary: null,
      rating: null,
      users: null
    }))
  ]);

  const value: ExtensionMeta = {
    id,
    store,
    name: pageInfo.name ?? `${store === "chrome" ? "Chrome" : "Edge"} extension ${id}`,
    iconUrl: pageInfo.iconUrl,
    version: updateInfo.version,
    developer: pageInfo.developer,
    summary: pageInfo.summary,
    rating: pageInfo.rating,
    users: pageInfo.users,
    sourceUrl: storeSourceUrl(store, id),
    metadataSource: pageInfo.name ? "store-page" : updateInfo.version ? "update-service" : "id-fallback"
  };

  metaCache.set(key, {
    expiresAt: now + (value.metadataSource === "id-fallback" ? fallbackCacheTtlMs : cacheTtlMs),
    value
  });
  return value;
}

export function getCrxDownloadUrl(id: string, store: Store): string {
  return getStoreServiceUrl(id, store, "redirect");
}

function getCrxUpdateCheckUrl(id: string, store: Store): string {
  return getStoreServiceUrl(id, store, "updatecheck");
}

function getStoreServiceUrl(id: string, store: Store, response: "redirect" | "updatecheck"): string {
  const endpoint =
    store === "chrome"
      ? "https://clients2.google.com/service/update2/crx"
      : "https://edge.microsoft.com/extensionwebstorebase/v1/crx";

  const params = new URLSearchParams({
    response,
    prodversion: browserProdVersion,
    x: `id=${id}&installsource=ondemand&uc`
  });

  if (store === "chrome") {
    params.set("os", "mac");
    params.set("arch", "x86-64");
    params.set("nacl_arch", "x86-64");
    params.set("prod", "chromecrx");
    params.set("prodchannel", "stable");
    params.set("acceptformat", "crx2,crx3");
  } else {
    params.set("prod", "chromiumcrx");
    params.set("prodchannel", "");
  }

  return `${endpoint}?${params.toString()}`;
}

export async function fetchCrxPackage(id: string, store: Store): Promise<Response> {
  if (store === "chrome") {
    const updateInfo = await fetchUpdateInfo(id, store, downloadFetchTimeoutMs).catch(() => null);
    if (updateInfo?.codebase && isAllowedPackageUrl(updateInfo.codebase)) {
      return fetchPackageUrl(updateInfo.codebase);
    }
  }

  return fetchPackageUrl(getCrxDownloadUrl(id, store));
}

async function fetchPackageUrl(downloadUrl: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort(new Error("Timed out while connecting to the official download endpoint."));
  }, downloadFetchTimeoutMs);

  let response: Response;
  try {
    response = await officialFetch(downloadUrl, {
      redirect: "follow",
      headers: {
        "user-agent": userAgent,
        accept: "application/x-chrome-extension,application/octet-stream,*/*"
      },
      signal: controller.signal
    });
  } catch (error) {
    throw new CrxDownloadError(
      "The extension package could not be downloaded from the official store right now.",
      0,
      downloadUrl,
      describeFetchError(error)
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok || !response.body) {
    throw new CrxDownloadError(downloadFailureMessage(response.status), response.status, downloadUrl);
  }

  return response;
}

function downloadFailureMessage(status: number): string {
  if (status === 204) {
    return "The official update endpoint returned 204 No Content for this extension.";
  }
  if (status === 403 || status === 404) {
    return "The official store did not expose a downloadable CRX package for this extension.";
  }
  return `The official store download endpoint returned HTTP ${status}.`;
}

export function contentDisposition(name: string, extension: "crx" | "zip"): string {
  const filename = `${sanitizeFilename(name)}.${extension}`;
  const encoded = encodeURIComponent(filename);
  return `attachment; filename="${filename}"; filename*=UTF-8''${encoded}`;
}

const downloadFetchTimeoutMs = 30_000;

async function fetchUpdateInfo(id: string, store: Store, timeoutMs = metadataFetchTimeoutMs): Promise<UpdateInfo> {
  const url = getCrxUpdateCheckUrl(id, store);
  const response = await officialFetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": userAgent,
      accept: "application/xml,text/xml,*/*"
    },
    signal: AbortSignal.timeout(timeoutMs)
  });

  if (!response.ok) {
    throw new Error(`Update service failed with status ${response.status}.`);
  }

  const xml = await response.text();
  const updateCheck = xml.match(/<updatecheck\b[^>]*>/i)?.[0] ?? "";
  return {
    version: getXmlAttribute(updateCheck, "version"),
    codebase: getXmlAttribute(updateCheck, "codebase"),
    status: getXmlAttribute(updateCheck, "status")
  };
}

function isAllowedPackageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "clients2.googleusercontent.com";
  } catch {
    return false;
  }
}

async function fetchStorePageInfo(id: string, store: Store): Promise<StorePageInfo> {
  if (store === "edge") {
    return fetchEdgeStoreApiInfo(id).catch(() => fetchStoreHtmlPageInfo(id, store));
  }

  return fetchStoreHtmlPageInfo(id, store);
}

async function fetchEdgeStoreApiInfo(id: string): Promise<StorePageInfo> {
  const response = await officialFetch(`https://microsoftedge.microsoft.com/addons/getproductdetailsbycrxid/${id}?hl=en-US`, {
    redirect: "follow",
    headers: {
      "user-agent": userAgent,
      accept: "application/json,text/plain,*/*"
    },
    signal: AbortSignal.timeout(metadataFetchTimeoutMs)
  });

  if (!response.ok) {
    throw new Error(`Edge details API failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as Record<string, unknown>;

  return {
    name: toStringOrNull(payload.name),
    iconUrl: absolutizeUrl(toStringOrNull(payload.logoUrl ?? payload.thumbnailUrl)),
    developer: toStringOrNull(payload.developer),
    summary: cleanText(payload.shortDescription ?? payload.description),
    rating: toStringOrNull(payload.averageRating),
    users: toStringOrNull(payload.activeInstallCount)
  };
}

async function fetchStoreHtmlPageInfo(id: string, store: Store): Promise<StorePageInfo> {
  const response = await officialFetch(`${storeSourceUrl(store, id)}?hl=en`, {
    redirect: "follow",
    headers: {
      "user-agent": userAgent,
      accept: "text/html,application/xhtml+xml"
    },
    signal: AbortSignal.timeout(metadataFetchTimeoutMs)
  });

  if (!response.ok) {
    throw new Error(`Store page failed with status ${response.status}.`);
  }

  const html = await response.text();
  const jsonLd = extractJsonLd(html);
  const rawTitle = getMeta(html, "og:title") ?? getTitle(html) ?? jsonLd.name;

  return {
    name: normalizeTitle(rawTitle, store),
    iconUrl: absolutizeUrl(getMeta(html, "og:image") ?? toStringOrNull(jsonLd.image)),
    developer: extractDeveloper(html, jsonLd),
    summary: cleanText(getMeta(html, "description") ?? jsonLd.description),
    rating: toStringOrNull(jsonLd.aggregateRating?.ratingValue),
    users: toStringOrNull(jsonLd.aggregateRating?.ratingCount)
  };
}

function extractDeveloper(html: string, jsonLd: Record<string, any>): string | null {
  return (
    toStringOrNull(jsonLd.author?.name ?? jsonLd.author ?? getMeta(html, "author")) ??
    extractChromeDetailValue(html, "Offered by") ??
    extractChromeDetailValue(html, "Developer")
  );
}

function extractChromeDetailValue(html: string, label: string): string | null {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const labelPattern = `<div\\b[^>]*class=["'][^"']*\\bQDHp8e\\b[^"']*["'][^>]*>\\s*${escapedLabel}\\s*<\\/div>`;
  const itemPattern = new RegExp(`<li\\b[^>]*>[\\s\\S]*?${labelPattern}([\\s\\S]*?)<\\/li>`, "i");
  const item = html.match(itemPattern);

  if (!item) {
    return null;
  }

  const developerAddress = item[0].match(/<div\b[^>]*class=["'][^"']*\bmdSapd\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  return firstTextLine(developerAddress?.[1] ?? item[1]);
}

function firstTextLine(html: string): string | null {
  const text = htmlToText(html);
  if (!text) {
    return null;
  }

  for (const line of text.split(/\n+/)) {
    const clean = cleanText(line);
    if (clean) {
      return clean;
    }
  }

  return null;
}

function htmlToText(html: string): string | null {
  const text = decodeHtml(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:div|p|li|section|article|h[1-6]|details|summary)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r/g, "")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n[^\S\n]+/g, "\n")
    .replace(/[^\S\n]+\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();

  return text || null;
}

function extractJsonLd(html: string): Record<string, any> {
  const scripts = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);

  for (const script of scripts) {
    try {
      const parsed = JSON.parse(decodeHtml(script[1].trim()));
      const candidates = Array.isArray(parsed) ? parsed : [parsed];
      const app = candidates.find((item) => {
        const type = item?.["@type"];
        return type === "SoftwareApplication" || type === "Product" || item?.name;
      });
      if (app) {
        return app;
      }
    } catch {
      continue;
    }
  }

  return {};
}

function getMeta(html: string, key: string): string | null {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escaped}["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${escaped}["'][^>]*>`, "i")
  ];

  for (const pattern of patterns) {
    const value = html.match(pattern)?.[1];
    if (value) {
      return cleanText(value);
    }
  }

  return null;
}

function getTitle(html: string): string | null {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? null;
  return cleanText(title);
}

function getXmlAttribute(tag: string, attribute: string): string | null {
  const value = tag.match(new RegExp(`${attribute}=["']([^"']+)["']`, "i"))?.[1] ?? null;
  return value ? decodeHtml(value) : null;
}

function normalizeTitle(title: string | null, store: Store): string | null {
  if (!title) {
    return null;
  }

  const suffixes =
    store === "chrome"
      ? [" - Chrome Web Store", " - Chrome Web Store - Google Chrome"]
      : [" - Microsoft Edge Addons", " - Microsoft Edge Add-ons"];

  let clean = cleanText(title) ?? "";
  for (const suffix of suffixes) {
    if (clean.endsWith(suffix)) {
      clean = clean.slice(0, -suffix.length);
    }
  }
  return clean || null;
}

function cleanText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const clean = decodeHtml(value).replace(/\s+/g, " ").trim();
  return clean || null;
}

function toStringOrNull(value: unknown): string | null {
  if (typeof value === "string") {
    return cleanText(value);
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value) && value.length > 0) {
    return toStringOrNull(value[0]);
  }
  return null;
}

function absolutizeUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }
  if (value.startsWith("//")) {
    return `https:${value}`;
  }
  return value;
}

async function officialFetch(url: string, init: UndiciRequestInit): Promise<Response> {
  const dispatcher = getProxyDispatcher();
  const response = await undiciFetch(url, {
    ...init,
    dispatcher
  });

  return response as unknown as Response;
}

function getProxyDispatcher(): Dispatcher | undefined {
  if (!hasProxyConfig()) {
    return undefined;
  }

  globalCache.__crxfileProxyDispatcher ??= new EnvHttpProxyAgent();
  return globalCache.__crxfileProxyDispatcher;
}

function hasProxyConfig(): boolean {
  return Boolean(
    process.env.HTTP_PROXY ||
      process.env.HTTPS_PROXY ||
      process.env.ALL_PROXY ||
      process.env.http_proxy ||
      process.env.https_proxy ||
      process.env.all_proxy
  );
}

function describeFetchError(error: unknown): string {
  if (error instanceof Error) {
    const cause = error.cause instanceof Error ? ` Cause: ${error.cause.message}` : "";
    return `${error.message}${cause}`;
  }
  return "Unknown network error.";
}

function sanitizeFilename(name: string): string {
  const fallback = "extension";
  const clean =
    name
      .normalize("NFKD")
      .replace(/[^\w.\- ]+/g, "")
      .trim()
      .replace(/\s+/g, "_")
      .slice(0, 90) || fallback;
  return clean;
}

function decodeHtml(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([a-f0-9]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
