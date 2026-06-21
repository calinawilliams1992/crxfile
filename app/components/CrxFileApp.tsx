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
    tool: "CRX Downloader",
    guide: "Guide",
    faq: "FAQ"
  },
  hero: {
    eyebrow: "Chrome Web Store + Edge Add-ons",
    title: "Download CRX Files from Any Chrome Extension",
    subtitle:
      "Free CRX file extractor and CRX downloader. Paste any extension link to get CRX or ZIP source. No login.",
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
    downloadCrx: "Download CRX",
    downloadZip: "Download source .zip",
    note: "Downloads are fetched from official public store endpoints for learning, backup, and security review.",
    partial:
      "Store metadata is limited for this extension. You can still try the official package download."
  },
  learn: {
    title: "What Is a CRX File?",
    paragraphs: [
      "A CRX file is the package format Chromium browsers use to distribute extensions. It works like a signed ZIP archive with a browser-verifiable header.",
      "When you install from the Chrome Web Store, the browser downloads this package in the background. Store pages do not offer a direct download button, which is why a dedicated CRX file downloader like CRXFile exists.",
      "The CRX file format matters for developers auditing permissions, users making backups, and IT teams managing browsers. A CRX extractor can unpack the package into JavaScript, HTML, CSS, assets, and manifest.json."
    ]
  },
  guide: {
    title: "How to Download a CRX File",
    subtitle:
      "CRXFile works as a CRX downloader and CRX extractor in one workflow. Follow these steps to get CRX from a public extension listing.",
    chromeTab: "Chrome",
    edgeTab: "Edge",
    installTitle: "Install a CRX File Manually",
    installBody:
      "Open chrome://extensions or edge://extensions, enable Developer mode, then drag the downloaded CRX file into the extensions page.",
    zipTitle: "Use the CRX Extractor ZIP Source",
    zipBody:
      "Choose the ZIP format to skip the browser signature header and access manifest.json, background scripts, content scripts, and bundled assets directly.",
    steps: {
      chrome: [
        {
          title: "Find the Extension",
          body: "Open the Chrome Web Store page for the extension you want, then copy the full URL or 32-character extension ID."
        },
        {
          title: "Paste into CRXFile",
          body: "Paste the URL or ID into CRXFile. The tool queries the official update endpoint to locate the latest package."
        },
        {
          title: "Get CRX or Extract ZIP",
          body: "Choose Download CRX for manual installation, or download ZIP source when you want CRX extractor output for code review."
        }
      ],
      edge: [
        {
          title: "Find the Add-on",
          body: "Open the Microsoft Edge Add-ons page for the extension you want, then copy the full URL or extension ID."
        },
        {
          title: "Paste into CRXFile",
          body: "Paste the Edge URL or ID into CRXFile. The CRX downloader resolves the public package from the official endpoint."
        },
        {
          title: "Get CRX or Extract ZIP",
          body: "Download CRX for manual Edge installation, or use the ZIP option when you need CRX extractor source files."
        }
      ]
    }
  },
  extractor: {
    title: "Inspect Source with the CRX Extractor",
    paragraphs: [
      "When you select ZIP, CRXFile acts as a CRX extractor. The archive contains the CRX file source minus the store signature.",
      "Open the folder in a code editor and start with manifest.json, which declares permissions, content scripts, background workers, and other metadata."
    ],
    items: [
      "Permission declarations - check what the extension can access.",
      "Content scripts - review which pages the extension injects code into.",
      "Background scripts - understand long-running processes.",
      "Third-party libraries - audit bundled dependencies."
    ],
    outro:
      "This workflow is common in extension security auditing and useful for learning Chrome Extension APIs."
  },
  why: {
    title: "Why Use CRXFile?",
    intro:
      "CRXFile is a CRX downloader that handles store update endpoints for you across Chrome and Edge.",
    items: [
      {
        icon: Globe2,
        title: "Dual-store support",
        body: "One tool for Chrome Web Store and Microsoft Edge Add-ons."
      },
      {
        icon: PackageCheck,
        title: "No plugin needed",
        body: "Runs in your browser. Install nothing to download CRX files."
      },
      {
        icon: Download,
        title: "Always latest version",
        body: "Fetches the current public CRX file package directly from the source."
      },
      {
        icon: ShieldCheck,
        title: "Privacy-first",
        body: "No account, no persistent file storage, no download tracking."
      }
    ]
  },
  faq: {
    title: "CRX File FAQ",
    subtitle: "Common questions about downloading, extracting, and getting CRX files.",
    items: [
      {
        q: "What is a CRX file?",
        a: "A CRX file is the official package format for Chromium-based browser extensions: a signed container with a ZIP payload holding source files."
      },
      {
        q: "What is the difference between .crx and .zip?",
        a: "A .crx keeps the browser signature header for manual installation. A .zip removes that header so source files can be opened directly."
      },
      {
        q: "Why can I not double-click a downloaded CRX file to install it?",
        a: "Chrome and Edge restrict external installs. Open chrome://extensions or edge://extensions, enable Developer mode, and drag the downloaded file into the page."
      },
      {
        q: "Do I need to log in or pay to download CRX?",
        a: "No. CRXFile is a free CRX downloader with no registration, login, or payment required."
      },
      {
        q: "Does CRXFile save my downloads or personal data?",
        a: "No. The service does not persistently store CRX file downloads. Requests are proxied only to complete the current download."
      },
      {
        q: "Which stores does this CRX extractor support?",
        a: "CRXFile supports public packages from Chrome Web Store and Microsoft Edge Add-ons."
      },
      {
        q: "Can I download paid or private extensions with this CRX downloader?",
        a: "No. It cannot bypass paid access, private listings, enterprise restrictions, or authorization controls."
      },
      {
        q: "What if a download fails when I try to get CRX?",
        a: "The extension may be unpublished, region-restricted, enterprise-restricted, or temporarily unavailable. Verify the ID and try again later."
      },
      {
        q: "Is downloading CRX files legal?",
        a: "Yes, for learning, personal backup, and security auditing. Do not infringe copyright, resell packages, or redistribute paid content."
      },
      {
        q: "Can CRXFile download removed extensions?",
        a: "Usually no. Download availability depends on the store's current public update endpoint."
      },
      {
        q: "What is the CRX file format version?",
        a: "Modern packages use version 3, also called CRX3, with SHA-256 hashing and improved signing."
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
    tool: "CRX 下载器",
    guide: "指南",
    faq: "FAQ"
  },
  hero: {
    eyebrow: "Chrome Web Store + Edge Add-ons",
    title: "从任意 Chrome 扩展下载 CRX 文件",
    subtitle:
      "免费 CRX file extractor 与 CRX downloader。粘贴扩展链接即可 get CRX 或源码 ZIP，无需登录。",
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
    downloadCrx: "下载 CRX",
    downloadZip: "下载源码 .zip",
    note: "下载内容来自官方应用商店公开接口，仅供学习、备份和安全审计使用。",
    partial: "该插件的商店元信息有限，但仍可尝试从官方端点下载文件。"
  },
  learn: {
    title: "什么是 CRX File？",
    paragraphs: [
      "CRX file 是 Chromium 系浏览器用于分发和安装扩展的标准打包格式，Google Chrome、Microsoft Edge、Brave 和 Opera 都使用这一格式。每个 CRX file 本质上都是带有加密签名头的 ZIP 归档，浏览器会在安装前验证它。",
      "当你从 Chrome Web Store 安装扩展时，浏览器会在后台下载并处理 CRX file。但商店页面通常没有官方下载按钮，因此 CRXFile 这样的 CRX file downloader 可以帮助你直接获取公开扩展包。",
      "理解 CRX file 结构对开发者审查权限、用户备份可信扩展、IT 管理员管理浏览器配置都很有用。通过 CRX extractor，你可以把 CRX file 解包为 JavaScript、HTML、CSS 和关键的 manifest.json 等源码组件。"
    ]
  },
  guide: {
    title: "如何下载 CRX 文件",
    subtitle:
      "CRXFile 同时是 CRX downloader 和 CRX extractor，一套流程即可从公开扩展页面 get CRX 文件或提取源码 ZIP。",
    chromeTab: "Chrome",
    edgeTab: "Edge",
    installTitle: "手动安装 CRX File",
    installBody:
      "打开 chrome://extensions 或 edge://extensions，开启开发者模式，然后把下载的 CRX file 拖入扩展管理页。",
    zipTitle: "使用 CRX Extractor ZIP 源码",
    zipBody:
      "选择 ZIP 格式可以跳过浏览器签名头，直接查看 manifest.json、后台脚本、内容脚本和扩展资源。",
    steps: {
      chrome: [
        {
          title: "找到扩展",
          body: "打开目标扩展的 Chrome Web Store 页面，复制地址栏完整链接。CRXFile 也支持直接输入 32 位扩展 ID。"
        },
        {
          title: "粘贴到 CRXFile",
          body: "把 URL 或 ID 粘贴到 CRXFile。工具会请求官方商店更新端点，定位最新的 CRX file 安装包。"
        },
        {
          title: "Get CRX 或提取 ZIP",
          body: "选择下载 CRX 用于手动安装，或下载 ZIP 作为 CRX extractor 输出进行代码审查。"
        }
      ],
      edge: [
        {
          title: "找到加载项",
          body: "打开目标扩展的 Microsoft Edge Add-ons 页面，然后复制浏览器地址栏完整链接。"
        },
        {
          title: "粘贴到 CRXFile",
          body: "把 Edge URL 或扩展 ID 粘贴到 CRXFile。CRX downloader 会从官方端点解析公开安装包。"
        },
        {
          title: "Get CRX 或提取 ZIP",
          body: "下载 CRX 可用于 Edge 手动安装，选择 ZIP 则可获得 CRX extractor 源码文件。"
        }
      ]
    }
  },
  extractor: {
    title: "使用 CRX Extractor 检查源码",
    paragraphs: [
      "当你选择 ZIP 选项时，CRXFile 就会作为 CRX extractor 使用。下载的 ZIP 包含扩展完整解包源码，除了商店签名头之外，内容与开发者上传的扩展文件一致。",
      "开始源码审查时，先解压归档并用代码编辑器打开文件夹。建议从 manifest.json 入手，它声明了扩展权限、内容脚本、后台 service worker 和其他关键元数据。"
    ],
    items: [
      "权限声明 - 检查扩展可以访问哪些浏览器能力和网页范围。",
      "内容脚本 - 查看扩展会向哪些页面注入代码。",
      "后台脚本 - 理解长期运行的后台逻辑。",
      "第三方库 - 审查扩展打包的依赖代码。"
    ],
    outro:
      "使用 CRX file extractor 是扩展安全审计中的常见做法。开发者也可以借此学习热门扩展的构建方式，理解 CRX file 架构和 Chrome Extension API。"
  },
  why: {
    title: "为什么使用 CRXFile？",
    intro:
      "CRXFile 是一个 CRX downloader，可以替你处理 Chrome 和 Edge 的商店更新端点。",
    items: [
      {
        icon: Globe2,
        title: "双商店支持",
        body: "一个工具同时支持 Chrome Web Store 和 Microsoft Edge Add-ons。"
      },
      {
        icon: PackageCheck,
        title: "无需安装插件",
        body: "CRXFile 直接在浏览器中运行，不需要额外插件即可 download CRX 文件。"
      },
      {
        icon: Download,
        title: "始终获取最新版本",
        body: "每次请求都会获取当前公开发布的 CRX file 安装包。"
      },
      {
        icon: ShieldCheck,
        title: "隐私优先",
        body: "无需账号、不持久化存储文件，也不跟踪下载记录。"
      }
    ]
  },
  faq: {
    title: "CRX File FAQ",
    subtitle: "关于下载、提取和 get CRX files 的常见问题。",
    items: [
      {
        q: "什么是 CRX file？",
        a: "CRX file 是 Chromium 系浏览器扩展的官方打包格式，是一个带签名信息的容器，内部包含扩展源码文件。"
      },
      {
        q: ".crx 和 .zip 有什么区别？",
        a: ".crx 保留浏览器可识别的签名头，用于手动安装；.zip 去除该头部，方便直接解压查看源码，也就是 CRX extractor 的输出。"
      },
      {
        q: "下载的 CRX file 为什么不能双击安装？",
        a: "Chrome 和 Edge 默认限制外部安装。请打开 chrome://extensions 或 edge://extensions，开启开发者模式，再把 CRX file 拖入扩展页面。"
      },
      {
        q: "Download CRX 需要登录或付费吗？",
        a: "不需要。CRXFile 是免费的 CRX downloader，无需注册、登录或付费，可以随时 get CRX 文件或提取源码。"
      },
      {
        q: "CRXFile 会保存我的下载记录或个人信息吗？",
        a: "不需要账号，也不会持久化存储任何 CRX file 下载。服务端仅在当前请求中代理官方商店下载。"
      },
      {
        q: "这个 CRX extractor 支持哪些应用商店？",
        a: "CRXFile 支持 Chrome Web Store 和 Microsoft Edge Add-ons 的公开插件包，两者都使用相同的 CRX file 格式。"
      },
      {
        q: "这个 CRX downloader 可以下载付费或私有扩展吗？",
        a: "不支持。CRXFile 无法绕过付费授权、私有列表、企业限制或任何访问控制，只能访问公开可用的免费扩展。"
      },
      {
        q: "尝试 get CRX 时下载失败怎么办？",
        a: "扩展可能已下架、存在地区限制、企业限制，或官方端点暂时不可用。请确认 ID 正确后稍后重试。"
      },
      {
        q: "下载 CRX 文件是否合法？",
        a: "用于学习、个人备份和安全审计通常是合理场景。不要使用任何 CRX downloader 侵犯版权、倒卖文件或二次分发付费内容。"
      },
      {
        q: "已经下架的插件还能下载吗？",
        a: "通常不能。Download CRX 依赖商店当前公开更新端点，一旦扩展下架，其 CRX file 可能不再可获取。"
      },
      {
        q: "CRX file 格式版本是什么？",
        a: "现代 CRX files 使用版本 3，也称 CRX3，采用 SHA-256 哈希和改进签名。CRXFile 会自动处理这些细节。"
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

        <section className="content-section">
          <div className="section-inner text-content">
            <h2>{t.learn.title}</h2>
            {t.learn.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
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
                  <article className="step-card" key={step.title}>
                    <div className="step-visual">
                      <Icon size={28} aria-hidden="true" />
                      <span>{index + 1}</span>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
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

        <section className="content-section extractor-section">
          <div className="section-inner split-content">
            <div className="text-content">
              <h2>{t.extractor.title}</h2>
              {t.extractor.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p>{t.extractor.outro}</p>
            </div>
            <ul className="feature-list">
              {t.extractor.items.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="content-section why-section">
          <div className="section-inner text-content">
            <h2>{t.why.title}</h2>
            <p>{t.why.intro}</p>
            <ul className="benefit-grid">
              {t.why.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.title}>
                    <Icon size={21} aria-hidden="true" />
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                  </li>
                );
              })}
            </ul>
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
