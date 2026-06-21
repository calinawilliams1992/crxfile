import { NextRequest, NextResponse } from "next/server";
import { crxToZipStream } from "@/lib/crx";
import { asStore, isValidExtensionId, storeName } from "@/lib/input";
import { rateLimit } from "@/lib/rateLimit";
import { contentDisposition, CrxDownloadError, fetchCrxPackage, resolveExtensionMeta } from "@/lib/store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    format: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { format } = await context.params;
  const downloadFormat = format === "crx" || format === "zip" ? format : null;

  if (!downloadFormat) {
    return NextResponse.json({ error: "invalid_format", message: "Use /api/download/crx or /api/download/zip." }, { status: 404 });
  }

  const clientIp = getClientIp(request);
  const limit = rateLimit(`download:${clientIp}`, 40, 60_000);

  if (!limit.ok) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: `Too many downloads. Please try again in ${limit.retryAfter} seconds.`,
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

  const id = request.nextUrl.searchParams.get("id")?.trim().toLowerCase() ?? "";
  const store = asStore(request.nextUrl.searchParams.get("store"));

  if (!store || !isValidExtensionId(id, store)) {
    return NextResponse.json(
      {
        error: "invalid_input",
        message: "Please provide a valid extension ID and store."
      },
      { status: 400 }
    );
  }

  let filenameBase = `${storeName(store).replace(/\s+/g, "_")}_${id}`;

  try {
    const meta = await resolveExtensionMeta(id, store);
    filenameBase = `${meta.name}${meta.version ? `_${meta.version}` : ""}${downloadFormat === "zip" ? "_source" : ""}`;
  } catch {
    if (downloadFormat === "zip") {
      filenameBase = `${filenameBase}_source`;
    }
  }

  try {
    const upstream = await fetchCrxPackage(id, store);
    const body = downloadFormat === "zip" ? crxToZipStream(upstream.body!) : upstream.body;
    const headers = new Headers({
      "Content-Disposition": contentDisposition(filenameBase, downloadFormat),
      "Content-Type": downloadFormat === "zip" ? "application/zip" : "application/x-chrome-extension",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    });

    if (downloadFormat === "crx") {
      const contentLength = upstream.headers.get("content-length");
      if (contentLength) {
        headers.set("Content-Length", contentLength);
      }
    }

    return new Response(body, {
      status: 200,
      headers
    });
  } catch (error) {
    if (error instanceof CrxDownloadError) {
      return NextResponse.json(
        {
          error: "download_failed",
          message: error.message,
          status: error.status,
          detail: error.detail
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        error: "download_failed",
        message: "The extension package could not be downloaded from the official store right now.",
        detail: error instanceof Error ? error.message : "Unknown download error."
      },
      { status: 502 }
    );
  }
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || "local";
}
