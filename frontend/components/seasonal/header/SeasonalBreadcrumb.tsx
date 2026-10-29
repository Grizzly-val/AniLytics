import Link from "next/link";

export function SeasonalBreadcrumb() {
  return (
    <nav className="flex items-center gap-2 flex-wrap font-mono text-caption tracking-wide-md uppercase text-anilytics-text-low">
      <Link href="/" className="hover:text-anilytics-text-mid transition-colors duration-200">
        Home
      </Link>
      <span className="text-anilytics-line">/</span>
      <Link href="/easy-anilytics/filter-by" className="hover:text-anilytics-text-mid transition-colors duration-200">
        Easy-AniLytics
      </Link>
      <span className="text-anilytics-line">/</span>
      <Link href="/easy-anilytics/filter-by" className="hover:text-anilytics-text-mid transition-colors duration-200">
        Filter by
      </Link>
      <span className="text-anilytics-line">/</span>
      <span className="text-anilytics-purple-300">Seasonal</span>
    </nav>
  );
}


