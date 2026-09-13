import { PackageCheck } from "lucide-react";

export type FooterLabels = {
  tagline: string;
  product: string;
  resources: string;
  legal: string;
  downloader: string;
  guide: string;
  blog: string;
  privacy: string;
  terms: string;
  copyright: string;
  disclaimer: string;
};

const englishLabels: FooterLabels = {
  tagline:
    "A simple way to retrieve public Chrome and Edge extension packages for backup, source review, and legitimate development.",
  product: "Product",
  resources: "Resources",
  legal: "Legal",
  downloader: "CRX File Downloader",
  guide: "How it works",
  blog: "Blog",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  copyright: "© 2026 CRXFile. All rights reserved.",
  disclaimer:
    "CRXFile is independent from Google and Microsoft. Chrome and Edge trademarks belong to their respective owners."
};

type SiteFooterProps = {
  labels?: FooterLabels;
  toolHref?: string;
  guideHref?: string;
};

export function SiteFooter({
  labels = englishLabels,
  toolHref = "/#tool",
  guideHref = "/#guide"
}: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a className="footer-logo" href={toolHref} aria-label="CRXFile home">
            <span className="footer-mark">
              <PackageCheck size={20} aria-hidden="true" />
            </span>
            <span>CRXFile</span>
          </a>
          <p>{labels.tagline}</p>
        </div>

        <div className="footer-navigation">
          <nav className="footer-group" aria-label={labels.product}>
            <h2>{labels.product}</h2>
            <a href={toolHref}>{labels.downloader}</a>
          </nav>
          <nav className="footer-group" aria-label={labels.resources}>
            <h2>{labels.resources}</h2>
            <a href={guideHref}>{labels.guide}</a>
            <a href="/blog">{labels.blog}</a>
          </nav>
          <nav className="footer-group" aria-label={labels.legal}>
            <h2>{labels.legal}</h2>
            <a href="/privacy-policy">{labels.privacy}</a>
            <a href="/terms-of-service">{labels.terms}</a>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{labels.copyright}</p>
        <p>{labels.disclaimer}</p>
      </div>
    </footer>
  );
}
