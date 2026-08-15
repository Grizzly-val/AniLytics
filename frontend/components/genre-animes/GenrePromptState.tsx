import { Season, MediaFormat } from "@/lib/types";

interface GenrePromptStateProps {
  availableGenresCount: number;
  activeSeason: Season;
  activeYear: number;
  activeFormat: MediaFormat;
}

export function GenrePromptState({
  availableGenresCount,
  activeSeason,
  activeYear,
  activeFormat,
}: GenrePromptStateProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-10 text-center">
      <div className="mb-4 flex justify-center">
        <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-indigo-300">
          {availableGenresCount} loaded genres
        </span>
      </div>
      <div className="text-4xl">📺</div>
      <h3 className="mt-4 text-xl font-semibold text-white">Choose a genre</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-neutral-400">
        {availableGenresCount} genres are ready for {activeSeason} {activeYear} · {activeFormat}. Pick one to view the detailed analytics.
      </p>
    </div>
  );
}
