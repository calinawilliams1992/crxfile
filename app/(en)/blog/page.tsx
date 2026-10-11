import type { Metadata } from "next";
import { ArrowUpRight, PackageCheck } from "lucide-react";
import { SiteFooter } from "@/app/components/SiteFooter";
import { BLOG_URL, blogPostDate, blogPosts, blogPostUrl } from "@/lib/blog";
import styles from "./blog.module.css";

const title = "Blog: Chrome & Edge Extension Guides";
const description =
  "Browse CRXFile guides to Chrome and Edge extensions. Find extension IDs, download CRX and ZIP packages, and learn how to inspect extension source files.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: BLOG_URL,
    title,
    description,
    siteName: "CRXFile"
  },
  twitter: { card: "summary", title, description }
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "CRXFile Blog",
  description,
  url: BLOG_URL,
  inLanguage: "en",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: blogPosts.length,
    itemListElement: blogPosts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        url: blogPostUrl(post),
        datePublished: post.publishedAt,
        dateModified: post.modifiedAt,
        author: { "@type": "Organization", name: "CRXFile" }
      }
    }))
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "CRX File Downloader", item: "https://www.crxfile.xyz/" },
    { "@type": "ListItem", position: 2, name: "Blog", item: BLOG_URL }
  ]
};

export default function BlogPage() {
  return (
    <div className="site-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
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

      <main className={styles.main}>
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">CRX File Downloader</a><span aria-hidden="true">/</span>
          <span aria-current="page">Blog</span>
        </nav>

        <header className={styles.intro}>
          <h1>CRXFile Blog</h1>
          <p>
            Practical guides to Chrome and Edge extensions, from finding an ID to
            downloading and reviewing a package.
          </p>
        </header>

        <section aria-labelledby="articles-heading">
          <div className={styles.listHeader}>
            <h2 id="articles-heading">All articles</h2>
            <p>{blogPosts.length} guides · Newest first</p>
          </div>
          <ol className={styles.posts}>
            {blogPosts.map((post, index) => (
              <li key={post.path}>
                <article>
                  <a className={styles.post} href={post.path} aria-labelledby={`post-title-${index}`}>
                    <div className={styles.details}>
                      <span className={styles.category}>{post.category}</span>
                      <time dateTime={post.publishedAt}>{blogPostDate(post.publishedAt)}</time>
                      <span>{post.readingMinutes} min read</span>
                    </div>
                    <div className={styles.content}>
                      <h3 id={`post-title-${index}`}>{post.title}</h3>
                      <p>{post.description}</p>
                      <span className={styles.readLink}>
                        Read guide <ArrowUpRight size={17} aria-hidden="true" />
                      </span>
                    </div>
                  </a>
                </article>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
