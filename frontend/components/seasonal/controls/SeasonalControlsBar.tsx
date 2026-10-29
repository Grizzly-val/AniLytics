"use client";

import { memo, useState } from "react";
import { Season } from "@/lib/types";
import { SeasonYearControls } from "./SeasonYearControls";
import { SeasonalCategorySelect } from "./SeasonalCategorySelect";
import { SeasonalAggregatesButton } from "./SeasonalAggregatesButton";

export interface SeasonalControlsBarProps {
  // Season & Year state
  season: Season;
  seasonYear: number;
  onSeasonChange: (season: Season) => void;
  onYearChange: (year: number) => void;
  onLoadData: () => void;
  isLoading?: boolean;
  isLoadDisabled?: boolean;

  // Filter Selection state
  selectedGenre?: string;
  selectedFormat?: string;
  onSelectGenre: (genre: string) => void;
  onSelectFormat: (format: string) => void;
  onClearFilter: () => void;
  availableGenres?: string[];
  availableFormats?: string[];
  hasLoadedData?: boolean;

  // Aggregates drawer trigger
  onOpenAggregates?: () => void;

  // Error messages
  errorMessage?: string | null;
}

export const SeasonalControlsBar = memo(function SeasonalControlsBar({
  season,
  seasonYear,
  onSeasonChange,
  onYearChange,
  onLoadData,
  isLoading = false,
  isLoadDisabled = false,
  selectedGenre,
  selectedFormat,
  onSelectGenre,
  onSelectFormat,
  onClearFilter,
  availableGenres = [],
  availableFormats = [],
  hasLoadedData = false,
  onOpenAggregates,
  errorMessage = null,
}: SeasonalControlsBarProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  const displayError = validationError || errorMessage;

  return (
    <div className="bg-gradient-to-br from-anilytics-panel-2 to-anilytics-panel border border-anilytics-line rounded-card-lg p-5 sm:p-control-bar space-y-5">
      {/* Top Controls Row: Season, Year, and Load Action */}
      <SeasonYearControls
        season={season}
        seasonYear={seasonYear}
        onSeasonChange={onSeasonChange}
        onYearChange={onYearChange}
        onLoadData={onLoadData}
        isLoading={isLoading}
        isLoadDisabled={isLoadDisabled}
        onValidationError={setValidationError}
      />

      {/* Bottom Filter & Drawer Actions Row */}
      <div className="pt-4 border-t border-anilytics-line-soft flex flex-wrap items-center justify-between gap-5 sm:gap-6">
        <SeasonalCategorySelect
          selectedGenre={selectedGenre}
          selectedFormat={selectedFormat}
          onSelectGenre={onSelectGenre}
          onSelectFormat={onSelectFormat}
          onClearFilter={onClearFilter}
          availableGenres={availableGenres}
          availableFormats={availableFormats}
          hasLoadedData={hasLoadedData}
        />

        <SeasonalAggregatesButton
          onClick={onOpenAggregates}
          disabled={!hasLoadedData}
        />
      </div>

      {/* Validation / API Error Banner */}
      {displayError && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-center gap-2.5 shadow-sm">
          <span className="text-rose-400 text-sm font-bold shrink-0">⚠️</span>
          <span className="font-medium">{displayError}</span>
        </div>
      )}
    </div>
  );
});
