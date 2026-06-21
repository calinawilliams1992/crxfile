import { NextRequest, NextResponse } from "next/server";
import { asStore, parseExtensionInput } from "@/lib/input";
import { rateLimit } from "@/lib/rateLimit";
import { resolveExtensionMeta } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const limit = rateLimit(`parse:${clientIp}`, 20, 60_000);

  if (!limit.ok) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: `Too many requests. Please try again in ${limit.retryAfter} seconds.`,
        retryAfter: limit.retryAfter
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfter)
        }
      }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json", message: "Invalid JSON payload." }, { status: 400 });
  }

  const body = payload as { input?: unknown; url?: unknown; id?: unknown; store?: unknown };
  const input = String(body.input ?? body.url ?? body.id ?? "");
  const selectedStore = asStore(body.store) ?? "chrome";
  const parsed = parseExtensionInput(input, selectedStore);

  if (!parsed.ok) {
    return NextResponse.json(
      {
        error: parsed.reason,
        message: "Please enter a valid Chrome Web Store or Edge Add-ons URL, or a valid extension ID."
      },
      { status: 400 }
    );
  }

  try {
    const plugin = await resolveExtensionMeta(parsed.id, parsed.store);

    return NextResponse.json({
      plugin,
      input: {
        id: parsed.id,
        store: parsed.store,
        source: parsed.source,
        normalizedInput: parsed.normalizedInput
      },
      downloads: {
        crx: `/api/download/crx?id=${encodeURIComponent(parsed.id)}&store=${parsed.store}`,
        zip: `/api/download/zip?id=${encodeURIComponent(parsed.id)}&store=${parsed.store}`
      }
    });
  } catch {
    return NextResponse.json(
      {
        error: "not_found",
        message: "Extension not found. Please check whether the link or ID is correct."
      },
      { status: 404 }
    );
  }
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || "local";
}
