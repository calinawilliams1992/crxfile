import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { PackageCheck } from "lucide-react";
import { SiteFooter } from "@/app/components/SiteFooter";
import { blogPostDate, blogPostUrl, networkRequestsPost } from "@/lib/blog";

const url = blogPostUrl(networkRequestsPost);
const { publishedAt, modifiedAt, title, description } = networkRequestsPost;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: networkRequestsPost.path },
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

const requestSource = readFileSync(
  path.join(process.cwd(), "public/examples/network-request-review/request.js"), "utf8"
).trimEnd();
const searchCommand = `rg -n -i 'fetch\\s*\\(|XMLHttpRequest|axios|https?://|wss?://|sendBeacon|WebSocket' .`;

export default function NetworkRequestsPage() {
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
            <span aria-current="page">Network Request Review</span>
          </nav>
          <header className="article-header">
            <p className="article-kicker">Audit Chrome Extension Network Requests</p>
            <h1>{title}</h1>
            <p className="article-dek">
              Follow outbound calls from their inputs to their destinations, then check what the browser actually sends.
            </p>
            <p className="article-meta">
              By CRXFile · Published <time dateTime={publishedAt}>{blogPostDate(publishedAt)}</time> · {networkRequestsPost.readingMinutes} min read
            </p>
          </header>
          <aside className="article-summary" aria-label="Quick answer">
            <strong>Quick answer</strong>
            <p>
              To audit Chrome extension network requests, search the extracted source
              for request APIs and endpoint strings, then follow each call back to its
              input and triggering event. Read the complete request options. A domain
              name alone won&apos;t tell you whether a call sends a page title, downloads
              a configuration file, or does nothing in the current build. Record the
              destination and payload, compare them with declared permissions, and
              check a trusted running extension in the correct DevTools context.
              Static searches identify code to investigate. They can&apos;t prove which
              branches run or what a server does with received data.
            </p>
          </aside>
          <section>
            <h2>Search for fetch, XHR, and remote domains</h2>
            <p>
              Get the public ZIP through <a href="/#tool">CRXFile</a>{" "}and extract it.
              Keep its version with your notes. Our <a href="/blog/view-chrome-extension-source-without-installing">source inspection guide</a>{" "}covers
              that first pass. In an editor, search across JavaScript and HTML, including
              bundled files. With ripgrep installed, this command gives you a starting list:
            </p>
            <pre className="article-code" aria-label="Search extension source for network APIs and URLs"><code>{searchCommand}</code></pre>
            <p>
              Follow the matches. <code>fetch</code>{" "}may sit behind a wrapper called
              <code> apiClient</code>. Our example below calls an injected
              <code> fetcher</code>, so searching only for <code>fetch(</code>{" "}would
              miss that call. Look for <code>XMLHttpRequest</code>, including its
              <code> open()</code>{" "}and <code>send()</code>{" "}calls. Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/migrate/to-service-workers" rel="noopener noreferrer">worker migration guide</a>{" "}notes
              that XHR isn&apos;t available inside service workers, but you may find it in
              extension pages or older background code.
            </p>
            <p>
              Don&apos;t count every URL as an upload. A license comment or documentation
              link doesn&apos;t make a request. And an empty result proves little: aliases,
              encoded strings, computed URLs, or a different transport can hide from
              this literal search. Check HTML resource URLs and CSS imports too.
            </p>
          </section>
          <section>
            <h2>Identify the execution context and host access</h2>
            <p>
              Find whether the call runs in a content script, popup, or extension worker.
              Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/network-requests" rel="noopener noreferrer">cross-origin request guide</a>{" "}explains
              the difference: worker and extension-page cross-origin fetches need suitable
              host permissions, while content scripts remain subject to the page&apos;s
              cross-origin restrictions. Adding a host grant doesn&apos;t remove that
              content-script boundary.
            </p>
            <p>
              Compare the endpoint with <code>host_permissions</code>{" "}and
              <code> optional_host_permissions</code>. A declaration doesn&apos;t prove
              the user granted it or that a call happened. Our <a href="/blog/chrome-extension-permissions-explained">extension permissions guide</a>{" "}helps
              separate requested access from current grants. Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions" rel="noopener noreferrer">permission documentation</a>{" "}lists
              the relevant manifest fields.
            </p>
          </section>
          <section>
            <h2>Read one complete request, including its body</h2>
            <p>
              Here&apos;s our original <a href="/examples/network-request-review/request.js" download>request.js example</a>.
              It&apos;s a standalone teaching module, not a complete installable extension.
              The optional third argument lets the check page replace fetch with a mock:
            </p>
            <pre className="article-code" aria-label="Original network request construction example"><code>{requestSource}</code></pre>
            <p>
              Start at the inputs. The function accepts an HTTPS page URL and a string
              title of at most 120 characters. It extracts the page&apos;s origin, then sends
              that origin and the title as JSON to a fixed endpoint. The page path,
              query string, and fragment don&apos;t enter this body. The title still does,
              and titles can contain private information.
            </p>
            <p>
              <code>credentials: "omit"</code>{" "}excludes credentials such as cookies
              from this fetch; it doesn&apos;t remove data placed in JSON. The function also
              rejects redirects and checks <code>response.ok</code>. Fetch doesn&apos;t
              automatically reject an HTTP 503 response. See MDN&apos;s <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" rel="noopener noreferrer">Fetch API guide</a>{" "}for
              credentials and HTTP error handling.
            </p>
            <p>
              Check the URL as carefully as the body. A GET request can carry data in
              query parameters, even without JSON. Follow <code>URLSearchParams</code>{" "}or
              string concatenation back to its inputs. In another package, an
              identifier might come from storage rather than the current page.
            </p>
          </section>
          <section>
            <h2>Build a network request review table</h2>
            <p>
              Use one row per question, then repeat the review for each call site.
              These are source findings for our example, before any real network test:
            </p>
            <div className="format-table" role="region" aria-label="Extension network request audit table" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">Check</th><th scope="col">Evidence in request.js</th><th scope="col">Follow-up</th></tr></thead>
                <tbody>
                  <tr><th scope="row">Trigger</th><td>Exported sendTitleForReview function</td><td>Find its caller and event.</td></tr>
                  <tr><th scope="row">Destination</th><td>https://collector.example/v1/review</td><td>Check configuration and redirects elsewhere.</td></tr>
                  <tr><th scope="row">Payload</th><td>POST JSON: origin and title</td><td>Trace where each argument originates.</td></tr>
                  <tr><th scope="row">Credentials</th><td>omit; no Authorization header</td><td>Check other request headers and identifiers.</td></tr>
                  <tr><th scope="row">Failure</th><td>Throws on invalid input or non-OK status</td><td>Inspect caller retries and error reporting.</td></tr>
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2>Reproduce the payload with a mocked fetch</h2>
            <p>
              Open the <a href="/examples/network-request-review/check.html">browser mock check</a>{" "}and
              click “Run mocked request.” The valid case captures one POST with
              <code> origin: "https://example.com"</code>{" "}and
              <code> title: "Demo account"</code>. Compare it with the longer input URL
              shown below the controls.
            </p>
            <p>
              Choose the HTTP-page case or the overlong title. Both should stop before
              fetch. The simulated 503 case should record one call and report an error.
              The check runs the same module printed above and always supplies a mock.
              It sends no collector POST and doesn&apos;t verify CORS or extension permissions.
              You can inspect the request shape without installing an extension.
            </p>
          </section>
          <section>
            <h2>Follow messages into the network caller</h2>
            <p>
              A content script can hand page data to a worker that makes the request.
              Search for its message type and find the receiving listener, then follow
              the payload into the network helper. Check who can send that message and
              whether the receiver restricts destinations. Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/messaging" rel="noopener noreferrer">messaging guide</a>{" "}describes
              these connections. Our <a href="/blog/chrome-extension-service-worker">service worker walkthrough</a>{" "}shows
              how to trace the receiving handler.
            </p>
            <p>
              Read the caller&apos;s error branch too. A retry loop can send the same
              payload repeatedly, and a saved queue may send it after the original
              page closes. Record when the caller retries and what clears queued data.
              That behavior won&apos;t appear in the helper&apos;s request options.
            </p>
          </section>
          <section>
            <h2>Compare the source trace with DevTools</h2>
            <p>
              For a trusted extension you already run, open DevTools for the component
              making the call. Start recording before you trigger the feature. Select
              the request and compare its URL, method, payload, and response status with
              your notes. Follow Initiator to the calling code. Chrome&apos;s <a href="https://developer.chrome.com/docs/devtools/network/reference" rel="noopener noreferrer">Network panel reference</a>{" "}covers
              those views. A page&apos;s Network panel alone can miss work in the extension
              worker or popup.
            </p>
            <p>
              Record the version and the action you tested. No observed request means
              only that you didn&apos;t capture one during that test. A feature might wait
              for a login, an alarm, or another permission grant. Keep the unresolved
              trigger or destination in your review notes so the next test has a
              specific question to answer.
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
