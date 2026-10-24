import { readFileSync } from "node:fs";
import path from "node:path";
import demoManifest from "@/examples/source-review-demo/manifest.json";
import type { Metadata } from "next";
import { PackageCheck } from "lucide-react";
import { SiteFooter } from "@/app/components/SiteFooter";
import { blogPostDate, blogPostUrl, serviceWorkerPost } from "@/lib/blog";

const url = blogPostUrl(serviceWorkerPost);
const { publishedAt, modifiedAt, title, description } = serviceWorkerPost;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: serviceWorkerPost.path },
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

const exampleFile = (name: string) => readFileSync(
  path.join(process.cwd(), "examples/source-review-demo", name), "utf8"
).trimEnd();
const manifestExcerpt = {
  manifest_version: demoManifest.manifest_version,
  permissions: demoManifest.permissions,
  background: demoManifest.background
};

export default function ServiceWorkerPage() {
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
            <span aria-current="page">MV3 Service Workers</span>
          </nav>
          <header className="article-header">
            <p className="article-kicker">Chrome Extension Service Worker Explained</p>
            <h1>{title}</h1>
            <p className="article-dek">
              Find the background entry file, follow its event handlers, and track where a message ends up.
            </p>
            <p className="article-meta">
              By CRXFile · Published <time dateTime={publishedAt}>{blogPostDate(publishedAt)}</time> · {serviceWorkerPost.readingMinutes} min read
            </p>
          </header>
          <aside className="article-summary" aria-label="Quick answer">
            <strong>Quick answer</strong>
            <p>
              To find what a Chrome extension service worker does, open the file named
              by <code>background.service_worker</code>{" "}in <code>manifest.json</code>.
              Read its event listeners, then follow each handler from incoming data to
              storage or a network request. Check imported files too. A Manifest V3
              worker handles background events without a page DOM, and Chrome can stop
              it between tasks. Its filename alone tells you very little. The useful
              evidence is the path through the code: who sends a message, which checks
              accept it, and what the handler does next.
            </p>
          </aside>
          <section>
            <h2>Locate background.service_worker in manifest.json</h2>
            <p>
              Download a public package with <a href="/#tool">CRXFile</a>{" "}and extract
              the ZIP to inspect it without installation. Start with our <a href="/blog/read-chrome-extension-manifest">manifest reading guide</a>{" "}if
              the entry fields are unfamiliar. This excerpt comes from the original
              <a href="/examples/source-review-demo.zip" download> Source Review Demo ZIP</a>:
            </p>
            <pre className="article-code" aria-label="Manifest excerpt declaring the service worker"><code>{JSON.stringify(manifestExcerpt, null, 2)}</code></pre>
            <p>
              Open <code>worker.js</code>{" "}relative to the package root.
              Follow its dependencies. Chrome accepts one worker entry file, but that
              file can load other packaged code with <code>importScripts()</code>{" "}or
              static imports when the background declaration includes <code>type: "module"</code>.
              The JSON above is only a manifest excerpt. Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/basics" rel="noopener noreferrer">service worker basics</a>{" "}documents
              both loading methods and the lack of dynamic import support.
            </p>
          </section>
          <section>
            <h2>Read the event before reading the helper</h2>
            <p>
              Here&apos;s the entire worker. There&apos;s one listener and no imported helper:
            </p>
            <pre className="article-code" aria-label="Complete message receiving service worker"><code>{exampleFile("worker.js")}</code></pre>
            <p>
              <code>runtime.onMessage</code>{" "}is the trigger. The handler accepts a
              string title only when the sender URL starts with the exact HTTPS prefix
              and the message type is <code>PAGE_TITLE</code>. The slash after the host
              matters: <code>https://example.com.evil/</code>{" "}doesn&apos;t pass this check.
              An absent sender URL fails too. This small guard isn&apos;t a general message
              security policy; larger extensions may need tab or frame checks and limits
              on payload size.
            </p>
            <p>
              In a larger worker, search for <code>addListener</code>{" "}and record each
              trigger before chasing helper functions. An action click and an alarm can
              reach different branches of the same function. Chrome requires event
              listeners to register synchronously at the top level, as its <a href="https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/events" rel="noopener noreferrer">worker events guide</a>{" "}explains.
              A listener added only after an asynchronous storage read can miss the
              event that woke the worker.
            </p>
          </section>
          <section>
            <h2>Trace the message through storage to the popup</h2>
            <p>
              Our <a href="/blog/inspect-extension-content-scripts">content script inspection guide</a>{" "}covers
              the page side. In this package, <code>content.js</code>{" "}sends the title:
            </p>
            <pre className="article-code" aria-label="Content script sending a page title"><code>{exampleFile("content.js")}</code></pre>
            <div className="format-table" role="region" aria-label="Annotated service worker data flow" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">Step</th><th scope="col">Evidence</th><th scope="col">Effect</th></tr></thead>
                <tbody>
                  <tr><th scope="row">Input</th><td>content.js reads document.title</td><td>Sends PAGE_TITLE to the extension.</td></tr>
                  <tr><th scope="row">Guard</th><td>worker.js checks sender, type, and title</td><td>Rejects messages outside that condition.</td></tr>
                  <tr><th scope="row">Write</th><td>storage.local.set</td><td>Replaces lastTitle with the accepted string.</td></tr>
                  <tr><th scope="row">Read</th><td>popup.js gets lastTitle</td><td>Displays the saved value as text.</td></tr>
                  <tr><th scope="row">Network</th><td>No fetch call in this worker</td><td>No outbound request along this handler.</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              The popup reads <code>lastTitle</code>{" "}from <code>chrome.storage.local</code>{" "}and
              assigns it to <code>textContent</code>. That closes this particular trail.
              The worker overwrites one key, so the example keeps the latest accepted
              title rather than a browsing history. Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/reference/api/storage" rel="noopener noreferrer">storage API reference</a>{" "}explains
              the permission and storage areas.
            </p>
            <p>
              We checked this flow with mocked Chrome APIs in Node.js on October 25,
              2026. A valid message reached storage and the popup reader. Five rejected
              cases produced no writes: another origin, a lookalike host, the wrong
              message type, a numeric title, and a missing sender URL. Those checks
              exercise the JavaScript branches. They don&apos;t test Chrome installation,
              message delivery, or worker lifetime.
            </p>
            <p>
              There&apos;s a timing limit here. The sender doesn&apos;t wait for an
              acknowledgement, and the worker doesn&apos;t reply after saving. Opening
              the popup before the write completes could show the previous value.
              For a feature that needs confirmed delivery, inspect how it reports
              completion and handles storage errors.
            </p>
          </section>
          <section>
            <h2>How MV3 differs from an MV2 background page</h2>
            <p>
              An MV2 persistent background page had a document and could remain loaded.
              MV2 also had nonpersistent event pages, so “old background script” doesn&apos;t
              always mean “always running.” An MV3 service worker has no <code>window</code>{" "}or
              page DOM. It can&apos;t read <code>document.title</code>{" "}itself, which explains
              why this example gets the value from a content script.
            </p>
            <p>
              Chrome can stop an idle worker and restart it for an event. Globals reset.
              Keep needed state in storage, as this example does, rather than trusting
              an in-memory variable. The <a href="https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle" rel="noopener noreferrer">lifecycle documentation</a>{" "}describes
              termination conditions and version-specific exceptions. Don&apos;t treat a
              worker as a permanent loop or confuse <code>onInstalled</code>{" "}with an
              event that fires on every wake-up.
            </p>
            <p>
              Check what starts each job. <code>runtime.onStartup</code>{" "}relates
              to browser profile startup, rather than every worker restart. An
              <code> alarms.onAlarm</code>{" "}listener waits for a scheduled alarm.
              If you find a timer, ask whether the task survives shutdown. Chrome&apos;s
              <a href="https://developer.chrome.com/docs/extensions/develop/migrate/to-service-workers" rel="noopener noreferrer"> migration guide</a>{" "}explains
              why ordinary timers can disappear when a worker stops.
            </p>
          </section>
          <section>
            <h2>Follow network requests beyond the first handler</h2>
            <p>
              Search for <code>fetch</code>{" "}and follow URL builders into imported
              modules. For each request, write down the destination and the payload.
              Does it contain the title just received? Does a stored setting change
              the host? A literal URL search can miss a destination assembled at runtime.
            </p>
            <p>
              Worker cross-origin requests need the appropriate host permissions.
              Those grants don&apos;t remove CORS restrictions from content scripts.
              Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/network-requests" rel="noopener noreferrer">cross-origin request guide</a>{" "}covers
              that boundary. Our example worker has no network call, but that observation
              doesn&apos;t establish what every other file in an unfamiliar package does.
            </p>
          </section>
          <section>
            <h2>Check a running worker in Chrome DevTools</h2>
            <p>
              For a trusted extension you already run, open <code>chrome://extensions</code>,
              turn on Developer mode, and select its service worker link under Inspect
              views. Set a breakpoint inside the handler, trigger the matching action,
              and inspect the message and call stack. Use Network to compare actual
              request payloads with the source trace.
            </p>
            <p>
              Close DevTools before checking idle behavior. Inspecting keeps the worker
              active, as Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/get-started/tutorial/debug" rel="noopener noreferrer">extension debugging tutorial</a>{" "}warns.
              Record the triggering event, source file, accepted input, and final
              destination. If a bundled helper remains unread, name that file and call
              in your review note so someone can continue the investigation there.
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
