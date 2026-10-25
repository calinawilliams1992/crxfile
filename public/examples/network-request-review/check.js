import { sendTitleForReview } from "./request.js";

const scenario = document.getElementById("scenario");
const status = document.getElementById("status");
const output = document.getElementById("result");
document.getElementById("run").addEventListener("click", async () => {
  const kind = scenario.value;
  const calls = [];
  const mockFetch = async (url, options) => {
    calls.push({ url, ...options, body: JSON.parse(options.body) });
    return { ok: kind !== "server", status: kind === "server" ? 503 : 204 };
  };
  const pageUrl = kind === "protocol"
    ? "http://example.com/account?sample=demo#details"
    : "https://example.com/account?sample=demo#details";
  const title = kind === "length" ? "x".repeat(121) : "Demo account";
  let result;
  try {
    result = { status: await sendTitleForReview(pageUrl, title, mockFetch) };
  } catch (error) {
    result = { error: error.message };
  }
  const valid = kind === "valid" && result.status === 204 && calls.length === 1;
  const rejected = ["protocol", "length"].includes(kind) && result.error?.startsWith("Expected") && calls.length === 0;
  const failed = kind === "server" && result.error === "HTTP 503" && calls.length === 1;
  status.textContent = `${valid || rejected || failed ? "PASS" : "FAIL"}: ${kind}; mock calls: ${calls.length}; ${result.error || `HTTP ${result.status}`}`;
  output.textContent = JSON.stringify({ pageUrl, title, mockCalls: calls.length, result, capturedRequests: calls }, null, 2);
});
