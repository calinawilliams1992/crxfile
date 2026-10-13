import type { Metadata } from "next";
import { PackageCheck } from "lucide-react";
import { SiteFooter } from "@/app/components/SiteFooter";
import { blogPostDate, blogPostUrl, chromeDownloadPost } from "@/lib/blog";

const { title, description, publishedAt, modifiedAt } = chromeDownloadPost;
const url = blogPostUrl(chromeDownloadPost);

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "download crx file",
    "crx downloader",
    "chrome extension downloader",
    "download chrome extension crx",
    "extract crx file",
    "crx to zip",
    "chrome extension source code",
    "download edge extension crx"
  ],
  alternates: {
    canonical: chromeDownloadPost.path
  },
  openGraph: {
    type: "article",
    url,
    title,
    description:
      "A practical guide to downloading public CRX packages or ZIP source files for backup, review, and legitimate extension development.",
    siteName: "CRXFile",
    publishedTime: publishedAt,
    modifiedTime: modifiedAt,
    authors: ["CRXFile"]
  },
  twitter: {
    card: "summary",
    title,
    description:
      "Download public CRX packages or ZIP source files for backup, review, and legitimate extension development."
  }
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description:
    "A practical guide to downloading public CRX packages or ZIP source files for backup, review, and legitimate extension development.",
  datePublished: publishedAt,
  dateModified: modifiedAt,
  mainEntityOfPage: url,
  inLanguage: "en",
  author: {
    "@type": "Organization",
    name: "CRXFile"
  },
  publisher: {
    "@type": "Organization",
    name: "CRXFile",
    url: "https://www.crxfile.xyz"
  },
  isAccessibleForFree: true
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "CRX File Downloader",
      item: "https://www.crxfile.xyz/"
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: "https://www.crxfile.xyz/blog"
    },
    {
      "@type": "ListItem",
      position: 3,
      name: title,
      item: url
    }
  ]
};

export default function DownloadChromeExtensionCrxPage() {
  return (
    <div className="site-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <header className="site-header">
        <a className="brand" href="/" aria-label="CRXFile home">
          <span className="brand-mark">
            <PackageCheck size={22} aria-hidden="true" />
          </span>
          <span>CRXFile</span>
        </a>
        <nav className="primary-nav" aria-label="Primary navigation">
          <a href="/#tool">CRX File Downloader</a>
          <a href="/blog" aria-current="page">
            Blog
          </a>
        </nav>
        <div aria-hidden="true" />
      </header>

      <main className="blog-main">
        <article className="blog-article">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/">CRX File Downloader</a>
            <span aria-hidden="true">/</span>
            <a href="/blog">Blog</a>
            <span aria-hidden="true">/</span>
            <span>Download a Chrome Extension CRX</span>
          </nav>

          <header className="article-header">
            <p className="article-kicker">Chrome Extension Guide</p>
            <h1>{title}</h1>
            <p className="article-dek">
              Download a public Chrome or Edge extension package when you need a local backup,
              want to inspect extension source code, or are reviewing a package in a permitted
              development or security workflow.
            </p>
            <p className="article-meta">
              Published <time dateTime={publishedAt}>{blogPostDate(publishedAt)}</time> · {chromeDownloadPost.readingMinutes} min read
            </p>
          </header>

          <aside className="article-summary" aria-label="Quick answer">
            <strong>Quick answer</strong>
            <p>
              Paste a public Chrome Web Store or Microsoft Edge Add-ons URL, or its 32-character
              extension ID, into the <a href="/#tool">CRX File Downloader</a>. Choose <b>CRX</b>{" "}
              to retain the packaged file, or <b>ZIP</b>{" "}to review the extension&apos;s source files.
            </p>
          </aside>

          <section>
            <h2>What is a CRX file?</h2>
            <p>
              A CRX file is a packaged Chromium browser extension. It contains an extension&apos;s
              code and assets, plus package information used by the browser. When an extension is
              installed from an official store, the browser handles the package behind the scenes;
              the store page generally does not expose a direct file-download button.
            </p>
            <p>
              That is where a <strong>CRX downloader</strong> is useful. For public listings, it
              gives developers, security reviewers, and IT teams a way to retrieve the package
              they need for a legitimate local backup or review. CRXFile supports public packages
              from both the Chrome Web Store and Microsoft Edge Add-ons without an account.
            </p>
          </section>

          <section>
            <h2>CRX vs. ZIP: which file should you download?</h2>
            <div className="format-table" role="region" aria-label="CRX and ZIP comparison" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Format</th>
                    <th scope="col">Best for</th>
                    <th scope="col">What you receive</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">.crx</th>
                    <td>Keeping the original extension package</td>
                    <td>The packaged browser-extension file</td>
                  </tr>
                  <tr>
                    <th scope="row">.zip</th>
                    <td>Source review, audits, and development</td>
                    <td>Extractable files such as manifest.json, scripts, and assets</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              If your goal is to <strong>extract a CRX file</strong>, choose the ZIP option. It is
              the practical <strong>CRX to ZIP</strong> route for opening the extension in an
              editor and reading its files. Start with <code>manifest.json</code>: it describes
              permissions, background logic, content scripts, and other important behavior.
            </p>
          </section>

          <section>
            <h2>How to download a CRX file in three steps</h2>
            <ol className="article-steps">
              <li>
                <strong>Copy a public extension URL or ID.</strong> Open the relevant Chrome Web
                Store or Edge Add-ons listing and copy its complete URL. For Chrome, you can also
                <a href="/blog/find-chrome-extension-id"> find the listing&apos;s extension ID</a>.
              </li>
              <li>
                <strong>Parse it with CRXFile.</strong> Paste the URL or ID into the{" "}
                <a href="/#tool">Chrome extension downloader</a>. CRXFile detects the supported
                store and retrieves information for the public package.
              </li>
              <li>
                <strong>Choose CRX or ZIP.</strong> Select CRX to download the package, or ZIP to
                access the extension source code for inspection. The full tool walkthrough is also
                available in the <a href="/#guide">download guide</a>.
              </li>
            </ol>
          </section>

          <section>
            <h2>How to review Chrome extension source code safely</h2>
            <p>
              Download the ZIP, extract it, and read its files in a text editor. Our guide to
              <a href="/blog/view-chrome-extension-source-without-installing"> inspecting extension source without installing it</a>{" "}shows
              how to follow manifest entries into scripts, with a downloadable example. Reading
              the source helps you assess behavior, but it doesn&apos;t prove an extension is safe.
            </p>
            <p>
              If you are testing an extension you are authorized to use, load an unpacked source
              directory only in the appropriate browser development workflow. Chrome and Edge may
              restrict installation of locally downloaded CRX files; for normal use, install from
              the original store listing. The <a href="/#faq">CRX File FAQ</a> explains the
              distinction in more detail.
            </p>
          </section>

          <section>
            <h2>What CRXFile can download</h2>
            <p>
              CRXFile is designed for publicly available packages from the Chrome Web Store and
              Microsoft Edge Add-ons. It does not bypass payments, private listings, enterprise
              restrictions, region controls, removed listings, or any other access control. A
              failed request can mean that the extension is no longer public or that the official
              endpoint cannot provide it at that time.
            </p>
            <p>
              Use downloaded files responsibly: for learning, permitted backup, security review,
              and legitimate administration. Respect the extension&apos;s license and do not
              redistribute paid or protected content.
            </p>
          </section>

          <section>
            <h2>More extension guides</h2>
            <p>
              Need to identify a listing before you download anything? See our guide to
              <a href="/blog/find-chrome-extension-id"> finding a Chrome extension ID</a> in a
              store URL or on the installed extension&apos;s Details page.
            </p>
            <p>
              For a Microsoft store listing, follow <a href="/blog/download-edge-extension-crx">How to Get a CRX from Microsoft Edge Add-ons</a>.
              It includes a tested Edge download, CRX and ZIP results, and checks for common failures.
            </p>
            <p>
              Keeping the downloaded file? Our <a href="/blog/backup-chrome-extension-package">Chrome extension package backup workflow</a> includes
              a record template, version checks, and SHA-256 commands for verifying a saved copy.
            </p>
          </section>

          <section>
            <h2>Download a public extension package</h2>
            <p>
              Ready to get a CRX file or inspect a ZIP source package? Return to the{" "}
              <a href="/#tool">CRX File Downloader</a> and paste a public Chrome or Edge extension
              link. No sign-in is required.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
