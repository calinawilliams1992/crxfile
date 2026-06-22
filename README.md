# CRXFile

CRXFile is a free online CRX file extractor and CRX downloader for Chrome Web Store and Microsoft Edge Add-ons extensions.

Website: http://www.crxfile.xyz/

Use CRXFile to get CRX files, download ZIP source packages, inspect extension source code, and keep a local backup of public browser extensions. The tool is designed for developers, security reviewers, IT administrators, and users who need a simple way to download CRX files without logging in.

## Features

- Download public Chrome extension packages as `.crx` files.
- Extract extension source code as `.zip` files.
- Support Chrome Web Store and Microsoft Edge Add-ons URLs.
- Parse extension links or 32-character extension IDs.
- Provide English and Chinese pages for SEO and international users.
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
  zh/                   Chinese homepage and metadata
  api/                  Download and parse API routes
  components/           Shared UI components
  robots.ts             robots.txt route
  sitemap/              sitemap.xml route
```

## Usage Notes

CRXFile can only download public extension packages exposed by official store endpoints. It cannot bypass paid access, private listings, enterprise restrictions, removed extensions, or other access controls.

Downloaded files should be used for learning, personal backup, security review, or legitimate internal browser extension management. Users are responsible for respecting extension licenses and applicable laws.

## License

This project is released under the MIT License.

## 中文版

CRXFile 是一个免费的在线 CRX 文件提取器和 CRX 下载工具，适用于 Chrome Web Store 和 Microsoft Edge Add-ons 中公开发布的浏览器扩展。

网站地址：http://www.crxfile.xyz/

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
  sitemap/              sitemap.xml 路由
```

### 使用说明

CRXFile 只能下载官方商店接口当前公开提供的扩展安装包。它不能绕过付费访问、私有列表、企业限制、已下架扩展或其他访问控制。

下载的文件应仅用于学习、个人备份、安全审查，或合法的企业内部浏览器扩展管理。使用者需要自行遵守扩展许可协议和适用法律。

### 许可证

本项目基于 MIT License 开源发布。
