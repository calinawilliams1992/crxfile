import type { Metadata } from "next";
import { LegalPageLayout } from "@/app/components/LegalPageLayout";

const effectiveDate = "2026-09-14";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing use of CRXFile to retrieve publicly available Chrome and Edge extension packages.",
  alternates: {
    canonical: "/terms-of-service"
  }
};

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      summary="These terms set the permitted, responsible use of CRXFile and its public extension package downloader."
      effectiveDate={effectiveDate}
    >
      <section>
        <h2>Acceptance of these terms</h2>
        <p>
          By accessing or using CRXFile, you agree to these Terms of Service. If you use the
          service for an organization, you confirm that you are authorized to accept these terms on
          its behalf. If you do not agree, do not use the service.
        </p>
      </section>

      <section>
        <h2>The service</h2>
        <p>
          CRXFile helps you retrieve publicly available Chrome Web Store and Microsoft Edge
          Add-ons packages as CRX files or ZIP source packages. It is intended for learning,
          permitted backup, security review, development, and legitimate administration. CRXFile
          is independent of Google and Microsoft and is not affiliated with, endorsed by, or
          sponsored by either company.
        </p>
      </section>

      <section>
        <h2>Responsible use</h2>
        <p>You may use the service only in compliance with applicable law and the relevant extension license.</p>
        <ul>
          <li>Use it only for packages that are publicly available through the official stores.</li>
          <li>Respect copyright, trademarks, licenses, and the rights of extension publishers.</li>
          <li>Do not use CRXFile to bypass payment, authentication, private listings, enterprise controls, regional restrictions, or other access controls.</li>
          <li>Do not overload, probe, disrupt, reverse engineer, or otherwise interfere with the service or its upstream providers.</li>
          <li>Do not use downloaded packages to distribute malware, infringe rights, or violate another party&apos;s terms.</li>
        </ul>
      </section>

      <section>
        <h2>Third-party services and content</h2>
        <p>
          Extension listings, packages, names, icons, and other content belong to their respective
          owners. Your access to Chrome Web Store, Microsoft Edge Add-ons, and any extension
          package is also subject to the applicable third-party terms and policies. CRXFile does
          not control, review, endorse, or warrant third-party content.
        </p>
      </section>

      <section>
        <h2>Availability and changes</h2>
        <p>
          The service depends on third-party endpoints and may be unavailable, delayed, changed,
          or discontinued at any time. We may modify, suspend, or limit the service, including
          implementing rate limits or blocking abusive activity, to protect users and infrastructure.
        </p>
      </section>

      <section>
        <h2>Disclaimers and limitation of liability</h2>
        <p>
          CRXFile is provided on an “as is” and “as available” basis, without warranties of any
          kind to the extent permitted by law. We do not guarantee that a package is available,
          accurate, safe, compatible, complete, or suitable for your purpose. You are responsible
          for examining and using downloaded files safely.
        </p>
        <p>
          To the maximum extent permitted by law, CRXFile and its operators are not liable for
          indirect, incidental, special, consequential, or punitive damages, or for loss arising
          from your use of, or inability to use, the service or a third-party package.
        </p>
      </section>

      <section>
        <h2>Privacy and updates</h2>
        <p>
          Our <a href="/privacy-policy">Privacy Policy</a> describes how the service handles
          information. We may revise these Terms from time to time; the effective date above shows
          when they were last updated. Continued use after an update means you accept the revised
          Terms.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          For a question about these Terms, open an{" "}
          <a href="https://github.com/calinawilliams1992/crxfile/issues">issue in the CRXFile repository</a>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
