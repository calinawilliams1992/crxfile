import { CrxFileApp } from "./components/CrxFileApp";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a CRX file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A CRX file is the official package format Chromium browsers use to distribute extensions. It works like a signed ZIP archive with a browser-verifiable header and contains extension source files. When you install from Chrome Web Store, the browser downloads this package in the background, but store pages do not provide a direct download button. CRX files matter for developers auditing permissions, users making backups, and IT teams managing browsers. A CRX extractor can unpack the package into JavaScript, HTML, CSS, assets, and manifest.json."
      }
    },
    {
      "@type": "Question",
      name: "What is the difference between .crx and .zip?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A .crx keeps the browser signature header intact and is used for manual extension installation. A .zip strips that header so the extension source files can be opened directly."
      }
    },
    {
      "@type": "Question",
      name: "Why can I not double-click a downloaded CRX file to install it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Chrome and Edge restrict external installs by design. To install a CRX file manually, open chrome://extensions or edge://extensions, enable Developer mode, and drag the CRX file into the extensions page."
      }
    },
    {
      "@type": "Question",
      name: "Do I need to log in or pay to download CRX?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. CRXFile is a free CRX downloader with no registration, login, or payment required. Use it anytime to get CRX files or extract extension source."
      }
    },
    {
      "@type": "Question",
      name: "Does CRXFile save my downloads or personal data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No account is needed, and the service does not persistently store any CRX file downloads. Requests are proxied only to complete the current download."
      }
    },
    {
      "@type": "Question",
      name: "Which stores does this CRX extractor support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CRXFile supports public packages from Chrome Web Store and Microsoft Edge Add-ons. Both stores use the same underlying CRX file format."
      }
    },
    {
      "@type": "Question",
      name: "Can I download paid or private extensions with this CRX downloader?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. CRXFile cannot bypass paid access, private listings, enterprise restrictions, or authorization controls. Only publicly listed free extensions are accessible."
      }
    },
    {
      "@type": "Question",
      name: "What if a download fails when I try to get CRX?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The extension may be unpublished, region-restricted, enterprise-restricted, or temporarily unavailable from the store endpoint. Verify the ID is correct and try again later."
      }
    },
    {
      "@type": "Question",
      name: "Is downloading CRX files legal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, for learning, personal backup, and security auditing. Do not use any CRX downloader to infringe copyright, resell packages, or redistribute paid content."
      }
    },
    {
      "@type": "Question",
      name: "Can CRXFile download removed extensions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Usually no. The ability to download CRX depends on the store's current public update endpoint. Once an extension is unpublished, its CRX file may no longer be retrievable."
      }
    },
    {
      "@type": "Question",
      name: "What is the CRX file format version?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Modern CRX files use version 3 of the format, also called CRX3, which uses SHA-256 hashing and improved signing. CRXFile handles this transparently."
      }
    }
  ]
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <CrxFileApp />
    </>
  );
}
