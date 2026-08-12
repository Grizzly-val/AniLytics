import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/genres",
        destination: "/seasonal",
        permanent: true,
      },
      {
        source: "/genres/aggregates",
        destination: "/seasonal/genres/aggregates",
        permanent: true,
      },
      {
        source: "/genres/genre-animes",
        destination: "/seasonal/genres/genre-animes",
        permanent: true,
      },
      {
        source: "/genres/genre-animes/:genre*",
        destination: "/seasonal/genres/genre-animes/:genre*",
        permanent: true,
      },
      {
        source: "/genre-data",
        destination: "/seasonal/genres/aggregates",
        permanent: true,
      },
      {
        source: "/genre-detail",
        destination: "/seasonal/genres/genre-animes",
        permanent: true,
      },
      {
        source: "/genre-detail/:genre*",
        destination: "/seasonal/genres/genre-animes/:genre*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
