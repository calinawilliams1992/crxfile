import type { Metadata } from "next";
import { CrxFileApp } from "../components/CrxFileApp";

export const metadata: Metadata = {
  title: {
    absolute: "Chrome插件CRX离线下载 - 一键获取安装包，免登录免注册 | CRXFile"
  },
  description:
    "CRXFile 是免费的 Chrome 插件 CRX 下载工具。粘贴插件页面链接即可一键下载 CRX 离线安装包或 ZIP 源码包，无需登录、无需账号，支持 Chrome Web Store 和 Edge 扩展商店。",
  keywords: [
    "Chrome插件下载",
    "CRX文件下载",
    "Chrome插件离线安装",
    "CRX转ZIP",
    "谷歌浏览器插件下载",
    "Edge插件下载",
    "Chrome扩展下载",
    "插件离线安装包",
    "Chrome插件源码",
    "crx文件怎么安装"
  ],
  alternates: {
    canonical: "/zh",
    languages: {
      en: "/",
      "zh-CN": "/zh",
      "x-default": "/"
    }
  },
  openGraph: {
    type: "website",
    url: "/zh",
    title: "Chrome插件CRX离线下载 - 一键获取安装包，免登录免注册 | CRXFile",
    description:
      "CRXFile 是免费的 Chrome 插件 CRX 下载工具。粘贴插件页面链接即可一键下载 CRX 离线安装包或 ZIP 源码包，无需登录、无需账号。",
    siteName: "CRXFile",
    locale: "zh_CN",
    alternateLocale: ["en_US"]
  },
  twitter: {
    card: "summary",
    title: "Chrome插件CRX离线下载 - 一键获取安装包，免登录免注册 | CRXFile",
    description:
      "CRXFile 是免费的 Chrome 插件 CRX 下载工具。粘贴插件页面链接即可一键下载 CRX 离线安装包或 ZIP 源码包。"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: "zh-CN",
  mainEntity: [
    {
      "@type": "Question",
      name: "什么是 CRX 文件？Chrome 插件和 CRX 有什么关系？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CRX 文件是 Chrome、Edge 等 Chromium 浏览器用于分发和安装插件的官方安装包格式。它本质上是带有浏览器签名头的压缩包，内部包含插件的 JavaScript、HTML、CSS、图片资源和 manifest.json 等文件。当你从 Chrome Web Store 安装插件时，浏览器会在后台下载 CRX 文件，但商店页面通常不提供直接下载按钮。"
      }
    },
    {
      "@type": "Question",
      name: "CRX 文件和 ZIP 源码包有什么区别，分别用在什么场景？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CRX 文件保留浏览器可识别的签名头，主要用于手动离线安装 Chrome 插件或 Edge 插件。ZIP 源码包去除了安装包签名头，可以直接解压查看插件源代码，适合学习开发、安全审计和合规检查。"
      }
    },
    {
      "@type": "Question",
      name: "下载的 CRX 插件文件为什么无法直接安装？怎么解决？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Chrome 和 Edge 默认限制外部插件安装，双击 CRX 文件通常不会触发安装。你可以打开 chrome://extensions 或 edge://extensions，开启开发者模式，再把 CRX 文件拖入扩展管理页面。如果浏览器版本限制拖入安装，可下载 ZIP 源码包，解压后选择“加载已解压的扩展程序”。"
      }
    },
    {
      "@type": "Question",
      name: "下载 Chrome 插件 CRX 文件需要登录或付费吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "不需要。CRXFile 是免费的 Chrome 插件 CRX 下载工具，无需注册、无需登录，也无需付费。粘贴公开插件页面链接或扩展 ID，即可尝试获取 CRX 离线安装包或 ZIP 源码包。"
      }
    },
    {
      "@type": "Question",
      name: "CRXFile 会记录我的下载历史或个人隐私信息吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "不会。CRXFile 不要求登录账号，也不会记录你的下载历史或收集个人信息。服务端只在当前请求中代理官方商店公开下载接口，用于完成本次 CRX 文件或 ZIP 源码包下载。"
      }
    },
    {
      "@type": "Question",
      name: "CRXFile 支持哪些浏览器插件商店？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CRXFile 支持 Chrome Web Store 和微软 Edge 扩展商店的公开插件包。你可以粘贴 Chrome 插件页面链接、Edge 插件页面链接，或直接输入 32 位扩展 ID。"
      }
    },
    {
      "@type": "Question",
      name: "能下载付费插件或未公开的私有扩展吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "不能。CRXFile 无法绕过付费授权、私有列表、企业限制或任何访问控制，只能下载官方商店当前公开可访问的插件安装包。"
      }
    },
    {
      "@type": "Question",
      name: "下载 CRX 文件时报错或失败，该怎么办？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "请先确认插件链接或扩展 ID 是否正确。如果仍然失败，可能是插件已下架、存在地区限制、企业限制，或 Chrome Web Store / Edge 扩展商店公开接口暂时不可用。你可以稍后重试，或尝试使用另一个公开插件链接。"
      }
    },
    {
      "@type": "Question",
      name: "下载 Chrome 插件的 CRX 文件合法吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "用于学习研究、个人备份、安全审计和企业合规管理通常属于合理使用场景。但你不应侵犯版权、转售插件安装包，或重新分发付费内容。下载后的使用行为需要由使用者自行负责。"
      }
    },
    {
      "@type": "Question",
      name: "已从 Chrome Web Store 下架或被移除的插件还能下载吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "通常不能。CRX 文件下载依赖官方商店当前公开更新接口。如果插件已被下架、移除或不再提供公开安装包，CRXFile 一般也无法获取该插件。"
      }
    },
    {
      "@type": "Question",
      name: "无法打开 Chrome Web Store 时，能用 CRXFile 下载 Chrome 插件吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "可以尝试。CRXFile 会通过服务端请求 Chrome Web Store 官方公开接口，帮助你获取公开插件的 CRX 离线安装包或 ZIP 源码包。但如果目标插件存在地区限制、账号限制或已下架，下载仍可能失败。"
      }
    },
    {
      "@type": "Question",
      name: "如何用 ZIP 源码包方式离线安装 Chrome 插件？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "先下载 ZIP 源码包并解压到本地文件夹，然后打开 chrome://extensions，开启开发者模式，点击“加载已解压的扩展程序”，选择解压后的文件夹即可。这个方式适合 CRX 拖入安装失败的情况。"
      }
    },
    {
      "@type": "Question",
      name: "CRX 文件格式版本是什么？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "现代 Chrome 插件安装包通常使用 CRX3 格式，采用更安全的哈希和签名机制。CRXFile 会自动处理这些格式细节，你只需要选择下载 CRX 安装包或 ZIP 源码包。"
      }
    }
  ]
};

export default function ChineseHome() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <CrxFileApp initialLang="zh" />
    </>
  );
}
