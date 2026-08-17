"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="relative z-10 flex items-center justify-between border-b border-[var(--line-soft)] px-5 py-4 sm:px-12 sm:py-5">
      <div className="flex items-center gap-5 sm:gap-6">
        <Link href="/" className="flex items-center gap-2.75 group">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-[linear-gradient(145deg,#a463f7,#7c3aed)] flex items-center justify-center shadow-[0_4px_18px_rgba(124,58,237,0.35)] shrink-0 transition-transform duration-200 group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-[17px] h-[17px]"
            >
              <path d="M12 3 2 8l10 5 10-5-10-5Z" />
              <path d="M2 13l10 5 10-5" />
            </svg>
          </div>
          <span className="font-display font-medium text-lg sm:text-[19px] tracking-[-0.02em] text-[var(--text-hi)]">
            AniLytics
          </span>
        </Link>

        <div className="w-[1px] h-[18px] bg-[var(--line-soft)] hidden sm:block" />

        <Link
          href="/seasonal"
          className={`nav-link-item ${
            pathname.startsWith("/seasonal") ? "text-[var(--text-hi)] font-semibold" : ""
          }`}
        >
          <span>Seasonal Analytics</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[13px] h-[13px]"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>

      <div className="hidden sm:flex items-center gap-2 font-mono text-[11.5px] tracking-[0.04em] text-[var(--text-low)] select-none">
        <span className="w-[5px] h-[5px] rounded-full bg-[var(--purple-400)] animate-pulse-dot" />
        AniList GraphQL
      </div>
    </nav>
  );
}
