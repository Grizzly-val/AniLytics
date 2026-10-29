"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="relative z-10 flex items-center justify-between border-b border-anilytics-line-soft px-5 py-4 sm:px-12 sm:py-5">
      <div className="flex items-center gap-5 sm:gap-6">
        <Link href="/" className="flex items-center gap-2.75 group">
          <div className="w-8.5 h-8.5 rounded-badge bg-gradient-brand-icon flex items-center justify-center shadow-glow shrink-0 transition-transform duration-200 group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4.25 h-4.25"
            >
              <path d="M12 3 2 8l10 5 10-5-10-5Z" />
              <path d="M2 13l10 5 10-5" />
            </svg>
          </div>
          <span className="font-display font-medium text-lg sm:text-title tracking-tight-2 text-anilytics-text-hi">
            AniLytics
          </span>
        </Link>

        <div className="w-px h-4.5 bg-anilytics-line-soft hidden sm:block" />

        <Link
          href="/easy-anilytics/filter-by"
          className={`nav-link-item ${
            pathname.startsWith("/easy-anilytics") ? "text-anilytics-text-hi font-semibold" : ""
          }`}
        >
          <span>Easy-AniLytics</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.25 h-3.25"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>

      <div className="hidden sm:flex items-center gap-2 font-mono text-caption tracking-wide-lg text-anilytics-text-low select-none">
        <span className="w-1.25 h-1.25 rounded-full bg-anilytics-purple-400 animate-pulse-dot" />
        AniList GraphQL
      </div>
    </nav>
  );
}
