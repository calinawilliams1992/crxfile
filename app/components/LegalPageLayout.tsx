import { PackageCheck } from "lucide-react";
import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";

type LegalPageLayoutProps = {
  title: string;
  summary: string;
  effectiveDate: string;
  children: ReactNode;
};

export function LegalPageLayout({
  title,
  summary,
  effectiveDate,
  children
}: LegalPageLayoutProps) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="CRXFile home">
          <span className="brand-mark">
            <PackageCheck size={22} aria-hidden="true" />
          </span>
          <span>CRXFile</span>
        </a>
        <nav className="primary-nav" aria-label="Primary navigation">
          <a href="/#tool">CRX File Downloader</a>
          <a href="/blog">Blog</a>
        </nav>
        <div aria-hidden="true" />
      </header>

      <main className="legal-main">
        <article className="legal-article">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/">CRX File Downloader</a>
            <span aria-hidden="true">/</span>
            <span>{title}</span>
          </nav>

          <header className="article-header">
            <p className="article-kicker">CRXFile Legal</p>
            <h1>{title}</h1>
            <p className="article-dek">{summary}</p>
            <p className="article-meta">
              Effective <time dateTime={effectiveDate}>{effectiveDate}</time>
            </p>
          </header>

          <div className="legal-content">{children}</div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
