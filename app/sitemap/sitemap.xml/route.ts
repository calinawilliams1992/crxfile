const SITE_URL = "https://www.crxfile.xyz";

const pages = [
  {
    url: `${SITE_URL}/`,
    changeFrequency: "weekly",
    priority: "1.0",
    alternates: {
      en: `${SITE_URL}/`,
      "zh-CN": `${SITE_URL}/zh`,
      "x-default": `${SITE_URL}/`
    }
  },
  {
    url: `${SITE_URL}/zh`,
    changeFrequency: "weekly",
    priority: "0.9",
    alternates: {
      en: `${SITE_URL}/`,
      "zh-CN": `${SITE_URL}/zh`,
      "x-default": `${SITE_URL}/`
    }
  }
];

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildSitemap() {
  const lastModified = new Date().toISOString();
  const urls = pages
    .map((page) => {
      const links = Object.entries(page.alternates)
        .map(
          ([language, href]) =>
            `    <xhtml:link rel="alternate" hreflang="${escapeXml(language)}" href="${escapeXml(
              href
            )}" />`
        )
        .join("\n");

      return `  <url>
    <loc>${escapeXml(page.url)}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
${links}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}

export function GET() {
  return new Response(buildSitemap(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400"
    }
  });
}
