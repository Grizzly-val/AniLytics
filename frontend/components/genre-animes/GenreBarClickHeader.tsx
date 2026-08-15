import Link from "next/link";
import { Season, MediaFormat } from "@/lib/types";

interface GenreBarClickHeaderProps {
  activeGenreName: string;
  activeSeason: Season | null;
  activeYear: number | null;
  activeFormat: MediaFormat | null;
}

export function GenreBarClickHeader({
  activeGenreName,
  activeSeason,
  activeYear,
  activeFormat,
}: GenreBarClickHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-800 pb-6">
      <div>
        <Link
          href="/seasonal/genres/aggregates"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition mb-2"
          id="back-to-genre-data-link"
        >
          &larr; Back to Genre Aggregates
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {activeGenreName || "Genre Animes"}
            </span>
          </h1>
          {activeSeason && activeYear && activeFormat && (
            <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-neutral-300 border border-neutral-700">
              {activeSeason} {activeYear} • {activeFormat}
            </span>
          )}
        </div>
        <p className="text-neutral-400 text-sm mt-1">
          Detailed breakdown and performance analytics for {activeGenreName || "the selected"} anime genre.
        </p>
      </div>
    </div>
  );
}
