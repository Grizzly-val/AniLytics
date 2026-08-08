"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboards } from "@/lib/dashboards";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90 transition"
          >
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              AniLytics
            </span>
          </Link>
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {dashboards.map((dash) => {
              const href = `/${dash.slug}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={dash.slug}
                  href={href}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
                  }`}
                >
                  {dash.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
