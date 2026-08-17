import Link from "next/link";

export function GenreAnimesBreadcrumb() {
  return (
    <nav className="flex items-center gap-2 flex-wrap font-mono text-[11.5px] tracking-[0.03em] uppercase text-[var(--text-low)]">
      <Link href="/" className="hover:text-[var(--text-mid)] transition-colors duration-200">
        Home
      </Link>
      <span className="text-[var(--line)]">/</span>
      <Link href="/seasonal" className="hover:text-[var(--text-mid)] transition-colors duration-200">
        Seasonal Analytics
      </Link>
      <span className="text-[var(--line)]">/</span>
      <Link href="/seasonal/genres/aggregates" className="hover:text-[var(--text-mid)] transition-colors duration-200">
        Genres
      </Link>
      <span className="text-[var(--line)]">/</span>
      <span className="text-[var(--purple-300)]">Genre Animes</span>
    </nav>
  );
}

