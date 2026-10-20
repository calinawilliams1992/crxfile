import type { Metadata } from "next";
import { PackageCheck } from "lucide-react";
import { SiteFooter } from "@/app/components/SiteFooter";
import { blogPostDate, blogPostUrl, chromeExtensionPermissionsPost } from "@/lib/blog";

const url = blogPostUrl(chromeExtensionPermissionsPost);
const { publishedAt, modifiedAt, title, description } = chromeExtensionPermissionsPost;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: chromeExtensionPermissionsPost.path },
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

const permissionsExample = {
  permissions: ["storage", "scripting", "activeTab"],
  host_permissions: ["https://api.example.com/*"],
  optional_permissions: ["downloads"],
  optional_host_permissions: ["https://*.example.org/*"],
  content_scripts: [{ matches: ["https://docs.example.com/*"], js: ["annotate.js"] }]
};

export default function ChromeExtensionPermissionsPage() {
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
            <span aria-current="page">Extension Permissions</span>
          </nav>

          <header className="article-header">
            <p className="article-kicker">Chrome Extension Permissions Explained</p>
            <h1>{title}</h1>
            <p className="article-dek">
              Separate API permissions from website access and optional grants. Then check
              whether each request fits a feature you actually want to use.
            </p>
            <p className="article-meta">
              By CRXFile · Published <time dateTime={publishedAt}>{blogPostDate(publishedAt)}</time> · {chromeExtensionPermissionsPost.readingMinutes} min read
            </p>
          </header>

          <aside className="article-summary" aria-label="Quick answer">
            <strong>Quick answer</strong>
            <p>
              Chrome extension permissions describe capabilities the extension requests.
              Read <code>permissions</code>{" "}for API access, <code>host_permissions</code>{" "}for
              sites, and <code>content_scripts.matches</code>{" "}for pages with declared scripts.
              Optional fields describe access the extension can request later. A permission
              list helps you decide what to investigate, but it cannot tell you whether
              the publisher uses that access responsibly. For that, follow the relevant code
              and compare its behavior with the feature being offered.
            </p>
          </aside>

          <section>
            <h2>Open the permissions in manifest.json</h2>
            <p>
              Extract the extension&apos;s ZIP and open its root <code>manifest.json</code>{" "}in
              a text editor. You can obtain a currently available public package through
              <a href="/#tool"> CRXFile</a>. Our <a href="/blog/read-chrome-extension-manifest">manifest reading guide</a>{" "}covers
              the file structure. Review the downloaded version rather than relying on
              the listing&apos;s description alone.
            </p>
            <p>
              Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions" rel="noopener noreferrer">permission declaration guide</a>{" "}distinguishes
              the fields below. These are Manifest V3 fields from an original teaching
              example of a page-note tool. This is an excerpt, not a complete extension;
              its domains and script filename are placeholders. We checked the JSON syntax
              on October 20, 2026, without an installation test.
            </p>
            <pre className="article-code" aria-label="Manifest V3 permission fields excerpt"><code>{JSON.stringify(permissionsExample, null, 2)}</code></pre>
          </section>

          <section>
            <h2>A Chrome extension permission review table</h2>
            <div className="format-table" role="region" aria-label="Chrome extension permission fields and review questions" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">Field</th><th scope="col">What this example requests</th><th scope="col">Review question</th></tr></thead>
                <tbody>
                  <tr><th scope="row">permissions</th><td>Extension storage, scripting, and temporary access through activeTab.</td><td>Which feature uses each API or grant?</td></tr>
                  <tr><th scope="row">host_permissions</th><td>Access to the HTTPS host api.example.com.</td><td>What requests go there, and what data leaves the browser?</td></tr>
                  <tr><th scope="row">optional_permissions</th><td>A later request for the downloads API.</td><td>Can the tool work if export permission is refused?</td></tr>
                  <tr><th scope="row">optional_host_permissions</th><td>A later request for example.org or its subdomains over HTTPS.</td><td>Which user action asks for that access?</td></tr>
                  <tr><th scope="row">content_scripts.matches</th><td>A declared script on HTTPS pages at docs.example.com.</td><td>What page content does annotate.js read or change?</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              Read across the fields. The example can have a declared content script on
              one host, make service-worker requests to another, and ask for an optional
              integration elsewhere. A single list of domain names would hide those differences.
            </p>
          </section>

          <section>
            <h2>API permissions describe different kinds of access</h2>
            <p>
              <code>storage</code>{" "}grants use of Chrome&apos;s extension storage API. It doesn&apos;t
              mean access to every website&apos;s saved data. Search for
              <code> chrome.storage.local</code>{" "}and <code>chrome.storage.sync</code>{" "}to see
              what the extension keeps and where. The <a href="https://developer.chrome.com/docs/extensions/reference/api/storage" rel="noopener noreferrer">Storage API reference</a>{" "}explains
              the available storage areas.
            </p>
            <p>
              <code>scripting</code>{" "}permits use of the scripting API, but injecting code
              into a page also requires suitable host access, which can come from
              <code> activeTab</code>. Check the <a href="https://developer.chrome.com/docs/extensions/reference/api/scripting" rel="noopener noreferrer">scripting API requirements</a>{" "}before
              treating that declaration as permission to run anywhere.
            </p>
            <p>
              One common trap is <code>tabs</code>. It concerns sensitive tab properties,
              including URLs and titles. Many operations, such as opening a tab, don&apos;t
              require it. The <a href="https://developer.chrome.com/docs/extensions/reference/api/tabs" rel="noopener noreferrer">Tabs API reference</a>{" "}spells
              out the distinction. Match a permission to an actual operation, rather than
              guessing from its name.
            </p>
            <p>
              For <code>cookies</code>, inspect both layers. The
              <a href="https://developer.chrome.com/docs/extensions/reference/api/cookies" rel="noopener noreferrer"> cookies API</a>{" "}requires
              its named permission plus host permission for the sites whose cookies it
              accesses. A host declaration alone doesn&apos;t grant that API. Check which
              cookie values the extension reads or changes, then follow any messages or
              requests carrying them.
            </p>
          </section>

          <section>
            <h2>Host permissions and content script matches</h2>
            <p>
              In <code>host_permissions</code>, <code>https://api.example.com/*</code>{" "}names
              a host the extension can interact with, subject to the APIs it uses.
              Read its network calls to learn whether it retrieves public settings or
              sends page content. The manifest alone won&apos;t answer that.
            </p>
            <p>
              Host permission paths are ignored. Writing <code>/public/*</code>{" "}instead
              of <code>/*</code>{" "}doesn&apos;t restrict host permission to that directory.
              <code> &lt;all_urls&gt;</code>{" "}covers permitted URL schemes across hosts;
              it doesn&apos;t override Chrome&apos;s restricted pages. Use the
              <a href="https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns" rel="noopener noreferrer"> match pattern reference</a>{" "}to
              check the scope.
            </p>
            <p>
              <code>content_scripts.matches</code>{" "}has a different job: choosing pages
              for declared scripts. Those scripts don&apos;t need duplicate host permissions
              for their declared injection. Open the listed files and inspect their DOM
              access, messages, and data use. Chrome&apos;s
              <a href="https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts" rel="noopener noreferrer"> content script guide</a>{" "}covers
              the injection methods.
            </p>
          </section>

          <section>
            <h2>Optional permissions are requests for later</h2>
            <p>
              A name in <code>optional_permissions</code>{" "}isn&apos;t automatically granted
              at installation. In our example, an export button might request
              <code> downloads</code>. Find <code>chrome.permissions.request</code>{" "}and
              check what happens if the user refuses. The same review applies to
              <code> optional_host_permissions</code>{" "}for an additional website integration.
            </p>
            <p>
              Check the grant, too. An installed extension can use
              <code> chrome.permissions.contains</code>{" "}to test a specific grant, or
              <code> getAll</code>{" "}to list the permissions it currently holds.
              Users can withhold site access, so a downloaded manifest cannot tell you
              what a particular user approved.
              The <a href="https://developer.chrome.com/docs/extensions/reference/api/permissions" rel="noopener noreferrer">Permissions API reference</a>{" "}documents
              runtime requests and permission checks.
            </p>
          </section>

          <section id="activetab">
            <h2>activeTab is temporary, user-triggered access</h2>
            <p>
              <code>activeTab</code>{" "}grants temporary host access after a qualifying action,
              such as clicking the extension&apos;s toolbar button. It doesn&apos;t continuously
              cover every open tab. Access can survive navigation within the same origin,
              but ends when the user moves to a different origin or closes the tab.
              Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/activeTab" rel="noopener noreferrer">activeTab guide</a>{" "}explains
              the lifetime and restricted pages.
            </p>
            <p>
              For a tool that acts only when clicked, check whether that temporary grant
              fits the feature. A content blocker that works throughout browsing may
              need a different access model. Broad access deserves an explanation; it
              isn&apos;t evidence of malicious intent by itself.
            </p>
          </section>

          <section>
            <h2>Warnings help, but they aren&apos;t a safety verdict</h2>
            <p>
              Chrome combines some warnings, and some permissions show no warning at all.
              You can&apos;t reconstruct the whole manifest from an installation dialog.
              Chrome&apos;s <a href="https://developer.chrome.com/docs/extensions/develop/concepts/permission-warnings" rel="noopener noreferrer">warning guidelines</a>{" "}also
              explain why adding a permission that triggers a warning can require renewed
              approval after an update.
            </p>
            <p>
              Keep a short review record: package version, declared access, the feature
              that needs it, and the code you checked. Our <a href="/blog/backup-chrome-extension-package">backup workflow</a>{" "}includes
              a record template. If a host or permission still has no clear purpose,
              write down that exact question and follow the relevant code using our
              <a href="/blog/view-chrome-extension-source-without-installing"> source inspection guide</a>.
              That gives the next reviewer something concrete to verify.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
