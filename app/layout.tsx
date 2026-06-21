import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.crxfile.xyz"),
  title: {
    default: "CRX File Downloader & CRX Extractor | Download CRX and ZIP Source",
    template: "%s | CRXFile"
  },
  description:
    "Download CRX files and extract browser extension source code as ZIP from Chrome Web Store and Microsoft Edge Add-ons. Free CRX downloader, no login required.",
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
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: "https://www.crxfile.xyz",
    title: "CRX File Downloader & CRX Extractor",
    description:
      "Paste a Chrome Web Store or Edge Add-ons link to get the official CRX package or a ZIP source archive.",
    siteName: "CRXFile"
  },
  twitter: {
    card: "summary",
    title: "CRX File Downloader & CRX Extractor",
    description:
      "Free browser extension CRX downloader and source ZIP extractor for Chrome Web Store and Edge Add-ons."
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
      <body>{children}</body>
    </html>
  );
}
