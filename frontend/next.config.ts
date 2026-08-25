import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/seasonal",
        destination: "/easy-anilytics/filter-by/seasonal",
        permanent: true,
      },
      {
        source: "/seasonal/genres/:path*",
        destination: "/easy-anilytics/filter-by/seasonal",
        permanent: true,
      },
      {
        source: "/genres",
        destination: "/easy-anilytics/filter-by/seasonal",
        permanent: true,
      },
      {
        source: "/genres/:path*",
        destination: "/easy-anilytics/filter-by/seasonal",
        permanent: true,
      },
      {
        source: "/genre-data",
        destination: "/easy-anilytics/filter-by/seasonal",
        permanent: true,
      },
      {
        source: "/genre-detail/:path*",
        destination: "/easy-anilytics/filter-by/seasonal",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
