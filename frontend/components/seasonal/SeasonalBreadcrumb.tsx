import Link from "next/link";

export function SeasonalBreadcrumb() {
  return (
    <nav className="flex items-center gap-2 flex-wrap font-mono text-[11.5px] tracking-[0.03em] uppercase text-[var(--text-low)]">
      <Link href="/" className="hover:text-[var(--text-mid)] transition-colors duration-200">
        Home
      </Link>
      <span className="text-[var(--line)]">/</span>
      <Link href="/easy-anilytics/filter-by" className="hover:text-[var(--text-mid)] transition-colors duration-200">
        Easy-AniLytics
      </Link>
      <span className="text-[var(--line)]">/</span>
      <Link href="/easy-anilytics/filter-by" className="hover:text-[var(--text-mid)] transition-colors duration-200">
        Filter by
      </Link>
      <span className="text-[var(--line)]">/</span>
      <span className="text-[var(--purple-300)]">Seasonal</span>
    </nav>
  );
}


