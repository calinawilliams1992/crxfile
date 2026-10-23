# CRXFile

CRXFile is a free online CRX file extractor and CRX downloader for Chrome Web Store and Microsoft Edge Add-ons extensions.

Website: https://www.crxfile.xyz/

Use CRXFile to get CRX files, download ZIP source packages, inspect extension source code, and keep a local backup of public browser extensions. The tool is designed for developers, security reviewers, IT administrators, and users who need a simple way to download CRX files without logging in.

## Features

- Download public Chrome extension packages as `.crx` files.
- Extract extension source code as `.zip` files.
- Support Chrome Web Store and Microsoft Edge Add-ons URLs.
- Parse extension links or 32-character extension IDs.
- Provide English and Chinese pages for SEO and international users.
- Provide a dedicated blog index with dated summaries and links to every published guide.
- Publish a keyword-focused CRX download guide at its own article URL with links to the downloader.
- Include guides to finding Chrome extension IDs and downloading CRX packages from Microsoft Edge Add-ons.
- Include a Chrome extension package backup workflow with a tested CRX example and a downloadable CSV record template.
- Explain how to inspect extension source without installing it, with an original Manifest V3 example ZIP.
- Explain how to read a Chrome extension manifest, with an annotated JSON example and checks for version fields, permissions, service workers, and content scripts.
- Review Chrome extension permissions with a field-by-field table for API access, host patterns, optional grants, and activeTab.
- Compare host permissions and activeTab with two minimal Manifest V3 examples, a shared action handler, and checks for site access and grant lifetime.
- Trace content scripts from URL patterns to DOM changes, with an original manifest, shared source file, and interactive DOM check page.
- Provide Privacy Policy and Terms of Service pages tailored to the downloader.
- Generate SEO-friendly metadata, robots.txt, and sitemap.xml routes.
- Run without user accounts, registration, or persistent file storage.

## Tech Stack

- Next.js
- React
- TypeScript
- Vercel-ready routing and API handlers

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Run type checking:

```bash
npm run typecheck
```

Build for production:

```bash
npm run build
```

## Project Structure

```text
app/
  (en)/                 English homepage and metadata
    blog/               Blog index and individual English extension tutorials
    privacy-policy/     Privacy Policy
    terms-of-service/   Terms of Service
  zh/                   Chinese homepage and metadata
  api/                  Download and parse API routes
  components/           Shared UI components
  robots.ts             robots.txt route
  sitemap/sitemap.ts    Existing /sitemap/sitemap.xml metadata route
lib/
  blog.ts               Shared article catalog for the blog index, metadata, and sitemap
```

## Publishing a Blog Guide

Add an article page under `app/(en)/blog/<slug>/page.tsx` and register its title, summary, dates, and reading time in `lib/blog.ts`. Use that catalog entry for the article's metadata. The blog index and sitemap both read the catalog, so each registered article has a visible entry and a crawlable URL. Reserve `/blog` for the article index; use each article's own URL for links to its content.

Keep the established sitemap location at `/sitemap/sitemap.xml`. Its existing Search Console submission and robots.txt declaration use `http://www.crxfile.xyz/sitemap/sitemap.xml`; Vercel upgrades HTTP to HTTPS while preserving that path. The root `/sitemap.xml` URL only redirects to the established location. Do not move the sitemap when publishing an article.

The source inspection article uses `examples/source-review-demo/manifest.json` directly. After editing the example, rebuild its download from the repository root with `python3 -m zipfile -c public/examples/source-review-demo.zip examples/source-review-demo`. Keep the archive and source files in the same commit.

The content script tracing article reads its manifest and JavaScript from `public/examples/content-script-trace/`. The DOM check page in that folder runs the same `content.js` as a regular page script. Keep those files together; the check demonstrates DOM behavior and does not test Chrome extension injection or site permissions.

## Usage Notes

CRXFile can only download public extension packages exposed by official store endpoints. It cannot bypass paid access, private listings, enterprise restrictions, removed extensions, or other access controls.

Downloaded files should be used for learning, personal backup, security review, or legitimate internal browser extension management. Users are responsible for respecting extension licenses and applicable laws.

## License

This project is released under the MIT License.

## 中文版

CRXFile 是一个免费的在线 CRX 文件提取器和 CRX 下载工具，适用于 Chrome Web Store 和 Microsoft Edge Add-ons 中公开发布的浏览器扩展。

网站地址：https://www.crxfile.xyz/

你可以使用 CRXFile 获取 CRX 文件、下载 ZIP 源码包、查看扩展源码，并为公开浏览器扩展保留本地备份。这个工具主要面向开发者、安全审查人员、IT 管理员，以及希望在无需登录的情况下便捷下载 CRX 文件的用户。

### 功能特性

- 将公开的 Chrome 扩展下载为 `.crx` 文件。
- 将扩展源码提取并下载为 `.zip` 文件。
- 支持 Chrome Web Store 和 Microsoft Edge Add-ons 的扩展链接。
- 支持解析扩展页面链接或 32 位扩展 ID。
- 提供英文和中文页面，兼顾 SEO 与国际用户访问。
- 生成适合搜索引擎抓取的 metadata、robots.txt 和 sitemap.xml 路由。
- 无需用户账号、无需注册，也不会长期保存下载文件。

### 技术栈

- Next.js
- React
- TypeScript
- 适配 Vercel 部署的路由和 API 处理器

### 快速开始

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

运行类型检查：

```bash
npm run typecheck
```

构建生产版本：

```bash
npm run build
```

### 项目结构

```text
app/
  (en)/                 英文首页和 metadata
  zh/                   中文首页和 metadata
  api/                  下载与解析相关的 API 路由
  components/           共享 UI 组件
  robots.ts             robots.txt 路由
  sitemap/sitemap.ts    既有 /sitemap/sitemap.xml 路由
```

### 使用说明

CRXFile 只能下载官方商店接口当前公开提供的扩展安装包。它不能绕过付费访问、私有列表、企业限制、已下架扩展或其他访问控制。

下载的文件应仅用于学习、个人备份、安全审查，或合法的企业内部浏览器扩展管理。使用者需要自行遵守扩展许可协议和适用法律。

### 许可证

本项目基于 MIT License 开源发布。
