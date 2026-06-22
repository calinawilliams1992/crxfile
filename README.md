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

## SEO Keywords

crx file, crx extractor, get crx, crx downloader, download crx, download crx file, extension source code

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

## 中文说明

CRXFile 是一个免费的在线 CRX 文件提取器和 CRX 下载工具，支持从 Chrome Web Store 和 Microsoft Edge Add-ons 获取公开浏览器插件的安装包。

网站地址：http://www.crxfile.xyz/

你可以使用 CRXFile 下载 `.crx` 离线安装包，也可以下载 `.zip` 源码包，用于查看插件源码、学习开发、安全审计、个人备份或企业内部浏览器插件管理。

## 中文功能

- 下载公开 Chrome 插件的 `.crx` 文件。
- 将插件源码提取为 `.zip` 文件。
- 支持 Chrome Web Store 和 Microsoft Edge Add-ons 链接。
- 支持粘贴插件页面 URL 或 32 位扩展 ID。
- 提供英文和中文页面，便于搜索引擎收录。
- 提供完善的 metadata、robots.txt 和 sitemap.xml。
- 无需注册、无需登录，不长期保存下载文件。

## 中文 SEO 关键词

CRX文件下载、Chrome插件下载、CRX文件提取器、Chrome插件离线安装、插件源码下载、Edge插件下载、CRX转ZIP

## 重要说明

CRXFile 只能获取官方商店当前公开可访问的插件文件，不能绕过付费授权、私有列表、企业限制、已下架插件或其他访问控制。

下载后的文件请用于学习研究、个人备份、安全审计或合法的企业内部管理。使用者需要自行遵守插件许可协议和相关法律法规。

## License

This project is released under the MIT License.
