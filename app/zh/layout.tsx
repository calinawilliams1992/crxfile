import type { Metadata, Viewport } from "next";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.crxfile.xyz"),
  title: {
    default: "Chrome插件CRX离线下载 - 一键获取安装包，免登录免注册 | CRXFile",
    template: "%s | CRXFile"
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
  openGraph: {
    type: "website",
    url: "https://www.crxfile.xyz/zh",
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
  },
  icons: {
    icon: "/favicon.svg"
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d3b66"
};

export default function ChineseRootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
