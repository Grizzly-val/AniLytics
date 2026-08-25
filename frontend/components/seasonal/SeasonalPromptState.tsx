import { Season } from "@/lib/types";

interface SeasonalPromptStateProps {
  availableGenresCount: number;
  availableFormatsCount: number;
  activeSeason: Season;
  activeYear: number;
}

export function SeasonalPromptState({
  availableGenresCount,
  availableFormatsCount,
  activeSeason,
  activeYear,
}: SeasonalPromptStateProps) {
  return (
    <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-10 text-center">
      <div className="mb-4 flex justify-center gap-2">
        <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-300">
          {availableGenresCount} Loaded Genres
        </span>
        <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
          {availableFormatsCount} Loaded Formats
        </span>
      </div>
      <div className="text-4xl">📺</div>
      <h3 className="mt-4 text-xl font-bold text-white">Choose a Genre or Format filter</h3>
      <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-neutral-400 font-normal">
        {availableGenresCount} genres and {availableFormatsCount} formats are ready for {activeSeason} {activeYear}. Select one filter dropdown above to inspect detailed analytics.
      </p>
    </div>
  );
}

