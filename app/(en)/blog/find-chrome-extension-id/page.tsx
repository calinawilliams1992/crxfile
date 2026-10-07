import type { Metadata } from "next";
import { PackageCheck } from "lucide-react";
import { SiteFooter } from "@/app/components/SiteFooter";

const url = "https://www.crxfile.xyz/blog/find-chrome-extension-id";
const publishedAt = "2026-10-07T00:00:00.000Z";
const title = "How to Find a Chrome Extension ID";
const description =
  "Find a Chrome extension ID in its Web Store URL or in chrome://extensions. See a real 32-character example, check common mistakes, and learn what an ID identifies.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog/find-chrome-extension-id" },
  openGraph: {
    type: "article",
    url,
    title,
    description,
    siteName: "CRXFile",
    publishedTime: publishedAt,
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

export default function FindChromeExtensionIdPage() {
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
            <span>Find a Chrome Extension ID</span>
          </nav>

          <header className="article-header">
            <p className="article-kicker">Chrome Extension Guide</p>
            <h1>{title}</h1>
            <p className="article-dek">
              Need the identifier for a store listing, an installed add-on, or an extension inventory?
              Here are the two quickest places to look and a way to check that you copied the right thing.
            </p>
            <p className="article-meta">Published <time dateTime="2026-10-07">October 7, 2026</time> · 5 min read</p>
          </header>

          <aside className="article-summary" aria-label="Quick answer">
            <strong>Quick answer</strong>
            <p>
              Open the extension&apos;s Chrome Web Store listing and copy the 32-letter string at the end of its URL,
              after <code>/detail/</code> and any readable name. If the extension is already installed, open
              <code>chrome://extensions</code>, choose its <b>Details</b> page, and find <b>ID</b>.
              The ID identifies an extension; its display name and version are separate. A store ID is useful
              when you need to document the exact listing or enter it in a tool such as CRXFile. Check the
              store and publisher before using the ID for an approval or download decision.
            </p>
          </aside>

          <section>
            <h2>Find the ID in a Chrome Web Store URL</h2>
            <p>
              This method works even when you have not installed the extension. Open its listing in the
              <a href="https://chromewebstore.google.com/" rel="noopener noreferrer"> Chrome Web Store</a>
              and look at the address bar. A listing URL usually contains a readable slug followed by the
              extension ID. Copy only the final 32 letters; leave out a trailing slash, question mark, or
              language parameter. Google&apos;s <a href="https://developer.chrome.com/docs/extensions/how-to/distribute/install-extensions" rel="noopener noreferrer">extension distribution guide</a> also points to the Web Store URL as a place to find the ID.
            </p>
            <p>
              Here is a real example, checked against the public
              <a href="https://chromewebstore.google.com/detail/google-translate/aapbdbdomjkkjkaonfhkkikfgjllcleb" rel="noopener noreferrer"> Google Translate listing</a>
              on October 7, 2026:
            </p>
            <div className="id-example" role="group" aria-label="Google Translate extension URL and ID example">
              <span>Store URL</span>
              <code>chromewebstore.google.com/detail/google-translate/<wbr />aapbdbdomjkkjkaonfhkkikfgjllcleb</code>
              <span>Extension ID</span>
              <code>aapbdbdomjkkjkaonfhkkikfgjllcleb</code>
            </div>
            <p>
              The words <code>google-translate</code> make the URL easier to read. They are not the ID.
              A link may also end in something like <code>?hl=en-US</code>; that part controls the page URL,
              not the extension&apos;s identity. If you copied a search result instead of the actual listing,
              open the result first and use the destination address.
            </p>
          </section>

          <section>
            <h2>Find the ID of an installed extension in Chrome</h2>
            <ol className="article-steps">
              <li>Enter <code>chrome://extensions</code> in Chrome&apos;s address bar. You can also open the Extensions menu and choose <b>Manage extensions</b>.</li>
              <li>Locate the extension by its name and click <b>Details</b>. Read the <b>ID</b> field on that page and copy the complete string.</li>
              <li>If you are recording an extension for your team, compare its name and publisher with its official store listing before saving the ID.</li>
            </ol>
            <p>
              Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/reference/manifest/key" rel="noopener noreferrer">manifest key documentation</a> uses <code>chrome://extensions</code> to compare an installed extension&apos;s ID with the item in a developer&apos;s dashboard. Developer mode can also show IDs on extension cards, but the Details page is a straightforward place to inspect one extension at a time. The toolbar icon alone is not a reliable identifier: you may have several extensions with similar names or icons.
            </p>
          </section>

          <section>
            <h2>How to tell an extension ID from a name or version</h2>
            <p>
              A Chrome extension ID is a 32-character string. Chromium defines valid IDs using the letters
              <code> a</code> through <code>p</code>. That is a useful visual check, but a string that fits the
              pattern does not prove the extension exists or is still available. The Google Translate example
              above has 32 letters and ends in <code>cleb</code>; a copied URL slug such as
              <code> google-translate</code> has a different shape.
            </p>
            <p>
              The <b>name</b> is the human-readable label shown in Chrome and the store. The <b>version</b>
              is a separate value, usually a set of numbers such as <code>2.0.17</code>, that can change with
              an update. The ID lets you refer to a specific extension listing across those changes. Google&apos;s
              <a href="https://developer.chrome.com/docs/extensions/reference/manifest" rel="noopener noreferrer">manifest reference</a> describes name and version as separate fields.
            </p>
          </section>

          <section>
            <h2>Can you find the ID in manifest.json?</h2>
            <p>
              Usually, the easiest answer is no: open the store listing or <code>chrome://extensions</code>
              instead. A manifest must declare a name and version, but the published extension ID is not
              normally a plain <code>"id"</code> field you can copy from that file. Developers may include a
              <code> "key"</code> value to keep an ID consistent during development. That value is a public
              key, not the 32-letter ID itself. If you are reviewing a ZIP of extension files, do not guess
              the published ID from its folder name or its manifest. Match the package to an official listing
              or compare it with Chrome&apos;s installed extension details.
            </p>
          </section>

          <section>
            <h2>What if the ID you found does not work?</h2>
            <p>
              First check the length and remove spaces, URL punctuation, and query parameters. Then confirm
              you are looking at a <b>Chrome Web Store</b> listing rather than a Microsoft Edge Add-ons page.
              Both stores use extension IDs, but the same text should not be treated as proof that the two
              listings are equivalent. If you are using CRXFile, paste the full store URL to let the tool
              detect the store, or select the correct store before entering an ID by itself.
            </p>
            <p>
              An installed development build needs extra care. Unpacked extensions can acquire a different
              ID when loaded from another directory unless the developer takes steps to keep it stable.
              Compare the installed ID with the published listing instead of assuming they match. If a
              listing has been removed or restricted, a correctly copied ID may still fail to return a
              public package. An ID is an identifier, not a download guarantee or a security verdict.
            </p>
          </section>

          <section>
            <h2>Use the ID in your next step</h2>
            <p>
              Save the store URL alongside the ID when you are building an inventory; the URL gives you a
              quick route back to the publisher and listing details. To retrieve a currently public Chrome
              package for an authorized backup or review, enter that URL or ID in the
              <a href="/#tool"> CRXFile tool</a>. Choose CRX for the package or ZIP for its extractable
              files. Our <a href="/blog">Chrome Web Store CRX download guide</a> covers that workflow.
              For ordinary installation, return to the official store listing.
            </p>
          </section>

          <section>
            <h2>Sources</h2>
            <p>
              The example URL comes from the public Google Translate listing. The ID locations and
              development caveat are documented in Chrome&apos;s
              <a href="https://developer.chrome.com/docs/extensions/how-to/distribute/install-extensions" rel="noopener noreferrer"> distribution guide</a> and
              <a href="https://developer.chrome.com/docs/extensions/reference/manifest/key" rel="noopener noreferrer"> manifest key reference</a>.
              Chromium&apos;s <a href="https://chromium.googlesource.com/chromium/src/+/112.0.5615.165/extensions/common/extension_id.h" rel="noopener noreferrer">ID definition</a> specifies the 32-character format.
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
