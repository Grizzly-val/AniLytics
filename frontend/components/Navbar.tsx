"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SUBJECTS } from "@/lib/subjects";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-white hover:opacity-90 transition group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <svg
                className="w-4 h-4 fill-current text-white"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AniLytics
            </span>
          </Link>

          <nav className="flex items-center space-x-1 sm:space-x-2">
            {SUBJECTS.map((subject) => {
              const isActive =
                pathname === subject.path ||
                pathname.startsWith(`${subject.path}/`);

              return (
                <Link
                  key={subject.id}
                  href={subject.path}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold shadow-sm shadow-indigo-500/10"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/80 border border-transparent"
                  }`}
                >
                  <span>{subject.navLabel}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs text-neutral-400 font-medium px-2.5 py-1 rounded-full border border-neutral-800 bg-neutral-900/60">
            AniList GraphQL Powered
          </span>
        </div>
      </div>
    </header>
  );
}
