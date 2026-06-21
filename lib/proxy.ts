import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";

const globalProxyState = globalThis as typeof globalThis & {
  __crxfileProxyConfigured?: boolean;
};

export function configureProxyFromEnv(): void {
  if (globalProxyState.__crxfileProxyConfigured) {
    return;
  }

  globalProxyState.__crxfileProxyConfigured = true;

  const hasProxy =
    process.env.HTTP_PROXY ||
    process.env.HTTPS_PROXY ||
    process.env.ALL_PROXY ||
    process.env.http_proxy ||
    process.env.https_proxy ||
    process.env.all_proxy;

  if (!hasProxy) {
    return;
  }

  setGlobalDispatcher(new EnvHttpProxyAgent());
}
