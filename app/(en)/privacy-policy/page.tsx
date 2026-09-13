import type { Metadata } from "next";
import { LegalPageLayout } from "@/app/components/LegalPageLayout";

const effectiveDate = "2026-09-14";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how CRXFile handles extension URLs, short-lived technical data, analytics preferences, and public package downloads.",
  alternates: {
    canonical: "/privacy-policy"
  }
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      summary="This notice explains what CRXFile processes to provide the downloader, including its use of analytics."
      effectiveDate={effectiveDate}
    >
      <section>
        <h2>Scope</h2>
        <p>
          This Privacy Policy applies to crxfile.xyz and the CRXFile downloader. CRXFile is a
          website, not a browser extension, and it does not require you to create an account.
        </p>
      </section>

      <section>
        <h2>Information used to provide the service</h2>
        <p>
          When you submit a Chrome Web Store or Microsoft Edge Add-ons URL, or a 32-character
          extension ID, we process that value to locate public extension metadata and obtain the
          download you requested. The value is sent to the relevant official store endpoint as
          needed to complete the request.
        </p>
        <p>
          We also use limited technical request information, including an IP address supplied by
          your connection or hosting platform, for short-lived abuse protection. Our in-application
          rate-limit entries are held in memory for up to one minute. Public extension metadata may
          be temporarily held in memory to make repeat requests faster; it is not an account or a
          personal profile.
        </p>
      </section>

      <section>
        <h2>Downloads and extension data</h2>
        <p>
          CRXFile relays public packages from official Chrome Web Store and Microsoft Edge Add-ons
          endpoints. Downloaded packages are streamed for the current request and are not
          persistently stored by the application. We do not ask you to upload files, provide a
          password, or send private extension content.
        </p>
      </section>

      <section>
        <h2>Analytics and cookies</h2>
        <p>
          CRXFile uses Google Analytics 4 to understand how visitors use the site and improve the
          downloader. Google may process usage, browser, device, and cookie information under its
          own policies. See the <a href="https://policies.google.com/privacy">Google Privacy Policy</a>{" "}
          for information about Google&apos;s processing.
        </p>
      </section>

      <section>
        <h2>Service providers and disclosures</h2>
        <p>
          Requests necessarily involve the official store you select, such as Google or Microsoft.
          Our hosting and infrastructure providers may process ordinary server logs to operate,
          secure, and troubleshoot the service. We do not sell personal information or use the
          submitted extension URL or ID to create advertising profiles.
        </p>
        <p>
          We may disclose information where reasonably necessary to protect the service, prevent
          abuse, comply with applicable law, or respond to a valid legal process.
        </p>
      </section>

      <section>
        <h2>Data security and retention</h2>
        <p>
          We use reasonable technical measures appropriate to the service, but no internet
          transmission or system can be guaranteed completely secure. Do not submit sensitive
          personal information through the downloader. Data retention by third-party stores,
          analytics, and hosting providers is governed by their own policies.
        </p>
      </section>

      <section>
        <h2>Changes and contact</h2>
        <p>
          We may update this Privacy Policy when the service or applicable requirements change. The
          effective date above shows when it was last revised. For a privacy question, open an{" "}
          <a href="https://github.com/calinawilliams1992/crxfile/issues">issue in the CRXFile repository</a>{" "}
          and do not include sensitive personal information.
        </p>
      </section>
    </LegalPageLayout>
  );
}
