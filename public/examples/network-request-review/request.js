// Original CRXFile teaching example. MIT License (see repository LICENSE).
export async function sendTitleForReview(pageUrl, title, fetcher = fetch) {
  const page = new URL(pageUrl);
  if (page.protocol !== "https:" || typeof title !== "string" || title.length > 120) {
    throw new TypeError("Expected an HTTPS URL and a title of at most 120 characters.");
  }

  const endpoint = "https://collector.example/v1/review";
  const response = await fetcher(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "omit",
    redirect: "error",
    body: JSON.stringify({ origin: page.origin, title })
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.status;
}
