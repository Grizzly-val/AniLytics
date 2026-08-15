import Link from "next/link";

export function GenreAnimesBreadcrumb() {
  return (
    <nav className="flex items-center gap-2 text-xs font-medium text-neutral-400">
      <Link href="/" className="hover:text-neutral-200 transition">
        Home
      </Link>
      <span>/</span>
      <Link href="/seasonal" className="hover:text-neutral-200 transition">
        Seasonal Analytics
      </Link>
      <span>/</span>
      <span>Genres</span>
      <span>/</span>
      <span className="text-indigo-400 font-semibold">Genre Animes</span>
    </nav>
  );
}
