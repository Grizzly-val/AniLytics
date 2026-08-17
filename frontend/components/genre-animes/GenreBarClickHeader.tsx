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
    <div className="space-y-4">
      <Link
        href="/seasonal/genres/aggregates"
        className="inline-flex items-center gap-2 text-xs font-mono text-[var(--purple-300)] hover:text-white transition-colors"
        id="back-to-genre-data-link"
      >
        &larr; Back to Genre Aggregates
      </Link>

      <div className="flex items-baseline gap-3.5 flex-wrap">
        <h1 className="font-display font-normal text-[clamp(30px,4vw,40px)] tracking-[-0.02em] bg-gradient-to-b from-white via-white to-[var(--purple-300)] bg-clip-text text-transparent">
          {activeGenreName || "Genre Animes"}
        </h1>
        {activeSeason && activeYear && activeFormat && (
          <>
            <div className="w-[1px] h-3.5 bg-[var(--line-soft)] self-center" />
            <span className="font-mono text-[11.5px] tracking-[0.06em] uppercase text-[var(--text-low)]">
              {activeSeason} {activeYear} · {activeFormat}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

