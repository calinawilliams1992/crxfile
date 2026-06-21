import { CrxFileApp } from "./components/CrxFileApp";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a .crx file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A .crx file is the official package format used by Chromium-based browser extensions. It contains a ZIP payload plus browser signature metadata."
      }
    },
    {
      "@type": "Question",
      name: "What is the difference between CRX and ZIP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The CRX file keeps the extension signature header for browser installation. The ZIP source archive removes that header so the extension files can be opened and audited directly."
      }
    },
    {
      "@type": "Question",
      name: "Do I need an account to use CRXFile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. CRXFile is free to use and does not require sign-up, login, or payment."
      }
    },
    {
      "@type": "Question",
      name: "Which extension stores are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CRXFile currently supports public packages from Chrome Web Store and Microsoft Edge Add-ons."
      }
    },
    {
      "@type": "Question",
      name: "Can CRXFile download paid extensions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. CRXFile only retrieves publicly accessible official extension packages and cannot bypass paid access or authorization controls."
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
