import { Season } from "@/lib/types";

interface SeasonalNoDataStateProps {
  activeItemName: string;
  activeSeason: Season;
  activeYear: number;
}

export function SeasonalNoDataState({
  activeItemName,
  activeSeason,
  activeYear,
}: SeasonalNoDataStateProps) {
  return (
    <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-12 text-center space-y-4">
      <div className="text-4xl">📊</div>
      <h3 className="text-xl font-bold text-white">
        No data for &quot;{activeItemName || "selected filter"}&quot;
      </h3>
      <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto font-normal">
        No anime matching &quot;{activeItemName}&quot; were found in the selected {activeSeason} {activeYear} dataset. Try selecting another genre or format.
      </p>
    </div>
  );
}
