import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "../components/GoogleAnalytics";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.crxfile.xyz"),
  title: {
    default: "CRX File Extractor & Downloader — Get CRX Files Free Online",
    template: "%s | CRXFile"
  },
  description:
    "Free online CRX file extractor and CRX downloader. Get CRX and ZIP source files from Chrome Web Store and Edge Add-ons instantly. Download CRX files with no login required.",
  keywords: [
    "crx file",
    "crx extractor",
    "get crx",
    "crx downloader",
    "download crx",
    "download crx file",
    "Chrome extension source code",
    "Edge add-ons downloader"
  ],
  openGraph: {
    type: "website",
    url: "https://www.crxfile.xyz",
    title: "CRX File Extractor & Downloader — Get CRX Files Free Online",
    description:
      "Free online CRX file extractor and CRX downloader. Get CRX and ZIP source files from Chrome Web Store and Edge Add-ons instantly.",
    siteName: "CRXFile"
  },
  twitter: {
    card: "summary",
    title: "CRX File Extractor & Downloader — Get CRX Files Free Online",
    description:
      "Free online CRX file extractor and CRX downloader. Get CRX and ZIP source files from Chrome Web Store and Edge Add-ons instantly."
  },
  icons: {
    icon: "/favicon.svg"
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d3b66"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
