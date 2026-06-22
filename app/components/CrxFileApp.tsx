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

type GuideStep = {
  title: string;
  body: string;
};

type ExtractorItem =
  | string
  | {
      title: string;
      body: string;
    };

type Copy = {
  nav: {
    tool: string;
  };
  hero: {
    title: string;
    subtitle: string;
    trust: Array<{ icon: LucideIcon; label: string }>;
  };
  form: {
    label: string;
    placeholder: string;
    storeLabel: string;
    parse: string;
    parsing: string;
    hint: string;
    autoDetected: string;
    chrome: string;
    edge: string;
  };
  errors: {
    empty: string;
    invalid: string;
    unsupportedStore: string;
    notFound: string;
    busy: string;
    rate: (seconds: number) => string;
  };
  result: {
    ready: string;
    version: string;
    developer: string;
    rating: string;
    users: string;
    source: string;
    downloadCrx: string;
    downloadZip: string;
    note: string;
    partial: string;
  };
  guide: {
    title: string;
    subtitle: string;
    chromeTab: string;
    edgeTab: string;
    installTitle: string;
    installBody: string;
    zipTitle: string;
    zipBody: string;
    steps: Record<Store, GuideStep[]>;
  };
  extractor: {
    title: string;
    paragraphs: string[];
    items: ExtractorItem[];
    outro: string;
  };
  faq: {
    title: string;
    subtitle: string;
    items: Array<{ q: string; a: string }>;
  };
  footer: {
    disclaimer: string;
    legal: string;
  };
};

const english: Copy = {
  nav: {
    tool: "CRX Downloader"
  },
  hero: {
    title: "Download CRX Files from Any Chrome Extension",
    subtitle:
      "Free online CRX file extractor and CRX downloader. Get CRX and ZIP source files from Chrome Web Store and Edge Add-ons instantly. No login required.",
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
  faq: {
    title: "CRX File FAQ",
    subtitle: "Common questions about downloading, extracting, and getting CRX files.",
    items: [
      {
        q: "What is a CRX file?",
        a: "A CRX file is the official package format Chromium browsers use to distribute extensions. It works like a signed ZIP archive with a browser-verifiable header and contains extension source files. When you install from Chrome Web Store, the browser downloads this package in the background, but store pages do not provide a direct download button. CRX files matter for developers auditing permissions, users making backups, and IT teams managing browsers. A CRX extractor can unpack the package into JavaScript, HTML, CSS, assets, and manifest.json."
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
    tool: "Chrome 插件 CRX 下载工具"
  },
  hero: {
    title: "免费下载任意 Chrome 插件的 CRX 离线安装包",
    subtitle:
      "在线 CRX 下载工具，粘贴 Chrome 插件链接或扩展 ID，一键获取 CRX 离线安装包或 ZIP 源码包。无需登录、无需注册账号，数据来自 Chrome Web Store 官方接口，支持 Edge 扩展商店。",
    trust: [
      { icon: ShieldCheck, label: "数据来自 Chrome / Edge 官方商店接口，安全可信" },
      { icon: LockKeyhole, label: "无需登录，无需注册账号，即用即走" },
      { icon: Archive, label: "不记录下载历史，不收集个人信息" }
    ]
  },
  form: {
    label: "Chrome 插件链接或扩展 ID",
    placeholder:
      "https://chromewebstore.google.com/detail/example/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    storeLabel: "输入扩展 ID 时选择来源商店",
    parse: "立即下载",
    parsing: "解析中",
    hint: "支持 Chrome Web Store 和微软 Edge 扩展商店链接，也可直接输入 32 位扩展 ID。",
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
    ready: "已解析，可选择下载格式",
    version: "版本",
    developer: "开发者",
    rating: "评分",
    users: "用户数",
    source: "商店页面",
    downloadCrx: "下载 CRX 安装包",
    downloadZip: "下载 ZIP 源码包",
    note: "下载内容来自 Chrome / Edge 官方商店公开接口，仅供学习研究、个人备份、离线安装和安全审计使用。",
    partial: "该插件的商店信息有限，但仍可尝试下载公开可用的 CRX 安装包。"
  },
  guide: {
    title: "三步下载 Chrome 插件 CRX 离线安装包",
    subtitle:
      "CRXFile 支持从 Chrome Web Store 和微软 Edge 扩展商店在线提取任意插件的 CRX 安装包或 ZIP 源码包，全程无需登录、无需注册。",
    chromeTab: "Chrome",
    edgeTab: "Edge",
    installTitle: "如何手动安装 CRX 插件离线安装包（Chrome / Edge 通用）",
    installBody:
      "打开 chrome://extensions 或 edge://extensions，开启开发者模式，将下载好的 .crx 文件拖入扩展程序管理页面，并在弹窗中确认添加扩展程序。若新版浏览器限制 CRX 拖入安装，可下载 ZIP 源码包，解压后通过“加载已解压的扩展程序”方式安装。",
    zipTitle: "如何使用 ZIP 源码包查看 Chrome 插件代码",
    zipBody:
      "下载 ZIP 源码包后，直接解压到本地文件夹，用 VS Code、Sublime Text 等代码编辑器打开即可查看完整源代码。建议先浏览 manifest.json，它声明了插件权限、注入脚本目标网站和后台进程配置。",
    steps: {
      chrome: [
        {
          title: "第一步：打开 Chrome 插件页面，复制完整链接",
          body: "在 Chrome Web Store 找到目标插件，复制地址栏中的完整页面链接。也支持直接输入 32 位扩展 ID，插件商店 URL 末尾的一串字符通常就是 ID。"
        },
        {
          title: "第二步：粘贴链接到工具栏，一键解析",
          body: "将复制的插件链接或扩展 ID 粘贴到上方输入框，点击“立即下载”。工具会调用官方商店公开接口，获取该插件最新版本的 CRX 安装包信息。"
        },
        {
          title: "第三步：选择下载 CRX 安装包或 ZIP 源码包",
          body: "根据用途选择下载格式：CRX 文件用于手动离线安装到 Chrome / Edge 浏览器，ZIP 源码包用于查看插件源代码、学习开发或进行安全审查。"
        }
      ],
      edge: [
        {
          title: "第一步：打开 Edge 插件页面，复制完整链接",
          body: "在微软 Edge 扩展商店找到目标插件，复制浏览器地址栏中的完整页面链接。也可以直接输入 Edge 扩展的 32 位扩展 ID。"
        },
        {
          title: "第二步：粘贴链接到工具栏，一键解析",
          body: "将 Edge 插件链接或扩展 ID 粘贴到上方输入框，点击“立即下载”。CRXFile 会从官方公开接口解析最新安装包信息。"
        },
        {
          title: "第三步：选择下载 CRX 安装包或 ZIP 源码包",
          body: "下载 CRX 可用于 Edge 手动安装，选择 ZIP 则可获得插件源码包，方便查看 manifest.json、内容脚本和后台脚本。"
        }
      ]
    }
  },
  extractor: {
    title: "CRX 转 ZIP：在线查看 Chrome 插件完整源码",
    paragraphs: [
      "选择 ZIP 格式下载时，CRXFile 会将 CRX 安装包自动转换为可解压的 ZIP 源码包。解压后可用代码编辑器直接打开，查看 Chrome 插件完整源代码，适合开发者学习、安全审计和合规检查。",
      "拿到 ZIP 源码包后，建议从 manifest.json 入手。该文件声明了插件的所有权限、会注入代码的目标网站、后台 Service Worker 配置以及其他关键设置，是判断一个插件是否值得信任的核心依据。"
    ],
    items: [
      {
        title: "权限声明（permissions）：插件能访问哪些系统权限？",
        body: "重点关注 tabs、cookies、history、<all_urls> 等高风险权限，评估插件是否超出功能所需权限范围。"
      },
      {
        title: "内容脚本（content_scripts）：插件会向哪些网站注入代码？",
        body: "查看 matches 字段，了解插件会在哪些网站上运行脚本，判断是否存在不必要的广泛访问权限。"
      },
      {
        title: "后台进程（background）：插件的持续运行逻辑",
        body: "检查 service_worker 脚本内容，了解插件是否在后台持续监控用户行为或发送网络请求。"
      },
      {
        title: "第三方依赖库：检查打包进来的外部代码",
        body: "查看 vendor.js、libs/ 等目录，确认是否包含已知安全漏洞的库版本。"
      }
    ],
    outro:
      "CRX 转 ZIP 是查看 Chrome 插件源码的常见方式。普通用户可以用它判断插件是否安全，开发者也可以借此学习扩展结构和 Chrome Extension API。"
  },
  faq: {
    title: "常见问题解答：Chrome 插件 CRX 下载与安装",
    subtitle: "关于 Chrome 插件 CRX 文件下载、离线安装和源码查看的常见问题。",
    items: [
      {
        q: "什么是 CRX 文件？Chrome 插件和 CRX 有什么关系？",
        a: "CRX 文件是 Chrome、Edge 等 Chromium 浏览器用于分发和安装插件的官方安装包格式。它本质上是带有浏览器签名头的压缩包，内部包含插件的 JavaScript、HTML、CSS、图片资源和 manifest.json 等文件。当你从 Chrome Web Store 安装插件时，浏览器会在后台下载 CRX 文件，但商店页面通常不提供直接下载按钮。"
      },
      {
        q: "CRX 文件和 ZIP 源码包有什么区别，分别用在什么场景？",
        a: "CRX 文件保留浏览器可识别的签名头，主要用于手动离线安装 Chrome 插件或 Edge 插件。ZIP 源码包去除了安装包签名头，可以直接解压查看插件源代码，适合学习开发、安全审计和合规检查。"
      },
      {
        q: "下载的 CRX 插件文件为什么无法直接安装？怎么解决？",
        a: "Chrome 和 Edge 默认限制外部插件安装，双击 CRX 文件通常不会触发安装。你可以打开 chrome://extensions 或 edge://extensions，开启开发者模式，再把 CRX 文件拖入扩展管理页面。如果浏览器版本限制拖入安装，可下载 ZIP 源码包，解压后选择“加载已解压的扩展程序”。"
      },
      {
        q: "下载 Chrome 插件 CRX 文件需要登录或付费吗？",
        a: "不需要。CRXFile 是免费的 Chrome 插件 CRX 下载工具，无需注册、无需登录，也无需付费。粘贴公开插件页面链接或扩展 ID，即可尝试获取 CRX 离线安装包或 ZIP 源码包。"
      },
      {
        q: "CRXFile 会记录我的下载历史或个人隐私信息吗？",
        a: "不会。CRXFile 不要求登录账号，也不会记录你的下载历史或收集个人信息。服务端只在当前请求中代理官方商店公开下载接口，用于完成本次 CRX 文件或 ZIP 源码包下载。"
      },
      {
        q: "CRXFile 支持哪些浏览器插件商店？",
        a: "CRXFile 支持 Chrome Web Store 和微软 Edge 扩展商店的公开插件包。你可以粘贴 Chrome 插件页面链接、Edge 插件页面链接，或直接输入 32 位扩展 ID。"
      },
      {
        q: "能下载付费插件或未公开的私有扩展吗？",
        a: "不能。CRXFile 无法绕过付费授权、私有列表、企业限制或任何访问控制，只能下载官方商店当前公开可访问的插件安装包。"
      },
      {
        q: "下载 CRX 文件时报错或失败，该怎么办？",
        a: "请先确认插件链接或扩展 ID 是否正确。如果仍然失败，可能是插件已下架、存在地区限制、企业限制，或 Chrome Web Store / Edge 扩展商店公开接口暂时不可用。你可以稍后重试，或尝试使用另一个公开插件链接。"
      },
      {
        q: "下载 Chrome 插件的 CRX 文件合法吗？",
        a: "用于学习研究、个人备份、安全审计和企业合规管理通常属于合理使用场景。但你不应侵犯版权、转售插件安装包，或重新分发付费内容。下载后的使用行为需要由使用者自行负责。"
      },
      {
        q: "已从 Chrome Web Store 下架或被移除的插件还能下载吗？",
        a: "通常不能。CRX 文件下载依赖官方商店当前公开更新接口。如果插件已被下架、移除或不再提供公开安装包，CRXFile 一般也无法获取该插件。"
      },
      {
        q: "无法打开 Chrome Web Store 时，能用 CRXFile 下载 Chrome 插件吗？",
        a: "可以尝试。CRXFile 会通过服务端请求 Chrome Web Store 官方公开接口，帮助你获取公开插件的 CRX 离线安装包或 ZIP 源码包。但如果目标插件存在地区限制、账号限制或已下架，下载仍可能失败。"
      },
      {
        q: "如何用 ZIP 源码包方式离线安装 Chrome 插件？",
        a: "先下载 ZIP 源码包并解压到本地文件夹，然后打开 chrome://extensions，开启开发者模式，点击“加载已解压的扩展程序”，选择解压后的文件夹即可。这个方式适合 CRX 拖入安装失败的情况。"
      },
      {
        q: "CRX 文件格式版本是什么？",
        a: "现代 Chrome 插件安装包通常使用 CRX3 格式，采用更安全的哈希和签名机制。CRXFile 会自动处理这些格式细节，你只需要选择下载 CRX 安装包或 ZIP 源码包。"
      }
    ]
  },
  footer: {
    disclaimer:
      "CRXFile 是独立的第三方工具，与 Google、Microsoft 无任何关联，所有相关商标归原始所有权方所有。",
    legal:
      "本工具仅供合法用途使用：包括插件学习研究、安全审计、个人备份及合规管理。使用者需自行对所下载内容的使用行为负责。"
  }
};

const copyByLang: Record<Lang, Copy> = {
  en: english,
  zh: chinese
};

const languageOptions: Array<{ value: Lang; label: string; shortLabel: string; href: string }> = [
  { value: "en", label: "English", shortLabel: "EN", href: "/" },
  { value: "zh", label: "简体中文", shortLabel: "ZH", href: "/zh" }
];

const guideIcons = [Globe2, ClipboardPaste, Search, Download];

export function CrxFileApp({ initialLang = "en" }: { initialLang?: Lang }) {
  const [lang] = useState<Lang>(initialLang);
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
                <a
                  className="language-option"
                  href={option.href}
                  role="menuitemradio"
                  aria-checked={lang === option.value}
                  aria-current={lang === option.value ? "page" : undefined}
                  key={option.value}
                >
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.shortLabel}</small>
                  </span>
                  {lang === option.value ? (
                    <CheckCircle2 size={17} aria-hidden="true" />
                  ) : null}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <main>
        <section className="tool-section" id="tool">
          <div className="section-inner tool-layout">
            <div className="intro-copy">
              <h1>{t.hero.title}</h1>
              <p className="hero-subtitle">{t.hero.subtitle}</p>
            </div>

            <div className="tool-workspace" aria-label={t.nav.tool}>
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
                {!plugin && !error ? (loading ? <LoadingOutput copy={t} /> : <EmptyOutput />) : null}
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
              {t.extractor.items.map((item) => {
                const key = typeof item === "string" ? item : item.title;

                return (
                  <li key={key}>
                    <CheckCircle2 size={18} aria-hidden="true" />
                    {typeof item === "string" ? (
                      <span>{item}</span>
                    ) : (
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                      </div>
                    )}
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

function TrustItem({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="trust-item">
      <Icon size={18} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function EmptyOutput() {
  return <div className="empty-output" aria-hidden="true" />;
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
