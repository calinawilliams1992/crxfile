import type { Metadata } from "next";
import { PackageCheck } from "lucide-react";
import { SiteFooter } from "@/app/components/SiteFooter";

const url = "https://www.crxfile.xyz/blog/download-edge-extension-crx";
const publishedAt = "2026-10-11T00:00:00.000Z";
const title = "How to Get a CRX from Microsoft Edge Add-ons";
const description =
  "Download an Edge extension CRX or ZIP from Microsoft Edge Add-ons. Follow a tested store URL example, check the package version, and fix common download errors.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog/download-edge-extension-crx" },
  openGraph: {
    type: "article",
    url,
    title,
    description,
    siteName: "CRXFile",
    publishedTime: publishedAt,
    modifiedTime: publishedAt,
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
  dateModified: publishedAt,
  mainEntityOfPage: url,
  inLanguage: "en",
  author: { "@type": "Organization", name: "CRXFile" },
  publisher: { "@type": "Organization", name: "CRXFile", url: "https://www.crxfile.xyz" },
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

export default function DownloadEdgeExtensionCrxPage() {
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
            <span>Download an Edge Extension CRX</span>
          </nav>

          <header className="article-header">
            <p className="article-kicker">Microsoft Edge Extension Guide</p>
            <h1>{title}</h1>
            <p className="article-dek">
              To download an Edge extension CRX, copy its Microsoft Edge Add-ons listing URL,
              paste it into CRXFile, and choose Download CRX after parsing. You don&apos;t need
              to install the extension first.
            </p>
            <p className="article-meta">Published <time dateTime="2026-10-11">October 11, 2026</time> · 5 min read</p>
          </header>

          <aside className="article-summary" aria-label="Quick answer">
            <strong>Quick answer</strong>
            <p>
              Use <a href="/#tool">CRXFile</a>{" "}to save a currently public Edge package for backup
              or review. Choose CRX to keep the packaged file, or ZIP to read the extension&apos;s
              files in an editor. The complete store URL is the easiest input because it identifies
              Microsoft Edge Add-ons automatically. A downloaded package doesn&apos;t guarantee
              that your browser will install it, and CRXFile can&apos;t retrieve private or removed
              packages. For everyday use, install through the official store listing.
            </p>
          </aside>

          <section>
            <h2>Copy the Microsoft Edge Add-ons URL</h2>
            <p>
              Open the extension&apos;s detail page in <a href="https://microsoftedge.microsoft.com/addons/" rel="noopener noreferrer">Microsoft Edge Add-ons</a>.
              Check the name and publisher, then copy the address bar URL. A search results page
              or publisher homepage won&apos;t identify the package you want.
            </p>
            <p>
              We used the public <a href="https://microsoftedge.microsoft.com/addons/detail/ublock-origin/odfafepnkmbhccpbejgmiehpchacaeak" rel="noopener noreferrer">uBlock Origin listing</a> for
              this walkthrough. Its <a href="https://github.com/gorhill/uBlock" rel="noopener noreferrer">open source project</a> links
              to the same Edge listing. Copy the last URL segment to get its 32-character Edge extension ID.
            </p>
            <div className="id-example" role="group" aria-label="uBlock Origin Edge Add-ons URL and extension ID">
              <span>Store URL</span>
              <code>https://microsoftedge.microsoft.com/addons/detail/ublock-origin/<wbr />odfafepnkmbhccpbejgmiehpchacaeak</code>
              <span>Edge extension ID</span>
              <code>odfafepnkmbhccpbejgmiehpchacaeak</code>
            </div>
            <p>
              You can paste that ID alone, but select Microsoft Edge Add-ons in the tool first.
              If you also work with Chrome listings, our <a href="/blog/find-chrome-extension-id">extension ID guide</a> explains
              how to separate an ID from a readable name or version number.
            </p>
          </section>

          <section>
            <h2>Download the Edge extension CRX with CRXFile</h2>
            <ol className="article-steps">
              <li>Open the <a href="/#tool">CRX downloader</a> and paste the full Edge Add-ons URL into the input field.</li>
              <li>Click Parse extension. Check that the result says Microsoft Edge Add-ons and that its ID matches the listing.</li>
              <li>Compare the name and developer with the store page. For our example, the result showed uBlock Origin and Raymond Hill (gorhill).</li>
              <li>Click Download CRX, then check that your saved file ends in <code>.crx</code>. Choose Download source .zip if you want extractable files.</li>
            </ol>
            <p>
              Keep the store URL alongside the file. A filename is easy to rename, so it&apos;s
              a poor record of where a package came from. CRXFile needs no account and downloads
              the package available from the official endpoint at the time of your request.
              It doesn&apos;t offer a historical version library.
            </p>
          </section>

          <section>
            <h2>Choose CRX or ZIP for your task</h2>
            <p>
              Download CRX when you need to retain the Edge extension package as received.
              A CRX includes package headers around its ZIP payload. Saving it is useful for
              a permitted backup or later package comparison, though the saved file won&apos;t
              update itself when the publisher releases a new version.
            </p>
            <p>
              For an Edge extension ZIP download, choose Download source .zip. CRXFile removes
              the CRX header and returns the files inside the package. Extract the ZIP and start
              with <code>manifest.json</code>, then follow the scripts it names. These are the
              distributed files, which may contain compressed JavaScript or build output.
              They aren&apos;t necessarily the developer&apos;s original project files.
            </p>
          </section>

          <section>
            <h2>What our real Edge download returned</h2>
            <p>
              We checked this workflow on October 11, 2026, using Chrome 154.0.8037.94 on macOS
              for the tool interface and separate requests to CRXFile&apos;s live download routes
              to inspect the files. Both downloads returned HTTP 200.
            </p>
            <div className="format-table" role="region" aria-label="Verified Edge extension download results" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">Check</th><th scope="col">Observed result</th></tr></thead>
                <tbody>
                  <tr><th scope="row">CRX package</th><td>CRX3, 4,600,286 bytes</td></tr>
                  <tr><th scope="row">ZIP source</th><td>4,598,964 bytes, matching the CRX&apos;s ZIP payload</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              CRXFile displayed Latest without a release number. We opened the ZIP&apos;s
              <code> manifest.json</code> to check the actual package and found these fields.
              Each value answers a different question.
            </p>
            <div className="id-example" role="group" aria-label="Fields verified in the downloaded Edge extension manifest">
              <span>The extension&apos;s label</span>
              <code>{'"name": "uBlock Origin"'}</code>
              <span>The downloaded release number</span>
              <code>{'"version": "2026.916.75.0"'}</code>
              <span>The manifest format used by this package</span>
              <code>{'"manifest_version": 2'}</code>
            </div>
            <p>
              These values describe our October 11 test. You may receive a different release
              after an update. Our checks cover file structure only. We didn&apos;t audit the
              extension&apos;s security or verify its signature.
            </p>
          </section>

          <section>
            <h2>Edge Add-ons and Chrome Web Store use different sources</h2>
            <p>
              CRXFile selects the download source from the listing URL. An Edge Add-ons URL
              selects Microsoft&apos;s endpoint, while a Chrome Web Store URL selects Google&apos;s.
              You can open the downloader in either browser. Microsoft documents both endpoints in its
              <a href="https://learn.microsoft.com/en-us/deployedge/microsoft-edge-manage-extensions-faq" rel="noopener noreferrer"> extension update URL FAQ</a>.
              Don&apos;t assume that matching extension names mean the listings have the same
              ID, version, or package contents.
            </p>
            <p>
              If your extension comes from Google&apos;s store, follow the
              <a href="/blog"> Chrome Web Store CRX download guide</a>{" "}and use that listing&apos;s
              URL, even when you normally browse in Edge.
            </p>
          </section>

          <section>
            <h2>What to check when an Edge CRX download fails</h2>
            <p>
              Start with the input. Open the official listing again and copy its detail URL.
              For an ID-only request, remove spaces and URL punctuation, and confirm the store
              selector says Microsoft Edge Add-ons. Then compare the parsed ID with the listing.
              A result card by itself doesn&apos;t prove that a package is downloadable.
            </p>
            <p>
              A 204 No Content response means the update endpoint returned no package for that
              request. It doesn&apos;t explain why. A 403 or 404 response, a timeout, or a
              removed listing also needs checking against the original store page. Retry a
              temporary failure later. CRXFile can&apos;t bypass private access or restore a
              withdrawn package, and it doesn&apos;t fetch Firefox XPI files.
            </p>
          </section>

          <section>
            <h2>Can you install the downloaded CRX in Edge?</h2>
            <p>
              For ordinary installation, use the official listing. Local CRX installation can
              depend on your platform, browser version, and organization&apos;s policies.
              Downloading the file doesn&apos;t remove those restrictions.
            </p>
            <p>
              For authorized development testing, Microsoft&apos;s
              <a href="https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading" rel="noopener noreferrer"> sideloading guide</a> describes
              Developer mode and Load unpacked in <code>edge://extensions</code>. Extract a ZIP
              first and select the directory containing <code>manifest.json</code>. Browser
              support for the package&apos;s manifest version still matters. Check the
              <a href="/#faq"> download FAQ</a>{" "}for more package limits, and keep the
              publisher&apos;s license with any files you retain or share.
            </p>
          </section>

          <section>
            <h2>Sources</h2>
            <p>
              Microsoft&apos;s <a href="https://learn.microsoft.com/en-us/deployedge/microsoft-edge-manage-extensions-faq" rel="noopener noreferrer">extension FAQ</a> identifies
              the store update endpoints. Its <a href="https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading" rel="noopener noreferrer">local testing guide</a> documents
              Load unpacked. The <a href="https://github.com/gorhill/uBlock" rel="noopener noreferrer">uBlock Origin project</a> links
              to our example listing and includes its license. The download results above come
              from our live CRXFile checks.
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
