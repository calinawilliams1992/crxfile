import type { Metadata } from "next";
import { PackageCheck } from "lucide-react";
import { SiteFooter } from "@/app/components/SiteFooter";
import { blogPostDate, blogPostUrl, chromeExtensionBackupPost } from "@/lib/blog";

const url = blogPostUrl(chromeExtensionBackupPost);
const { publishedAt, modifiedAt, title, description } = chromeExtensionBackupPost;
const storeUrl = "https://chromewebstore.google.com/detail/ublock-origin-lite/ddkjiahejlhfcafbddmgiahcphecmpfh";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: chromeExtensionBackupPost.path },
  openGraph: {
    type: "article",
    url,
    title,
    description,
    siteName: "CRXFile",
    publishedTime: publishedAt,
    modifiedTime: modifiedAt,
    authors: ["CRXFile"]
  },
  twitter: { card: "summary", title, description }
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  datePublished: publishedAt,
  dateModified: modifiedAt,
  mainEntityOfPage: url,
  inLanguage: "en",
  author: { "@type": "Organization", name: "CRXFile", url: "https://www.crxfile.xyz/" },
  publisher: { "@type": "Organization", name: "CRXFile", url: "https://www.crxfile.xyz/" },
  isAccessibleForFree: true
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "CRX File Downloader", item: "https://www.crxfile.xyz/" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.crxfile.xyz/blog" },
    { "@type": "ListItem", position: 3, name: title, item: url }
  ]
};

export default function BackupChromeExtensionPackagePage() {
  return (
    <div className="site-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="site-header">
        <a className="brand" href="/" aria-label="CRXFile home">
          <span className="brand-mark"><PackageCheck size={22} aria-hidden="true" /></span>
          <span>CRXFile</span>
        </a>
        <nav className="primary-nav" aria-label="Primary navigation">
          <a href="/#tool">CRX File Downloader</a>
          <a href="/blog" aria-current="page">Blog</a>
        </nav>
        <div aria-hidden="true" />
      </header>

      <main className="blog-main">
        <article className="blog-article">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/">CRX File Downloader</a><span aria-hidden="true">/</span>
            <a href="/blog">Blog</a><span aria-hidden="true">/</span>
            <span aria-current="page">Back Up a Chrome Extension Package</span>
          </nav>

          <header className="article-header">
            <p className="article-kicker">Chrome Extension Backup</p>
            <h1>{title}</h1>
            <p className="article-dek">
              A useful Chrome extension backup needs more than a file in your Downloads folder.
              Save the CRX, record its source and version, and calculate a checksum so you can
              identify the package months later.
            </p>
            <p className="article-meta">
              By CRXFile · Published <time dateTime={publishedAt}>{blogPostDate(publishedAt)}</time> · {chromeExtensionBackupPost.readingMinutes} min read
            </p>
          </header>

          <aside className="article-summary" aria-label="Quick answer">
            <strong>Quick answer</strong>
            <p>
              To back up a Chrome extension package, keep the CRX, store URL, extension ID,
              package version, capture date, and SHA-256 checksum together. This workflow suits
              developers, reviewers, and IT teams preserving a public package for an authorized
              review. <a href="/#tool">CRXFile</a> retrieves what the official endpoint currently
              exposes; it has no historical version library. A package backup doesn&apos;t include
              your settings or browser profile, and it doesn&apos;t guarantee future installation.
            </p>
          </aside>

          <section>
            <h2>Start with the exact Chrome Web Store listing</h2>
            <p>
              Copy the extension&apos;s detail URL, then check its name and publisher. A display
              name alone is easy to confuse with another listing. Our
              <a href="/blog/find-chrome-extension-id"> extension ID guide</a> shows where to
              find the 32-character identifier.
            </p>
            <p>
              We used <a href={storeUrl} rel="noopener noreferrer">uBlock Origin Lite</a>, an
              <a href="https://github.com/gorhill/uBlock/tree/master/platform/mv3" rel="noopener noreferrer"> open source extension</a> by
              Raymond Hill. Its Chrome Web Store ID is <code>ddkjiahejlhfcafbddmgiahcphecmpfh</code>.
              Keep the full URL as well as the ID. For an Edge package, follow our
              <a href="/blog/download-edge-extension-crx"> Edge Add-ons download guide</a> and
              record Microsoft Edge Add-ons as the source.
            </p>
          </section>

          <section id="package-version">
            <h2>Download the CRX and confirm its version</h2>
            <ol className="article-steps">
              <li>Open the <a href="/#tool">CRX downloader</a> and paste the public listing URL.</li>
              <li>Click <b>Parse extension</b> and compare the store, ID, and publisher with the listing.</li>
              <li>Choose <b>Download CRX</b> to preserve the package as received.</li>
              <li>Keep that file unchanged. Use a CRX-aware extractor on a copy to read its ZIP payload and <code>manifest.json</code>.</li>
            </ol>
            <p>
              Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/reference/manifest/version" rel="noopener noreferrer">manifest version documentation</a> identifies
              <code> version</code> as the release number used for updates.
              <code> version_name</code>, when present, is a display label. Record the actual
              package version. Don&apos;t infer it from the filename or a result that says Latest.
            </p>
            <p>
              Metadata and downloads happen separately, so they can differ after a publisher&apos;s
              update. If you use CRXFile&apos;s <b>Download source .zip</b> option to read the manifest,
              check that it corresponds to your saved CRX before treating both as one snapshot.
              Extracting the same CRX avoids that uncertainty. Simply renaming it to ZIP isn&apos;t
              a dependable extraction method.
            </p>
            <p>
              If a download fails, copy the detail URL again and confirm the selected store.
              A successful parse doesn&apos;t prove that a package is available. A 204 No Content
              response supplies no package and doesn&apos;t tell you why. If the saved file is
              empty or won&apos;t extract, don&apos;t add it to your backup inventory. Check the
              listing, retry a temporary failure later, and inspect the replacement file.
            </p>
          </section>

          <section>
            <h2>A tested Chrome extension backup record</h2>
            <p>
              On October 12, 2026, we checked the tool in Chrome 154.0.8037.94 on macOS and
              downloaded the example through CRXFile&apos;s live CRX route. We extracted that
              file&apos;s ZIP payload, read its manifest, and checked the archive for damaged
              entries. It was a CRX3 package using Manifest V3.
            </p>
            <p>
              Use this record as a model, or
              <a href="/templates/chrome-extension-backup-record.csv" download> download the blank CSV backup template</a>.
              Keep one row per snapshot.
              Enter your own values; another download may return a different package or checksum.
              The filename below is the label we assigned to our saved copy.
            </p>
            <div className="format-table backup-record" role="region" aria-label="Tested Chrome extension package backup record" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">Field</th><th scope="col">Recorded value</th></tr></thead>
                <tbody>
                  <tr><th scope="row">Store URL</th><td><a href={storeUrl} rel="noopener noreferrer">{storeUrl}</a></td></tr>
                  <tr><th scope="row">Extension ID</th><td><code>ddkjiahejlhfcafbddmgiahcphecmpfh</code></td></tr>
                  <tr><th scope="row">Package version</th><td><code>2026.1006.1931</code></td></tr>
                  <tr><th scope="row">Capture date (UTC)</th><td><code>2026-10-12</code></td></tr>
                  <tr><th scope="row">CRX filename</th><td><code>ublock-origin-lite_2026.1006.1931_2026-10-12.crx</code></td></tr>
                  <tr><th scope="row">File size</th><td>9,672,935 bytes</td></tr>
                  <tr><th scope="row">SHA-256</th><td><code>6ee81f9e71a1fa1d1bd6fdfc41f14cfa739bdb68e6ee137bf529907aafdd7308</code></td></tr>
                </tbody>
              </table>
            </div>
            <p>
              The archive opened successfully. We didn&apos;t audit its security or verify its
              CRX signature. The hash identifies the bytes we saved; it doesn&apos;t certify
              the publisher or the code.
            </p>
          </section>

          <section>
            <h2>Calculate a SHA-256 checksum</h2>
            <p>
              Calculate the checksum after your CRX file backup finishes downloading, then save
              the output with the record. Replace <code>extension.crx</code> below with your
              actual filename.
            </p>
            <p>On macOS:</p>
            <pre className="article-code"><code>{'shasum -a 256 "extension.crx"'}</code></pre>
            <p>On Linux:</p>
            <pre className="article-code"><code>{'sha256sum "extension.crx"'}</code></pre>
            <p>In Windows PowerShell:</p>
            <pre className="article-code"><code>{'Get-FileHash -Algorithm SHA256 -LiteralPath ".\\extension.crx"'}</code></pre>
            <p>
              These commands read the file without installing the extension. After copying it
              to another drive, run the command again and compare the entire hash. A match lets
              you check that the copied bytes haven&apos;t changed. It doesn&apos;t verify a CRX
              signature or establish that the original download was trustworthy.
            </p>
          </section>

          <section>
            <h2>Store each snapshot in its own folder</h2>
            <p>
              Name the folder with the extension ID, package version, and capture date. Put
              the original CRX, record, and checksum inside. Keep extracted source in a separate
              subfolder so your edits can&apos;t be mistaken for the untouched package.
            </p>
            <p>
              Don&apos;t overwrite yesterday&apos;s file with today&apos;s download. Separate
              snapshots let you compare extension packages later. Keep a second copy on another
              drive or in storage you control, then verify its hash. Note why you captured the
              package, such as a permission review or compatibility investigation.
            </p>
          </section>

          <section>
            <h2>Know what you can restore</h2>
            <p>
              The package contains distributed code and assets. Your personal rules, saved
              sessions, and other runtime data need a separate backup. If the extension has an
              export function, use it for those settings. Handle exports containing personal
              information according to your storage requirements.
            </p>
            <p>
              A downloaded CRX doesn&apos;t guarantee offline installation. Chrome&apos;s
              <a href="https://developer.chrome.com/docs/extensions/how-to/distribute" rel="noopener noreferrer"> distribution rules</a> restrict
              installation outside the Web Store, and managed browsers may impose further
              policies. For everyday use, install through the official listing. Test an unpacked
              copy only for authorized development where your browser and policies support it.
            </p>
          </section>

          <section>
            <h2>Keep the backup useful after an update</h2>
            <p>
              Chrome checks for updates to installed extensions, as its
              <a href="https://developer.chrome.com/docs/extensions/develop/concepts/extensions-update-lifecycle" rel="noopener noreferrer"> update lifecycle guide</a> explains.
              A CRX on disk stays unchanged. Saving one doesn&apos;t pin the installed extension
              to that version.
            </p>
            <p>
              Capture another snapshot when your review needs a newer release, with its own
              record and checksum. If a listing becomes private or disappears, CRXFile can&apos;t
              retrieve a withdrawn package or reconstruct a version you never saved. Leave
              failed downloads out of your inventory until you&apos;ve checked the files.
            </p>
            <p>
              Before relying on a backup, open its record and confirm the source URL, ID,
              package version, date, filename, and checksum. Recheck the hash. You should be
              able to tell exactly which package you saved without downloading it again.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
