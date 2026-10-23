import { readFileSync } from "node:fs";
import path from "node:path";
import demoManifest from "@/public/examples/content-script-trace/manifest.json";
import type { Metadata } from "next";
import { PackageCheck } from "lucide-react";
import { SiteFooter } from "@/app/components/SiteFooter";
import { blogPostDate, blogPostUrl, contentScriptInspectionPost } from "@/lib/blog";

const url = blogPostUrl(contentScriptInspectionPost);
const { publishedAt, modifiedAt, title, description } = contentScriptInspectionPost;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: contentScriptInspectionPost.path },
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

const contentScript = readFileSync(
  path.join(process.cwd(), "public/examples/content-script-trace/content.js"),
  "utf8"
).trimEnd();

export default function ContentScriptInspectionPage() {
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
            <span aria-current="page">Content Script Inspection</span>
          </nav>
          <header className="article-header">
            <p className="article-kicker">Inspect Chrome Extension Content Scripts</p>
            <h1>{title}</h1>
            <p className="article-dek">
              Follow a content script from its matching URLs to the exact page elements
              it reads or changes, then check where the data goes.
            </p>
            <p className="article-meta">
              By CRXFile · Published <time dateTime={publishedAt}>{blogPostDate(publishedAt)}</time> · {contentScriptInspectionPost.readingMinutes} min read
            </p>
          </header>
          <aside className="article-summary" aria-label="Quick answer">
            <strong>Quick answer</strong>
            <p>
              To inspect Chrome extension content scripts, open <code>manifest.json</code>{" "}and
              trace each <code>content_scripts</code>{" "}entry through its matching URLs
              and exclusions to the JavaScript files it actually loads on your chosen
              test page. Then follow the selectors. Look for the page
              content each script reads, the elements it changes, and any messages it
              sends elsewhere. Don&apos;t stop at the manifest: extensions can also register
              scripts dynamically or inject them after a click. You can do the first
              pass in an editor without installing anything. For runtime debugging,
              use a trusted extension on a test page and compare what actually runs
              with what the source led you to expect.
            </p>
          </aside>
          <section>
            <h2>Start with the content_scripts URL rules</h2>
            <p>
              Get a currently available public package through <a href="/#tool">CRXFile</a>{" "}and
              extract its ZIP. CRXFile retrieves packages; it doesn&apos;t provide a safety
              verdict. Our <a href="/blog/read-chrome-extension-manifest">manifest reading guide</a>{" "}explains
              the other entry points. For this walkthrough, use the original minimal
              Manifest V3 example below.
            </p>
            <pre className="article-code" aria-label="Complete content script tracing manifest"><code>{JSON.stringify(demoManifest, null, 2)}</code></pre>
            <p>
              Read <code>matches</code>{" "}together with <code>exclude_matches</code>.
              The exclusion removes private article paths from this rule. These four
              URLs make the boundary easier to check:
            </p>
            <div className="format-table" role="region" aria-label="Content script URL matching examples" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">URL</th><th scope="col">Eligible under this rule?</th></tr></thead>
                <tbody>
                  <tr><th scope="row">https://example.com/articles/intro</th><td>Yes, subject to Chrome&apos;s site-access controls.</td></tr>
                  <tr><th scope="row">https://example.com/articles/private/draft</th><td>No, explicitly excluded.</td></tr>
                  <tr><th scope="row">https://docs.example.com/articles/intro</th><td>No, different host.</td></tr>
                  <tr><th scope="row">http://example.com/articles/intro</th><td>No, different scheme.</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              Content script paths matter. This differs from <code>host_permissions</code>,
              where paths are ignored. Check Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns" rel="noopener noreferrer">match pattern syntax</a>{" "}and
              <a href="https://developer.chrome.com/docs/extensions/reference/manifest/content-scripts" rel="noopener noreferrer"> content script manifest reference</a>{" "}before
              treating a domain list as an injection rule.
            </p>
          </section>
          <section>
            <h2>Find the files, timing, and frame</h2>
            <p>
              Open <code>content.js</code>{" "}relative to the extension&apos;s root folder.
              If the <code>js</code>{" "}array lists several files, preserve that order
              while reading: later files may depend on earlier ones. Check listed CSS
              files too. A changed page can come from a stylesheet without any DOM-writing
              JavaScript.
            </p>
            <p>
              Here, <code>run_at: document_idle</code>{" "}means the DOM is complete when
              injection occurs, and <code>all_frames: false</code>{" "}targets the top frame.
              Neither setting promises that an app has finished adding its own content.
              If frames are included in another extension, check each frame&apos;s URL against
              the rules instead of assuming the parent page authorizes everything inside it.
            </p>
          </section>
          <section>
            <h2>Trace a content script&apos;s DOM operations</h2>
            <p>
              This is the complete <code>content.js</code>{" "}for our example. Read it
              as a short sequence of reads and writes:
            </p>
            <pre className="article-code" aria-label="Content script that marks article headings"><code>{contentScript}</code></pre>
            <p>
              <code>querySelectorAll("article h2")</code>{" "}selects second-level headings
              inside article elements. The inner selector skips a heading that already
              contains our marker. Then the script creates a span, gives it a data
              attribute, writes a fixed text label, and appends it to the heading.
              It doesn&apos;t read the heading&apos;s text or send a request.
            </p>
            <p>
              That distinction matters in a review. A nearby <code>textContent</code>{" "}assignment
              could insert a label, while reading <code>heading.textContent</code>{" "}could
              collect page content. Follow which side of the assignment the page data
              appears on. Search for <code>innerHTML</code>{" "}and inspect where its input
              comes from, too.
            </p>
            <p>
              The manifest explicitly uses <code>ISOLATED</code>. A content script in
              that world has a separate JavaScript environment from the page, but can
              still change their shared DOM. Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts" rel="noopener noreferrer">content script guide</a>{" "}explains
              why isolation doesn&apos;t make page elements private.
            </p>
          </section>
          <section>
            <h2>Check what happens when the page changes</h2>
            <p>
              Open our <a href="/examples/content-script-trace/dom-check.html">interactive DOM check</a>.
              Two article headings receive a <code>[reviewed]</code>{" "}marker, and the
              heading outside the article stays unchanged. Click “Add article heading.”
              The new heading has no marker until you click “Run content.js again.”
              Running it once more keeps one marker per heading.
            </p>
            <p>
              We checked those outcomes in Chrome 155.0.8059.85 on October 23, 2026.
              The check page runs the same file as an ordinary page script. It tests
              DOM behavior, not extension installation, URL matching, or isolated-world
              execution. In an extension, this one-time selection would still miss
              headings added later unless something runs the code again or watches
              for changes.
            </p>
          </section>
          <section>
            <h2>Look for injection outside the manifest</h2>
            <p>
              Search the extracted source for <code>registerContentScripts</code>{" "}and
              <code> executeScript</code>. The first can register scripts with rules
              chosen at runtime; the second can inject files or a function when an
              event fires. Follow the caller back to its trigger, such as an action
              handler, and check its target tab and frame.
              An aliased API call or minified bundle can escape a literal text search.
            </p>
            <p>
              Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/reference/api/scripting" rel="noopener noreferrer">scripting API reference</a>{" "}covers
              those paths. An empty <code>content_scripts</code>{" "}array doesn&apos;t prove
              an extension never touches pages. Our <a href="/blog/host-permissions-vs-activetab">host permissions vs activeTab comparison</a>{" "}helps
              distinguish ongoing site grants from access that follows a user invocation.
            </p>
          </section>
          <section>
            <h2>Use DevTools when a script seems missing</h2>
            <p>
              For a trusted extension you already run, open the target page&apos;s DevTools,
              find its content script under Sources, and place a breakpoint at the first
              DOM operation. Select the extension&apos;s execution context in Console when
              inspecting its variables. Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/get-started/tutorial/debug" rel="noopener noreferrer">extension debugging tutorial</a>{" "}shows
              how to locate the different components.
            </p>
            <p>
              Check the actual URL, exclusions, and current site-access setting before
              changing permissions. Reload the extension after editing its files, then
              reload the test page so its scripts can run again. For a missing heading,
              also check when it entered the DOM and whether it lives inside a frame.
              A broader host pattern won&apos;t fix a selector aimed at the wrong element.
            </p>
          </section>
          <section>
            <h2>Follow messages beyond the page</h2>
            <p>
              In a larger package, a content script may pass selected text through
              <code> chrome.runtime.sendMessage</code>{" "}or a long-lived connection.
              Find the receiving listener and follow what it does with that payload.
              A clean-looking content script can still hand data to a worker that
              stores it or sends it to a server. Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/messaging" rel="noopener noreferrer">message passing guide</a>{" "}describes
              the connection between those components.
            </p>
            <p>
              Keep a review note with the matching URL, script filename, DOM read or
              write, and destination for any collected data. Use our <a href="/blog/view-chrome-extension-source-without-installing">source inspection workflow</a>{" "}to
              follow the remaining entry points. If the trail ends in a bundled helper,
              record that filename and the unresolved call so the next reviewer can
              continue from the same place.
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
