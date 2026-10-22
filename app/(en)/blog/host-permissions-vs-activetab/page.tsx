import type { Metadata } from "next";
import { PackageCheck } from "lucide-react";
import { SiteFooter } from "@/app/components/SiteFooter";
import { blogPostDate, blogPostUrl, hostPermissionsVsActiveTabPost } from "@/lib/blog";

const url = blogPostUrl(hostPermissionsVsActiveTabPost);
const { publishedAt, modifiedAt, title, description } = hostPermissionsVsActiveTabPost;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: hostPermissionsVsActiveTabPost.path },
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

const activeTabManifest = {
  manifest_version: 3,
  name: "Page Outline: Click Access",
  version: "1.0.0",
  permissions: ["activeTab", "scripting"],
  background: { service_worker: "worker.js" },
  action: { default_title: "Outline this page" }
};

const hostManifest = {
  manifest_version: 3,
  name: "Page Outline: Site Access",
  version: "1.0.0",
  permissions: ["scripting"],
  host_permissions: ["https://example.com/*"],
  background: { service_worker: "worker.js" },
  action: { default_title: "Outline this page" }
};

const workerExample = `chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id === undefined) return;
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        document.documentElement.style.outline = "4px solid #00796b";
      }
    });
  } catch (error) {
    console.warn("Page access unavailable:", error.message);
  }
});`;

export default function HostPermissionsVsActiveTabPage() {
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
            <span aria-current="page">Host Permissions vs activeTab</span>
          </nav>

          <header className="article-header">
            <p className="article-kicker">Chrome Extension Site Access</p>
            <h1>{title}</h1>
            <p className="article-dek">
              Compare ongoing host access with temporary access after a click, using
              two Manifest V3 examples that run the same page-marking code.
            </p>
            <p className="article-meta">
              By CRXFile · Published <time dateTime={publishedAt}>{blogPostDate(publishedAt)}</time> · {hostPermissionsVsActiveTabPost.readingMinutes} min read
            </p>
          </header>

          <aside className="article-summary" aria-label="Quick answer">
            <strong>Quick answer</strong>
            <p>
              Use <code>activeTab</code>{" "}for a Chrome extension that needs page access
              when someone invokes it, such as a toolbar button that marks an article
              or saves a selected passage for later reading.
              Use <code>host_permissions</code>{" "}when a feature needs access to specified
              sites without a fresh invocation each time. The difference is scope and
              lifetime. Check the trigger first. An extension can declare access without
              running code, so when you review a package, trace the event that starts
              the work and check the site access that the user has actually granted.
              A broad permission deserves a
              concrete reason, but it doesn&apos;t prove the extension is malicious.
            </p>
          </aside>

          <section>
            <h2>Host permissions vs activeTab at a glance</h2>
            <div className="format-table" role="region" aria-label="Host permissions and activeTab comparison" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">Question</th><th scope="col">host_permissions</th><th scope="col">activeTab</th></tr></thead>
                <tbody>
                  <tr><th scope="row">Where is it declared?</th><td>A separate manifest array of URL match patterns.</td><td>A string inside the permissions array.</td></tr>
                  <tr><th scope="row">What sites?</th><td>Hosts matching the granted patterns.</td><td>The invoked tab&apos;s main-frame origin, temporarily.</td></tr>
                  <tr><th scope="row">When is access available?</th><td>While the relevant site grant remains available.</td><td>After a qualifying user invocation, until revoked.</td></tr>
                  <tr><th scope="row">Can it inject JavaScript?</th><td>With scripting and a matching site grant.</td><td>With scripting during the temporary grant.</td></tr>
                  <tr><th scope="row">Installation warning?</th><td>Host requests can produce site-access warnings.</td><td>No warning from activeTab itself.</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions" rel="noopener noreferrer">permission declaration guide</a>{" "}describes
              host access separately from API permissions. For the other manifest fields,
              start with our <a href="/blog/chrome-extension-permissions-explained">Chrome extension permissions guide</a>.
            </p>
          </section>

          <section>
            <h2>Two minimal Manifest V3 examples</h2>
            <p>
              These original examples put a teal outline around a page. Save either JSON
              block as <code>manifest.json</code>{" "}and the shared script below as
              <code> worker.js</code>{" "}in the same folder. Keep the variants in separate
              folders. We checked JSON syntax and ran the handler against mocked Chrome
              APIs on October 22, 2026. We haven&apos;t installed these examples in Chrome
              or tested their permission prompts there.
            </p>
            <h3>Example A: temporary access with activeTab</h3>
            <pre className="article-code" aria-label="Complete activeTab Manifest V3 example"><code>{JSON.stringify(activeTabManifest, null, 2)}</code></pre>
            <h3>Example B: host permission for example.com</h3>
            <pre className="article-code" aria-label="Complete host permissions Manifest V3 example"><code>{JSON.stringify(hostManifest, null, 2)}</code></pre>
            <p>
              Example A can act on an allowed page after its toolbar button is clicked.
              Example B requests HTTPS access to <code>example.com</code>. It doesn&apos;t
              cover <code>www.example.com</code>{" "}or unrelated hosts. Both use the same
              click handler so you can compare authorization without changing the feature.
            </p>
            <h3>The shared worker.js</h3>
            <pre className="article-code" aria-label="Shared worker.js action handler"><code>{workerExample}</code></pre>
            <p>
              The handler runs only after a toolbar click. Host permission doesn&apos;t
              change that trigger. The <a href="https://developer.chrome.com/docs/extensions/reference/api/scripting" rel="noopener noreferrer">scripting API</a>{" "}requires
              its named permission plus host access, supplied here by either declaration.
              Injection targets the main frame by default. The catch handles denied access.
              it doesn&apos;t bypass it.
            </p>
            <p>
              To compare the scopes in Chrome, use <code>https://example.com/</code>{" "}as
              a baseline, then try an ordinary HTTPS page on another host. With site
              access granted, either variant should outline the baseline page after
              a click. On the second host, only Example A has the permission needed for
              that click. For Example B, inspect the worker&apos;s console for the denied
              injection. These are expected outcomes, not browser test results. If
              your result differs, check Chrome&apos;s site-access setting and the exact
              URL before widening the manifest.
            </p>
          </section>

          <section id="grant-lifetime">
            <h2>How long does activeTab last?</h2>
            <p>
              Clicking an extension action is one qualifying invocation. Merely selecting
              a tab isn&apos;t. Chrome also supports invocation through an extension keyboard
              command or context-menu item, as documented in its
              <a href="https://developer.chrome.com/docs/extensions/develop/concepts/activeTab" rel="noopener noreferrer"> activeTab guide</a>.
            </p>
            <p>
              Suppose you invoke the extension on <code>https://example.com/article</code>.
              Navigate within that origin to <code>https://example.com/about</code>{" "}and
              the grant remains available; follow a link to <code>https://example.org/</code>{" "}and
              Chrome revokes it. Closing the tab ends it too. Don&apos;t assume a click
              authorizes every tab or a third-party iframe. And neither access model permits injection into
              restricted pages such as <code>chrome://settings</code>.
            </p>
          </section>

          <section>
            <h2>Host access still has boundaries</h2>
            <p>
              A <code>host_permissions</code>{" "}grant can remain available across visits
              to matching sites. <a href="https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle" rel="noopener noreferrer">Service workers still stop when idle</a>.
              Check the user&apos;s actual grant. A declared host can still have its access
              withheld by the user.
            </p>
            <p>
              Check the pattern carefully. In host permissions, the path is ignored:
              <code> https://example.com/reports/*</code>{" "}doesn&apos;t confine access to
              reports. Use <code>https://example.com/*</code>{" "}for an exact HTTPS host,
              or <code>https://*.example.com/*</code>{" "}when the base domain and its
              subdomains are needed. Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns" rel="noopener noreferrer">match pattern reference</a>{" "}explains
              the syntax.
            </p>
          </section>

          <section>
            <h2>Three mistakes when choosing permissions</h2>
            <p>
              Adding <code>tabs</code>{" "}won&apos;t fix missing page-injection permission.
              <a href="https://developer.chrome.com/docs/extensions/reference/api/tabs" rel="noopener noreferrer">Sensitive tab metadata</a>{" "}and
              access to a page&apos;s DOM are different capabilities.
              For an injection failure, check the target URL and the site grant before
              adding more API permissions.
            </p>
            <p>
              Declaring a host won&apos;t schedule a content script either. Automatic
              scripts need an injection mechanism, such as
              <code> content_scripts.matches</code>. Manifest-declared content scripts
              don&apos;t need duplicate <code>host_permissions</code>{" "}for their declared
              injection. See Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts" rel="noopener noreferrer">content script guide</a>.
            </p>
            <p>
              And activeTab on a shopping page doesn&apos;t authorize an unrelated API host.
              A service worker fetching from <code>https://api.example.net/</code>{" "}needs
              appropriate access for that server. Host permissions don&apos;t remove CORS
              restrictions from requests made inside content scripts. Chrome&apos;s
              <a href="https://developer.chrome.com/docs/extensions/develop/concepts/network-requests" rel="noopener noreferrer"> cross-origin request guide</a>{" "}covers
              that difference.
            </p>
          </section>

          <section>
            <h2>Choose access for the feature you actually need</h2>
            <p>
              For a click-to-outline tool, we&apos;d start with activeTab. A tool that
              automatically annotates a known work site needs an access and injection
              plan that survives ordinary browsing. An optional integration can declare
              <code> optional_host_permissions</code>{" "}and request a specific site when
              the user chooses that feature.
            </p>
            <p>
              That request needs a user gesture. Check the result of
              <code> chrome.permissions.request</code>{" "}and support refusal. Use
              <code> chrome.permissions.contains</code>{" "}when checking a particular
              existing grant. The <a href="https://developer.chrome.com/docs/extensions/reference/api/permissions" rel="noopener noreferrer">Permissions API reference</a>{" "}documents
              both calls. Optional host access can persist after approval; it isn&apos;t the
              same as activeTab&apos;s temporary lifetime.
            </p>
          </section>

          <section>
            <h2>Review an existing extension&apos;s site access</h2>
            <p>
              Download a currently available public package with <a href="/#tool">CRXFile</a>,
              extract the ZIP, then <a href="/blog/read-chrome-extension-manifest">read its manifest.json</a>.
              The package tells you what the publisher requests, not what an installed
              user has granted. CRXFile retrieves packages. It doesn&apos;t certify their safety.
            </p>
            <p>
              Follow the toolbar handler or automatic script into its DOM reads and
              network calls using our <a href="/blog/view-chrome-extension-source-without-installing">source inspection guide</a>.
              Record the exact host, the starting event, and the data the feature uses.
              If a button that only changes a page&apos;s outline requests every website,
              ask why it needs access before anyone clicks it.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
