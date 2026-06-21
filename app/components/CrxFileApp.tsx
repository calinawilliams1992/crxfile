"use client";

import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  ChevronDown,
  ClipboardPaste,
  Code2,
  Download,
  ExternalLink,
  FileArchive,
  Globe2,
  LoaderCircle,
  LockKeyhole,
  PackageCheck,
  Search,
  ShieldCheck
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { parseExtensionInput, storeName, type Store } from "@/lib/input";

type Lang = "en" | "zh";

type Plugin = {
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

type Copy = typeof english;

const english = {
  nav: {
    tool: "Tool",
    guide: "Guide",
    faq: "FAQ"
  },
  hero: {
    eyebrow: "CRX file utility",
    title: "Download CRX and ZIP",
    subtitle:
      "Paste a public Chrome or Edge extension link. CRXFile returns the official package and source ZIP.",
    badges: ["Chrome Web Store", "Edge Add-ons", "No login"],
    trust: [
      { icon: ShieldCheck, label: "Official store packages" },
      { icon: LockKeyhole, label: "No account required" },
      { icon: Archive, label: "No persistent file storage" }
    ]
  },
  form: {
    label: "Extension URL or ID",
    placeholder:
      "https://chromewebstore.google.com/detail/example/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    storeLabel: "Store for direct IDs",
    parse: "Parse extension",
    parsing: "Parsing",
    hint: "Use a public Chrome Web Store or Edge Add-ons URL, or paste a 32-character extension ID.",
    autoDetected: "Auto-detected",
    chrome: "Chrome Web Store",
    edge: "Microsoft Edge Add-ons"
  },
  errors: {
    empty: "Paste an extension link or ID first.",
    invalid: "Please enter a valid extension link or extension ID.",
    unsupportedStore: "Only Chrome Web Store and Microsoft Edge Add-ons links are supported right now.",
    notFound: "Extension not found. Please check whether the link or ID is correct.",
    busy: "Service is busy. Please try again shortly.",
    rate: (seconds: number) => `Too many requests. Please try again in ${seconds} seconds.`
  },
  result: {
    ready: "Ready to download",
    version: "Version",
    developer: "Developer",
    rating: "Rating",
    users: "Users",
    source: "Store page",
    downloadCrx: "Download .crx",
    downloadZip: "Download source .zip",
    note: "Downloads are fetched from official public store endpoints for learning, backup, and security review.",
    partial:
      "Store metadata is limited for this extension. You can still try the official package download."
  },
  guide: {
    title: "From store link to source",
    subtitle: "A compact workflow for saving a CRX file or inspecting browser extension source code.",
    chromeTab: "Chrome",
    edgeTab: "Edge",
    installTitle: "Install a CRX manually",
    installBody:
      "Open chrome://extensions or edge://extensions, enable Developer mode, then drag the downloaded .crx file into the extensions page.",
    zipTitle: "Inspect ZIP source",
    zipBody:
      "Unzip the source archive and open the folder in a code editor. Start with manifest.json, then review scripts, permissions, and assets.",
    steps: {
      chrome: [
        "Open the Chrome Web Store extension detail page.",
        "Copy the address bar URL.",
        "Paste it into CRXFile and parse the extension.",
        "Choose .crx for manual install or .zip for source review."
      ],
      edge: [
        "Open the Microsoft Edge Add-ons detail page.",
        "Copy the address bar URL.",
        "Paste it into CRXFile and parse the add-on.",
        "Choose .crx for manual install or .zip for source review."
      ]
    }
  },
  faq: {
    title: "CRX file questions",
    subtitle: "Straight answers for downloader, extractor, and source review workflows.",
    items: [
      {
        q: "What is a .crx file?",
        a: "A .crx file is the official package format for Chromium-based browser extensions. It is a signed container with a ZIP payload inside."
      },
      {
        q: "What is the difference between .crx and .zip?",
        a: ".crx keeps the browser signature header and is used for manual extension installation. .zip removes that header so the extension source files can be opened directly."
      },
      {
        q: "Why can I not double-click a downloaded CRX to install it?",
        a: "Chrome and Edge restrict external extension installs. Open the extensions page, enable Developer mode, and drag the CRX file into that page."
      },
      {
        q: "Do I need to log in or pay?",
        a: "No. CRXFile is free to use and does not require registration, login, or payment."
      },
      {
        q: "Does CRXFile save my downloads or personal information?",
        a: "No account is required, and the service does not persistently store downloaded extension files. Requests are proxied only to complete the current download."
      },
      {
        q: "Which stores are supported?",
        a: "CRXFile currently supports public packages from Chrome Web Store and Microsoft Edge Add-ons."
      },
      {
        q: "Can I download paid extensions?",
        a: "No. CRXFile cannot bypass paid access, private listings, enterprise restrictions, or authorization controls."
      },
      {
        q: "What should I do if a download fails?",
        a: "The extension may be unpublished, region-restricted, enterprise-restricted, or temporarily unavailable from the official store endpoint. Check the ID and retry later."
      },
      {
        q: "Is downloading extension source legal?",
        a: "Use downloads only for learning, personal backup, and security audit. Do not infringe copyright, resell packages, or redistribute paid content."
      },
      {
        q: "Can CRXFile download removed extensions?",
        a: "Usually no. Downloads depend on the store's current public update endpoint, so removed packages may no longer be available."
      }
    ]
  },
  footer: {
    disclaimer:
      "CRXFile is not a Google or Microsoft product and is not affiliated with either company. All trademarks belong to their owners.",
    legal:
      "Use this tool only for learning, security audit, personal backup, and legitimate administration. You are responsible for how downloaded files are used."
  }
};

const chinese: Copy = {
  nav: {
    tool: "工具",
    guide: "教程",
    faq: "FAQ"
  },
  hero: {
    eyebrow: "CRX file 工具",
    title: "下载 CRX 和 ZIP",
    subtitle:
      "粘贴公开的 Chrome 或 Edge 插件链接，获取官方安装包和源码 ZIP。",
    badges: ["Chrome Web Store", "Edge Add-ons", "无需登录"],
    trust: [
      { icon: ShieldCheck, label: "来自官方商店公开接口" },
      { icon: LockKeyhole, label: "无需账号" },
      { icon: Archive, label: "不持久化存储文件" }
    ]
  },
  form: {
    label: "插件链接或 ID",
    placeholder:
      "https://chromewebstore.google.com/detail/example/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    storeLabel: "直接输入 ID 时的商店",
    parse: "解析插件",
    parsing: "解析中",
    hint: "支持公开的 Chrome Web Store / Edge Add-ons 链接，也可直接粘贴 32 位插件 ID。",
    autoDetected: "已自动识别",
    chrome: "Chrome Web Store",
    edge: "Microsoft Edge Add-ons"
  },
  errors: {
    empty: "请先粘贴插件链接或 ID。",
    invalid: "请输入有效的插件链接或插件 ID。",
    unsupportedStore: "目前仅支持 Chrome Web Store 和 Microsoft Edge Add-ons 链接。",
    notFound: "未找到该插件，请检查链接或 ID 是否正确。",
    busy: "服务繁忙，请稍后重试。",
    rate: (seconds: number) => `请求过于频繁，请 ${seconds} 秒后再试。`
  },
  result: {
    ready: "可以下载",
    version: "版本",
    developer: "开发者",
    rating: "评分",
    users: "用户数",
    source: "商店页面",
    downloadCrx: "下载 .crx",
    downloadZip: "下载源码 .zip",
    note: "下载内容来自官方应用商店公开接口，仅供学习、备份和安全审计使用。",
    partial: "该插件的商店元信息有限，但仍可尝试从官方端点下载文件。"
  },
  guide: {
    title: "从商店链接到源码",
    subtitle: "保存 CRX 文件或查看浏览器插件源码的紧凑流程。",
    chromeTab: "Chrome",
    edgeTab: "Edge",
    installTitle: "手动安装 CRX",
    installBody:
      "打开 chrome://extensions 或 edge://extensions，开启开发者模式，然后把下载的 .crx 文件拖入扩展管理页。",
    zipTitle: "查看 ZIP 源码",
    zipBody:
      "解压源码包后用代码编辑器打开文件夹。建议先看 manifest.json，再审查脚本、权限和资源文件。",
    steps: {
      chrome: [
        "打开 Chrome Web Store 插件详情页。",
        "复制浏览器地址栏链接。",
        "粘贴到 CRXFile 并解析插件。",
        "选择 .crx 手动安装，或选择 .zip 查看源码。"
      ],
      edge: [
        "打开 Microsoft Edge Add-ons 插件详情页。",
        "复制浏览器地址栏链接。",
        "粘贴到 CRXFile 并解析插件。",
        "选择 .crx 手动安装，或选择 .zip 查看源码。"
      ]
    }
  },
  faq: {
    title: "CRX file 问题",
    subtitle: "关于下载、提取和源码审查的核心问题。",
    items: [
      {
        q: "什么是 .crx 文件？",
        a: ".crx 是 Chromium 系浏览器插件的官方打包格式，本质上是带签名头信息的 ZIP 容器。"
      },
      {
        q: ".crx 和 .zip 有什么区别？",
        a: ".crx 保留浏览器可识别的签名头，用于手动安装；.zip 去除该头部，方便直接解压查看插件源码。"
      },
      {
        q: "下载的 CRX 为什么不能双击安装？",
        a: "Chrome 和 Edge 会限制外部扩展安装。请打开扩展管理页，开启开发者模式，再把 CRX 文件拖入页面。"
      },
      {
        q: "使用本站需要登录或付费吗？",
        a: "不需要。CRXFile 免费使用，无需注册、登录或付费。"
      },
      {
        q: "CRXFile 会保存我的下载记录或个人信息吗？",
        a: "本站不需要账号，也不会持久化存储下载的插件文件。服务端仅在当前请求中代理官方商店下载。"
      },
      {
        q: "支持哪些应用商店？",
        a: "目前支持 Chrome Web Store 和 Microsoft Edge Add-ons 的公开插件包。"
      },
      {
        q: "可以下载收费插件吗？",
        a: "不支持。CRXFile 无法绕过付费授权、私有列表、企业限制或任何访问控制。"
      },
      {
        q: "下载失败怎么办？",
        a: "插件可能已经下架、存在地区限制、企业限制，或官方接口暂时不可用。请检查 ID 并稍后重试。"
      },
      {
        q: "下载插件源码是否合法？",
        a: "请仅用于学习研究、个人备份和安全审计，不要侵犯版权、倒卖文件或二次分发付费内容。"
      },
      {
        q: "已经下架的插件还能下载吗？",
        a: "通常不能。下载依赖商店当前公开更新接口，已下架插件可能不再可用。"
      }
    ]
  },
  footer: {
    disclaimer:
      "CRXFile 不是 Google 或 Microsoft 官方产品，也与两家公司无关联。所有商标归其各自所有者。",
    legal:
      "本工具仅供学习研究、安全审计、个人备份和合法管理使用。你需要自行承担下载文件的使用责任。"
  }
};

const copyByLang: Record<Lang, Copy> = {
  en: english,
  zh: chinese
};

const languageOptions: Array<{ value: Lang; label: string; shortLabel: string }> = [
  { value: "en", label: "English", shortLabel: "EN" },
  { value: "zh", label: "简体中文", shortLabel: "ZH" }
];

const guideIcons = [Globe2, ClipboardPaste, Search, Download];
const languageStorageKey = "crxfile-lang";

export function CrxFileApp() {
  const [lang, setLang] = useState<Lang>("en");
  const [store, setStore] = useState<Store>("chrome");
  const [input, setInput] = useState("");
  const [plugin, setPlugin] = useState<Plugin | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [guideStore, setGuideStore] = useState<Store>("chrome");
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  const t = copyByLang[lang];
  const currentLanguage =
    languageOptions.find((option) => option.value === lang) ?? languageOptions[0];
  const parsed = useMemo(() => parseExtensionInput(input, store), [input, store]);
  const autoDetected = parsed.ok && parsed.source === "url";
  const validationMessage = useMemo(() => {
    if (!input.trim() || parsed.ok) {
      return "";
    }
    if (parsed.reason === "unsupported-store") {
      return t.errors.unsupportedStore;
    }
    return t.errors.invalid;
  }, [input, parsed, t]);

  useEffect(() => {
    const queryLang = new URLSearchParams(window.location.search).get("lang");
    const saved = readSavedLanguage();
    const nextLang = toLang(queryLang) ?? saved;

    if (nextLang) {
      setLang(nextLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (!languageMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        languageMenuRef.current?.contains(event.target)
      ) {
        return;
      }

      setLanguageMenuOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLanguageMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [languageMenuOpen]);

  function changeLanguage(nextLang: Lang) {
    setLang(nextLang);
    setLanguageMenuOpen(false);
    saveLanguage(nextLang);
    syncLanguageUrl(nextLang);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!input.trim()) {
      setError(t.errors.empty);
      return;
    }

    if (!parsed.ok) {
      setError(parsed.reason === "unsupported-store" ? t.errors.unsupportedStore : t.errors.invalid);
      return;
    }

    setLoading(true);
    setPlugin(null);

    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input,
          store
        })
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 429 && data?.retryAfter) {
          setError(t.errors.rate(Number(data.retryAfter)));
        } else if (response.status === 404) {
          setError(t.errors.notFound);
        } else {
          setError(data?.message || t.errors.busy);
        }
        return;
      }

      setPlugin(data.plugin);
    } catch {
      setError(t.errors.busy);
    } finally {
      setLoading(false);
    }
  }

  const selectedGuideSteps = t.guide.steps[guideStore];
  const effectiveStore = parsed.ok ? parsed.store : store;

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#tool" aria-label="CRXFile home">
          <span className="brand-mark">
            <PackageCheck size={22} aria-hidden="true" />
          </span>
          <span>CRXFile</span>
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#tool">{t.nav.tool}</a>
          <a href="#guide">{t.nav.guide}</a>
          <a href="#faq">{t.nav.faq}</a>
        </nav>

        <div className="language-switch" ref={languageMenuRef}>
          <button
            className="language-trigger"
            type="button"
            aria-label={`Change language, current ${currentLanguage.label}`}
            aria-haspopup="menu"
            aria-expanded={languageMenuOpen}
            aria-controls="language-menu"
            onClick={() => setLanguageMenuOpen((open) => !open)}
          >
            <Globe2 size={20} aria-hidden="true" />
          </button>

          {languageMenuOpen ? (
            <div
              className="language-menu"
              id="language-menu"
              role="menu"
              aria-label="Select language"
            >
              {languageOptions.map((option) => (
                <button
                  className="language-option"
                  type="button"
                  role="menuitemradio"
                  aria-checked={lang === option.value}
                  key={option.value}
                  onClick={() => changeLanguage(option.value)}
                >
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.shortLabel}</small>
                  </span>
                  {lang === option.value ? (
                    <CheckCircle2 size={17} aria-hidden="true" />
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <main>
        <section className="tool-section" id="tool">
          <div className="section-inner tool-layout">
            <div className="intro-copy">
              <p className="eyebrow">
                {t.hero.eyebrow}
              </p>
              <h1>{t.hero.title}</h1>
              <p className="hero-subtitle">{t.hero.subtitle}</p>
              <div className="keyword-row" aria-label="Supported search intents">
                {t.hero.badges.map((badge) => (
                  <span key={badge}>{badge}</span>
                ))}
              </div>
            </div>

            <div className="tool-workspace" aria-label="CRX downloader tool">
              <div className="tool-topline">
                <span>CRXFile</span>
                <span>Chrome + Edge</span>
              </div>
              <form className="parse-form" onSubmit={handleSubmit}>
                <label htmlFor="extension-input">{t.form.label}</label>
                <div className="input-row">
                  <input
                    id="extension-input"
                    value={input}
                    onChange={(event) => {
                      setInput(event.target.value);
                      setError("");
                    }}
                    placeholder={t.form.placeholder}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <button type="submit" disabled={loading || !input.trim()}>
                    {loading ? (
                      <LoaderCircle className="spin" size={18} aria-hidden="true" />
                    ) : (
                      <Search size={18} aria-hidden="true" />
                    )}
                    <span>{loading ? t.form.parsing : t.form.parse}</span>
                  </button>
                </div>

                <div className="store-row">
                  <label htmlFor="store-select">{t.form.storeLabel}</label>
                  <select
                    id="store-select"
                    value={effectiveStore}
                    disabled={autoDetected}
                    onChange={(event) => setStore(event.target.value as Store)}
                  >
                    <option value="chrome">{t.form.chrome}</option>
                    <option value="edge">{t.form.edge}</option>
                  </select>
                  {autoDetected ? <span className="detected">{t.form.autoDetected}</span> : null}
                </div>

                <p className={`form-hint ${validationMessage ? "is-error" : ""}`}>
                  {validationMessage || t.form.hint}
                </p>
              </form>

              <div aria-live="polite">
                {error ? (
                  <div className="message-box error-box">
                    <AlertTriangle size={18} aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                ) : null}

                {plugin ? <ResultPanel plugin={plugin} copy={t} /> : null}
                {!plugin && !error ? (
                  loading ? <LoadingOutput copy={t} /> : <EmptyOutput copy={t} />
                ) : null}
              </div>
            </div>
          </div>

          <div className="section-inner proof-rail" aria-label="Trust and privacy notes">
            {t.hero.trust.map((item) => (
              <TrustItem key={item.label} icon={item.icon} label={item.label} />
            ))}
          </div>
        </section>

        <section className="guide-section" id="guide">
          <div className="section-inner">
            <div className="section-heading">
              <h2>{t.guide.title}</h2>
              <p>{t.guide.subtitle}</p>
            </div>

            <div className="tabs" role="tablist" aria-label="Store guide">
              <button
                type="button"
                role="tab"
                aria-selected={guideStore === "chrome"}
                onClick={() => setGuideStore("chrome")}
              >
                {t.guide.chromeTab}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={guideStore === "edge"}
                onClick={() => setGuideStore("edge")}
              >
                {t.guide.edgeTab}
              </button>
            </div>

            <div className="steps-grid">
              {selectedGuideSteps.map((step, index) => {
                const Icon = guideIcons[index] ?? CheckCircle2;
                return (
                  <article className="step-card" key={step}>
                    <div className="step-visual">
                      <Icon size={28} aria-hidden="true" />
                      <span>{index + 1}</span>
                    </div>
                    <p>{step}</p>
                  </article>
                );
              })}
            </div>

            <div className="usage-notes">
              <article>
                <h3>
                  <PackageCheck size={20} aria-hidden="true" />
                  {t.guide.installTitle}
                </h3>
                <p>{t.guide.installBody}</p>
              </article>
              <article>
                <h3>
                  <Code2 size={20} aria-hidden="true" />
                  {t.guide.zipTitle}
                </h3>
                <p>{t.guide.zipBody}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="faq-section" id="faq">
          <div className="section-inner faq-layout">
            <div className="section-heading">
              <h2>{t.faq.title}</h2>
              <p>{t.faq.subtitle}</p>
            </div>

            <div className="faq-list">
              {t.faq.items.map((item) => (
                <details key={item.q}>
                  <summary>
                    <span>{item.q}</span>
                    <ChevronDown size={20} aria-hidden="true" />
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <strong>CRXFile</strong>
          <p>{t.footer.disclaimer}</p>
          <p>{t.footer.legal}</p>
        </div>
        <a href="#tool">{t.nav.tool}</a>
      </footer>
    </div>
  );
}

function toLang(value: string | null): Lang | null {
  return value === "zh" || value === "en" ? value : null;
}

function readSavedLanguage(): Lang | null {
  try {
    return toLang(window.localStorage.getItem(languageStorageKey));
  } catch {
    return null;
  }
}

function saveLanguage(nextLang: Lang): void {
  try {
    window.localStorage.setItem(languageStorageKey, nextLang);
  } catch {
    // Some embedded browsers disable storage. Language switching still works through React state.
  }
}

function syncLanguageUrl(nextLang: Lang): void {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", nextLang);
    window.history.replaceState(null, "", url);
  } catch {
    // URL sync is progressive enhancement only.
  }
}

function TrustItem({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="trust-item">
      <Icon size={18} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function EmptyOutput({ copy }: { copy: Copy }) {
  return (
    <div className="empty-output">
      <div className="empty-output-main">
        <PackageCheck size={22} aria-hidden="true" />
        <div>
          <strong>{copy.form.hint}</strong>
          <span>CRX + ZIP</span>
        </div>
      </div>
      <div className="empty-output-grid">
        <span>.crx</span>
        <span>.zip</span>
        <span>manifest.json</span>
      </div>
    </div>
  );
}

function LoadingOutput({ copy }: { copy: Copy }) {
  return (
    <div className="loading-output" aria-label={copy.form.parsing}>
      <div className="loading-header">
        <LoaderCircle className="spin" size={18} aria-hidden="true" />
        <strong>{copy.form.parsing}</strong>
      </div>
      <div className="skeleton-line wide" />
      <div className="skeleton-line" />
      <div className="skeleton-grid">
        <span />
        <span />
      </div>
    </div>
  );
}

function ResultPanel({ plugin, copy }: { plugin: Plugin; copy: Copy }) {
  const crxHref = `/api/download/crx?id=${encodeURIComponent(plugin.id)}&store=${plugin.store}`;
  const zipHref = `/api/download/zip?id=${encodeURIComponent(plugin.id)}&store=${plugin.store}`;

  return (
    <section className="result-panel" aria-label="Parsed extension result">
      <div className="result-header">
        <div className="icon-frame">
          {plugin.iconUrl ? (
            <img src={plugin.iconUrl} alt="" referrerPolicy="no-referrer" />
          ) : (
            <PackageCheck size={30} aria-hidden="true" />
          )}
        </div>
        <div>
          <p className="status-line">
            <CheckCircle2 size={16} aria-hidden="true" />
            {copy.result.ready}
          </p>
          <h2>{plugin.name}</h2>
          <div className={`store-badge ${plugin.store}`}>
            <span>{plugin.store === "chrome" ? "C" : "E"}</span>
            {storeName(plugin.store)}
          </div>
        </div>
      </div>

      {plugin.summary ? <p className="summary">{plugin.summary}</p> : null}
      {plugin.metadataSource === "id-fallback" ? (
        <p className="metadata-note">{copy.result.partial}</p>
      ) : null}

      <dl className="meta-grid">
        <div>
          <dt>{copy.result.version}</dt>
          <dd>{plugin.version || "Latest"}</dd>
        </div>
        <div>
          <dt>{copy.result.developer}</dt>
          <dd>{plugin.developer || "Unknown"}</dd>
        </div>
        {plugin.rating ? (
          <div>
            <dt>{copy.result.rating}</dt>
            <dd>{plugin.rating}</dd>
          </div>
        ) : null}
        {plugin.users ? (
          <div>
            <dt>{copy.result.users}</dt>
            <dd>{plugin.users}</dd>
          </div>
        ) : null}
      </dl>

      <div className="download-actions">
        <a className="primary-action" href={crxHref}>
          <Download size={18} aria-hidden="true" />
          {copy.result.downloadCrx}
        </a>
        <a className="secondary-action" href={zipHref}>
          <FileArchive size={18} aria-hidden="true" />
          {copy.result.downloadZip}
        </a>
      </div>

      <div className="result-footer">
        <p>{copy.result.note}</p>
        <a href={plugin.sourceUrl} target="_blank" rel="noreferrer">
          {copy.result.source}
          <ExternalLink size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
