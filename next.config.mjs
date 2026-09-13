/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/sitemap/sitemap.xml",
        destination: "/sitemap.xml",
        permanent: true
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "crxfile.xyz"
          }
        ],
        destination: "https://www.crxfile.xyz/:path*",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
