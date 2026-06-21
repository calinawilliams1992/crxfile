/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
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
