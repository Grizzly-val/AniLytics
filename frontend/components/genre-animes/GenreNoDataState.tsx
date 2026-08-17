import { Season, MediaFormat } from "@/lib/types";

interface GenreNoDataStateProps {
  activeGenreName: string;
  activeSeason: Season;
  activeYear: number;
  activeFormat: MediaFormat;
}

export function GenreNoDataState({
  activeGenreName,
  activeSeason,
  activeYear,
  activeFormat,
}: GenreNoDataStateProps) {
  return (
    <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-12 text-center space-y-4">
      <div className="text-4xl">📊</div>
      <h3 className="text-xl font-bold text-white">
        No data for &quot;{activeGenreName || "selected genre"}&quot;
      </h3>
      <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto font-normal">
        No anime matching the genre &quot;{activeGenreName}&quot; were found in the selected {activeSeason} {activeYear} ({activeFormat}) dataset. Try adjusting your filters and clicking Load Genres.
      </p>
    </div>
  );
}
