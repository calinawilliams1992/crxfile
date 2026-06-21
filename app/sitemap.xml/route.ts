import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.redirect(new URL("/sitemap/sitemap.xml", "https://www.crxfile.xyz"), 308);
}
