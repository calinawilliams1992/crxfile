export const stores = ["chrome", "edge"] as const;

export type Store = (typeof stores)[number];

export type ParseInputResult =
  | {
      ok: true;
      id: string;
      store: Store;
      source: "url" | "id";
      normalizedInput: string;
    }
  | {
      ok: false;
      reason: "empty" | "unsupported-store" | "invalid";
    };

const chromeHosts = new Set(["chromewebstore.google.com", "chrome.google.com"]);
const edgeHosts = new Set(["microsoftedge.microsoft.com"]);
const anyExtensionIdPattern = /^[a-z]{32}$/;

export function asStore(value: unknown): Store | null {
  return stores.includes(value as Store) ? (value as Store) : null;
}

export function isValidExtensionId(id: string, store: Store): boolean {
  const cleanId = id.trim().toLowerCase();
  return anyExtensionIdPattern.test(cleanId);
}

export function parseExtensionInput(input: string, selectedStore: Store = "chrome"): ParseInputResult {
  const cleanInput = input.trim();

  if (!cleanInput) {
    return { ok: false, reason: "empty" };
  }

  const explicitUrl = toUrl(cleanInput);
  if (explicitUrl) {
    const store = inferStoreFromHost(explicitUrl.hostname);
    if (!store) {
      return { ok: false, reason: "unsupported-store" };
    }

    const id = findExtensionIdInPath(explicitUrl.pathname, store);
    if (!id) {
      return { ok: false, reason: "invalid" };
    }

    return {
      ok: true,
      id,
      store,
      source: "url",
      normalizedInput: explicitUrl.toString()
    };
  }

  const id = cleanInput.toLowerCase();
  if (!isValidExtensionId(id, selectedStore)) {
    return { ok: false, reason: "invalid" };
  }

  return {
    ok: true,
    id,
    store: selectedStore,
    source: "id",
    normalizedInput: id
  };
}

export function storeName(store: Store): string {
  return store === "chrome" ? "Chrome Web Store" : "Microsoft Edge Add-ons";
}

export function storeSourceUrl(store: Store, id: string): string {
  if (store === "chrome") {
    return `https://chromewebstore.google.com/detail/${id}`;
  }
  return `https://microsoftedge.microsoft.com/addons/detail/${id}`;
}

function toUrl(input: string): URL | null {
  const withScheme = /^https?:\/\//i.test(input);
  const knownHostWithoutScheme = /^(chromewebstore\.google\.com|chrome\.google\.com|microsoftedge\.microsoft\.com)\//i.test(
    input
  );

  if (!withScheme && !knownHostWithoutScheme) {
    return null;
  }

  try {
    return new URL(withScheme ? input : `https://${input}`);
  } catch {
    return null;
  }
}

function inferStoreFromHost(hostname: string): Store | null {
  const host = hostname.toLowerCase();
  if (chromeHosts.has(host)) {
    return "chrome";
  }
  if (edgeHosts.has(host)) {
    return "edge";
  }
  return null;
}

function findExtensionIdInPath(pathname: string, store: Store): string | null {
  const segments = pathname
    .split("/")
    .map((segment) => decodeURIComponent(segment).trim().toLowerCase())
    .filter(Boolean);

  for (let index = segments.length - 1; index >= 0; index -= 1) {
    const candidate = segments[index];
    if (isValidExtensionId(candidate, store)) {
      return candidate;
    }
  }

  return null;
}
