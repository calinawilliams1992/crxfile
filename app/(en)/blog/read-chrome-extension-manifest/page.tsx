import type { Metadata } from "next";
import { PackageCheck } from "lucide-react";
import { SiteFooter } from "@/app/components/SiteFooter";
import { blogPostDate, blogPostUrl, chromeExtensionManifestPost } from "@/lib/blog";
import sampleManifest from "@/examples/source-review-demo/manifest.json";

const url = blogPostUrl(chromeExtensionManifestPost);
const { publishedAt, modifiedAt, title, description } = chromeExtensionManifestPost;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: chromeExtensionManifestPost.path },
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

export default function ReadChromeExtensionManifestPage() {
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
            <span aria-current="page">Read a Manifest</span>
          </nav>

          <header className="article-header">
            <p className="article-kicker">Chrome Extension Manifest JSON</p>
            <h1>{title}</h1>
            <p className="article-dek">
              Open manifest.json first. It tells you which files Chrome loads, what access
              the extension requests, and which package version you&apos;re reviewing.
            </p>
            <p className="article-meta">
              By CRXFile · Published <time dateTime={publishedAt}>{blogPostDate(publishedAt)}</time> · {chromeExtensionManifestPost.readingMinutes} min read
            </p>
          </header>

          <aside className="article-summary" aria-label="Quick answer">
            <strong>Quick answer</strong>
            <p>
              To read a Chrome extension manifest JSON file, check <code>manifest_version</code>{" "}and
              <code> version</code>, compare permissions with site access, then follow
              <code> background</code>{" "}and <code>content_scripts</code>{" "}into the named files.
              You can do this in a text editor without installing the extension. Treat the
              manifest as a reading guide: you still need the scripts to understand actual behavior.
            </p>
          </aside>

          <section>
            <h2>Where to find manifest.json</h2>
            <p>
              Chrome requires <code>manifest.json</code>{" "}at the root of every extension,
              as its <a href="https://developer.chrome.com/docs/extensions/reference/manifest" rel="noopener noreferrer">manifest reference</a>{" "}explains.
              If you downloaded a ZIP source package, extract it and open that file as text.
              Don&apos;t edit your only copy.
            </p>
            <p>
              Need the package first? Paste a public store URL into <a href="/#tool">CRXFile</a>{" "}and
              choose Download source .zip. Our <a href="/blog/view-chrome-extension-source-without-installing">source inspection guide</a>{" "}covers
              extraction. CRXFile fetches currently available public packages; it doesn&apos;t
              provide a local file uploader, an online manifest viewer, or historical versions.
            </p>
            <p>
              Check <code>name</code>{" "}against the listing you intended to download. If it
              contains a placeholder such as <code>__MSG_extensionName__</code>, look in
              <code> _locales</code>{" "}and use <code>default_locale</code>{" "}to find the default
              translation. Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/reference/api/i18n" rel="noopener noreferrer">localization reference</a>{" "}explains
              these placeholders. Keep the store URL
              and extension ID with it, because different publishers can use similar names.
            </p>
          </section>

          <section>
            <h2>A Chrome extension manifest example</h2>
            <p>
              This is the complete manifest from our original <a href="/examples/source-review-demo.zip" download>Source Review Demo ZIP</a>.
              The sample saves the title of an example.com page and displays it in a popup.
              We put the annotations below the JSON so you can copy valid JSON without comments
              or trailing commas.
            </p>
            <p>
              Chrome requires <code>name</code>{" "}alongside the two version fields. A Chrome
              Web Store submission also needs a <code>description</code>{" "}and
              <code> icons</code>. We left them out of this demo because it isn&apos;t a store
              submission.
            </p>
            <pre className="article-code" aria-label="Source Review Demo Manifest V3 manifest.json"><code>{JSON.stringify(sampleManifest, null, 2)}</code></pre>
            <div className="format-table" role="region" aria-label="Annotated Chrome extension manifest fields" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">Field</th><th scope="col">How to read this example</th></tr></thead>
                <tbody>
                  <tr><th scope="row">manifest_version</th><td>The number <code>3</code>{" "}selects the Manifest V3 format.</td></tr>
                  <tr><th scope="row">version</th><td>The string <code>1.0.0</code>{" "}identifies this release of the demo.</td></tr>
                  <tr><th scope="row">permissions</th><td><code>storage</code>{" "}requests access to Chrome&apos;s extension storage API.</td></tr>
                  <tr><th scope="row">background</th><td>Chrome runs <code>worker.js</code>{" "}as the extension&apos;s service worker.</td></tr>
                  <tr><th scope="row">content_scripts</th><td>Chrome loads <code>content.js</code>{" "}on pages matching the listed HTTPS host.</td></tr>
                  <tr><th scope="row">action</th><td><code>popup.html</code>{" "}opens when the user clicks the toolbar action.</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              We checked this teaching sample&apos;s JSON and referenced files on October 18,
              2026. This was a static file check, without installing it in Chrome.
            </p>
          </section>

          <section>
            <h2>manifest_version vs version</h2>
            <p>
              These fields answer different questions. <code>manifest_version</code>{" "}is a number
              identifying Chrome&apos;s manifest format. <code>version</code>{" "}is the extension&apos;s
              release string. An extension can use Manifest V3 and have version <code>12.4.0</code>.
            </p>
            <p>
              Save <code>version</code>{" "}in your review notes. Chrome accepts one to four
              dot-separated integers here, and uses them for update comparisons. An optional
              <code> version_name</code>{" "}such as <code>1.0 beta</code>{" "}is a display label.
              See Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/reference/manifest/version" rel="noopener noreferrer">version rules</a>{" "}if
              a downloaded package and its store listing appear to disagree.
            </p>
          </section>

          <section id="permissions">
            <h2>Read permissions alongside site access</h2>
            <p>
              Start with <code>permissions</code>. In the demo, <code>storage</code>{" "}matches the
              code that saves a page title. For another package, find each requested API in
              the scripts and ask which feature needs it.
            </p>
            <p>
              Then check <code>host_permissions</code>{" "}and <code>content_scripts.matches</code>.
              API permissions and website access are separate parts of the review.
              A declared content script can run on its matching pages without a duplicate
              <code> host_permissions</code>{" "}entry. Our demo does exactly that.
            </p>
            <p>
              Read the host patterns literally. Access to <code>https://example.com/*</code>{" "}is
              narrower than <code>https://*/*</code>. For broad patterns, write down the
              feature that needs them and follow the relevant code. Users can withhold site
              access, as the <a href="https://developer.chrome.com/docs/extensions/reference/api/permissions" rel="noopener noreferrer">permissions API reference</a>{" "}describes, so
              declared access and currently granted access may differ.
            </p>
            <p>
              Optional access goes in <code>optional_permissions</code>{" "}or
              <code> optional_host_permissions</code>{" "}and requires a runtime grant.
              <code> activeTab</code>{" "}provides temporary access after a qualifying user action.
              Neither a short permission list nor broad access proves how an extension uses data.
              Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions" rel="noopener noreferrer">permission guide</a>{" "}and
              <a href="https://developer.chrome.com/docs/extensions/develop/concepts/activeTab" rel="noopener noreferrer"> activeTab reference</a>{" "}explain
              those distinctions.
            </p>
          </section>

          <section>
            <h2>Find the background service worker</h2>
            <p>
              Follow <code>background.service_worker</code>{" "}to its JavaScript file. In Manifest V3,
              this is an event handler that Chrome can start when needed and stop when idle.
              Don&apos;t assume it runs continuously.
            </p>
            <p>
              Open <code>worker.js</code>{" "}in the demo and find the message listener and storage
              write. In a larger extension, follow imports and look for installation handlers,
              alarms, and network calls. A <code>type</code>{" "}value of <code>module</code>{" "}in
              the background object permits static JavaScript imports. Chrome documents
              <a href="https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/basics" rel="noopener noreferrer"> worker registration</a>{" "}and
              the <a href="https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle" rel="noopener noreferrer">worker lifecycle</a>{" "}separately.
            </p>
          </section>

          <section>
            <h2>Check where content scripts run</h2>
            <p>
              Read each <code>content_scripts</code>{" "}entry as a rule connecting files to pages.
              Our <code>https://example.com/*</code>{" "}match covers HTTPS paths on that exact
              host. It doesn&apos;t include its subdomains or HTTP pages. Chrome&apos;s
              <a href="https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns" rel="noopener noreferrer"> match pattern guide</a>{" "}explains
              wildcards and <code>&lt;all_urls&gt;</code>.
            </p>
            <p>
              Check <code>js</code>{" "}and <code>css</code>{" "}for the files to open. Then read
              <code> run_at</code>{" "}and <code>all_frames</code>. If omitted, the defaults are
              <code> document_idle</code>{" "}and <code>false</code>: injection after the DOM is
              complete, in the top frame. Extensions can also register or inject scripts
              programmatically, so search for <code>chrome.scripting</code>{" "}before treating
              this list as complete. The <a href="https://developer.chrome.com/docs/extensions/reference/manifest/content-scripts" rel="noopener noreferrer">content script reference</a>{" "}covers
              these settings.
            </p>
          </section>

          <section>
            <h2>Follow the remaining file paths</h2>
            <p>
              Open <code>action.default_popup</code>{" "}as text, then read the scripts that HTML
              file loads. Check <code>options_ui.page</code>{" "}and
              <code> side_panel.default_path</code>{" "}if present. Paths are relative to the
              extension root, so a missing file deserves a note.
            </p>
            <p>
              Two less familiar fields also deserve attention.
              <a href="https://developer.chrome.com/docs/extensions/reference/manifest/web-accessible-resources" rel="noopener noreferrer"> Web-accessible resources</a>{" "}declare
              packaged files that matching web pages or extensions can access.
              <a href="https://developer.chrome.com/docs/extensions/reference/manifest/content-security-policy" rel="noopener noreferrer"> Content security policy</a>{" "}restricts
              resource loading and script execution in extension contexts. Neither field
              substitutes for reading the code.
            </p>
          </section>

          <section>
            <h2>Keep notes tied to the package</h2>
            <p>
              Record the extension ID, <code>version</code>, review date, and unresolved
              questions. Our <a href="/blog/backup-chrome-extension-package">package backup workflow</a>{" "}includes
              a record template. For each question, name the manifest field and the file you
              need to read next. That makes a note like &ldquo;Why this host?&rdquo; useful to
              the next reviewer, even after the extension updates.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
