import type { Metadata } from "next";
import { PackageCheck } from "lucide-react";
import { SiteFooter } from "@/app/components/SiteFooter";
import { blogPostDate, blogPostUrl, extensionSourceReviewPost } from "@/lib/blog";
import sampleManifest from "@/examples/source-review-demo/manifest.json";

const url = blogPostUrl(extensionSourceReviewPost);
const { publishedAt, modifiedAt, title, description } = extensionSourceReviewPost;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: extensionSourceReviewPost.path },
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

export default function InspectExtensionSourcePage() {
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
            <span aria-current="page">Inspect Extension Source</span>
          </nav>

          <header className="article-header">
            <p className="article-kicker">Extension Source Inspection</p>
            <h1>{title}</h1>
            <p className="article-dek">
              To view Chrome extension source without installing it, download the ZIP package
              and open the extracted files in a text editor. Start with manifest.json.
            </p>
            <p className="article-meta">
              By CRXFile · Published <time dateTime={publishedAt}>{blogPostDate(publishedAt)}</time> · {extensionSourceReviewPost.readingMinutes} min read
            </p>
          </header>

          <aside className="article-summary" aria-label="Quick answer">
            <strong>Quick answer</strong>
            <p>
              For a public Chrome Web Store listing, <a href="/#tool">CRXFile</a>{" "}can retrieve
              the current package and extract its ZIP payload. Reading those files doesn&apos;t
              require Add to Chrome, Developer mode, or Load unpacked. This is useful when
              you want to check an extension&apos;s permissions before using it, or understand
              how one feature works. CRXFile provides the download, not an online source code
              viewer or a security scan. The review happens in your editor, and readable code
              alone doesn&apos;t prove an extension is safe.
            </p>
          </aside>

          <section>
            <h2>Download the extension source as a ZIP</h2>
            <ol className="article-steps">
              <li>Copy the extension&apos;s public Chrome Web Store URL. Check the publisher and use our <a href="/blog/find-chrome-extension-id">extension ID guide</a>{" "}if two listings look alike.</li>
              <li>Paste the URL into <a href="/#tool">CRXFile</a>{" "}and click Parse extension.</li>
              <li>Check the returned details, then choose Download source .zip.</li>
              <li>Extract the archive into a new folder and open that folder in a text editor. Open HTML files as text, too.</li>
            </ol>
            <p>
              Already have a CRX? Use a CRX-aware extractor on a copy. Renaming the file to
              <code> .zip</code>{" "}can fail because a CRX includes a header before its archive
              payload. CRXFile&apos;s ZIP option handles that extraction for packages it retrieves.
              It doesn&apos;t accept local CRX uploads.
            </p>
            <p>
              A private or removed listing may be unavailable. CRXFile can only fetch packages
              the official endpoint currently exposes, and it has no historical version library.
            </p>
          </section>

          <section id="start-with-manifest">
            <h2>Use manifest.json to find the entry files</h2>
            <p>
              Don&apos;t start with the largest JavaScript file. Open <code>manifest.json</code>{" "}first.
              Chrome requires it at the extension&apos;s root, as the
              <a href="https://developer.chrome.com/docs/extensions/reference/manifest" rel="noopener noreferrer"> manifest reference</a>{" "}explains.
              Record <code>version</code>, then find the files Chrome loads.
            </p>
            <p>
              If the fields are unfamiliar, our <a href="/blog/read-chrome-extension-manifest">guide to reading a Chrome extension manifest</a>{" "}explains
              the version fields, permissions, service worker, and content script matches
              using the same sample below.
            </p>
            <p>
              We made a small <a href="/examples/source-review-demo.zip" download>Source Review Demo ZIP</a>{" "}for
              this exercise. It&apos;s an original teaching sample, not a store download. Extract
              it and read along without installing anything. We checked its file paths and
              message flow on October 13, 2026, without a browser installation. Here is its full manifest:
            </p>
            <pre className="article-code" aria-label="Source Review Demo manifest.json"><code>{JSON.stringify(sampleManifest, null, 2)}</code></pre>
            <p>
              The <code>manifest_version</code>{" "}value identifies the manifest format.
              <code> version</code>{" "}identifies this sample&apos;s release. Mixing them up makes
              review notes confusing later.
            </p>
            <div className="format-table" role="region" aria-label="Manifest entries and files to inspect" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">Manifest entry</th><th scope="col">Where to read next</th></tr></thead>
                <tbody>
                  <tr><th scope="row">background.service_worker</th><td><code>worker.js</code>: background event and message handlers.</td></tr>
                  <tr><th scope="row">content_scripts</th><td><code>content.js</code>: code for pages matching <code>https://example.com/*</code>.</td></tr>
                  <tr><th scope="row">action.default_popup</th><td><code>popup.html</code>, then the <code>popup.js</code>{" "}script it loads.</td></tr>
                  <tr><th scope="row">permissions</th><td>The sample requests <code>storage</code>. Find the code that uses it.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>Follow one feature through the scripts</h2>
            <p>
              In the demo, <code>content.js</code>{" "}reads <code>document.title</code>{" "}and sends a
              <code> PAGE_TITLE</code>{" "}message. Search for that exact string in
              <code> worker.js</code>. The listener checks the sender and message, then writes
              the title to <code>chrome.storage.local</code>. Finally, <code>popup.js</code>{" "}reads
              the saved value and displays it using <code>textContent</code>.
            </p>
            <p>
              You can trace the whole feature on disk: page title, message, local storage, popup.
              Pick one feature you care about in a real package and follow it the same way.
              Reading every file alphabetically is a slow way to find out where a single value goes.
            </p>
            <p>
              Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts" rel="noopener noreferrer">content script documentation</a>{" "}covers
              code that interacts with web pages. Its
              <a href="https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/basics" rel="noopener noreferrer"> service worker guide</a>{" "}explains
              the background entry point. Other extensions may use options pages, side panels,
              or scripts registered through <code>chrome.scripting</code>, so the manifest&apos;s
              static content-script list isn&apos;t always the whole story.
            </p>
          </section>

          <section>
            <h2>Check permissions against actual data use</h2>
            <p>
              Read <code>permissions</code>, <code>host_permissions</code>, and any optional
              permission fields. Compare them with the feature you traced. Our demo asks for
              storage and uses it to save one title. Its content script targets one example
              host. If a real extension requests <code>&lt;all_urls&gt;</code>, ask which feature
              needs access across so many sites, then look for its implementation.
            </p>
            <p>
              Broad permissions don&apos;t establish malicious intent. Missing
              <code> host_permissions</code>{" "}doesn&apos;t establish that a package cannot interact
              with websites, either. Read the content-script matches and the code together.
              Google&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions" rel="noopener noreferrer">permission documentation</a>{" "}distinguishes
              API permissions, host access, and permissions requested later.
            </p>
          </section>

          <section>
            <h2>Search for network calls and bundled code</h2>
            <p>
              Use your editor&apos;s folder search for <code>fetch(</code>,
              <code> XMLHttpRequest</code>, <code>WebSocket</code>, and <code>https://</code>.
              For each result, check the destination and the data being sent. A request that
              retrieves public settings needs a different review from one that sends page text.
              Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/network-requests" rel="noopener noreferrer">network request guide</a>{" "}explains
              how extension pages and content scripts differ.
            </p>
            <p>
              Expect false leads. A URL might be a documentation link, and a network call may
              hide behind a helper or a constructed string. A search with no matches isn&apos;t
              a clean bill of health.
            </p>
            <p>
              Minified JavaScript is harder to follow. Format a copy in your editor, check for
              bundled source maps, and look for license files that identify third-party libraries.
              Formatting restores spacing, not the author&apos;s original variable names or comments.
              A downloaded ZIP contains the shipped files, which may differ from the publisher&apos;s
              original TypeScript or repository source.
            </p>
            <p>
              If a public repository exists, compare its release tag and build instructions with
              the package version. A familiar project name alone doesn&apos;t tell you whether
              you&apos;re reading the code that was actually shipped.
            </p>
          </section>

          <section>
            <h2>Keep a record of what you could verify</h2>
            <p>
              Save the store URL, extension ID, package version, and review date with your notes.
              Our <a href="/blog/backup-chrome-extension-package">extension backup workflow</a>{" "}includes
              a record template and checksum commands. Findings apply to that saved version.
            </p>
            <p>
              Static inspection can show which files request access and how a visible code path
              handles data. It cannot establish every runtime behavior, inspect a remote server&apos;s
              internals, or predict the next update. If you need runtime evidence, plan a separate
              test in an isolated browser profile.
            </p>
            <p>
              For an unresolved call, write down the filename, function, destination, and the
              question you still need answered. That gives the next reviewer somewhere concrete
              to start.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
