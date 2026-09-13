"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_MEASUREMENT_ID = "G-FXT8B44M45";
const CONSENT_KEY = "crxfile-analytics-consent";

type Consent = "accepted" | "declined" | "pending";

export function GoogleAnalytics() {
  const [consent, setConsent] = useState<Consent>("pending");

  useEffect(() => {
    const savedConsent = window.localStorage.getItem(CONSENT_KEY);
    if (savedConsent === "accepted" || savedConsent === "declined") {
      setConsent(savedConsent);
    }
  }, []);

  function saveConsent(nextConsent: Exclude<Consent, "pending">) {
    window.localStorage.setItem(CONSENT_KEY, nextConsent);
    setConsent(nextConsent);
  }

  return (
    <>
      {consent === "accepted" ? (
        <>
          <Script
            src={"https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {"window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '" +
              GA_MEASUREMENT_ID +
              "');"}
          </Script>
        </>
      ) : null}

      {consent === "pending" ? (
        <aside className="consent-banner" aria-label="Analytics preferences">
          <p>
            We use optional analytics to understand site use. You can accept or decline; the
            downloader works either way. Read our <a href="/privacy-policy">Privacy Policy</a>.
          </p>
          <div className="consent-actions">
            <button className="consent-decline" type="button" onClick={() => saveConsent("declined")}>
              Decline
            </button>
            <button className="consent-accept" type="button" onClick={() => saveConsent("accepted")}>
              Accept analytics
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
