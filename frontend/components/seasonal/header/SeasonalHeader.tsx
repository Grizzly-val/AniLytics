"use client";

import { memo } from "react";
import Link from "next/link";
import { Season, FilterCategory } from "@/lib/types";
import { SeasonalControlsBar } from "../controls";

export interface SeasonalHeaderProps {
  activeItemName?: string;
  activeFilterCategory?: FilterCategory | null;
  selectedGenre?: string;
  selectedFormat?: string;
onSelectGenre: (genre: string) => void;
  onSelectFormat: (format: string) => void;
  onClearFilter: () => void;
  availableGenres?: string[];
  availableFormats?: string[];
  season: Season;
  seasonYear: number;
  onSeasonChange: (season: Season) => void;
  onYearChange: (year: number) => void;
  onLoadData: () => void;
  isLoading?: boolean;
  hasLoadedData?: boolean;
  isLoadDisabled?: boolean;
  errorMessage?: string | null;
  hideBackLink?: boolean;
  onOpenAggregates?: () => void;
  onOpenGenresAggregates?: () => void;
  onOpenFormatsAggregates?: () => void;
}

export const SeasonalHeader = memo(function SeasonalHeader({
  activeItemName,
  activeFilterCategory,
  selectedGenre,
  selectedFormat,
  onSelectGenre,
  onSelectFormat,
  onClearFilter,
  availableGenres = [],
  availableFormats = [],
  season,
  seasonYear,
  onSeasonChange,
  onYearChange,
  onLoadData,
  isLoading = false,
  hasLoadedData = false,
  isLoadDisabled = false,
  errorMessage = null,
  hideBackLink = false,
  onOpenAggregates
}: SeasonalHeaderProps) {
  const displayTitle = activeItemName || "Seasonal Analytics";
  const handleOpenAggregates = onOpenAggregates;

  return (
    <div className="space-y-6">
      {!hideBackLink && (
        <Link
          href="/easy-anilytics/filter-by"
          className="inline-flex items-center gap-2 text-xs font-mono text-anilytics-purple-300 hover:text-white transition-colors"
          id="back-to-filter-by-link"
        >
          &larr; Back to Filter by Dashboards
        </Link>
      )}

      {/* Heading hierarchy: Page Title + Tag divider + Context Tag */}
      <div className="flex items-baseline gap-3.5 flex-wrap">
        <h1 className="font-display font-normal text-display-clamp tracking-tight-2 bg-gradient-heading-text bg-clip-text text-transparent">
          {displayTitle}
        </h1>
        <div className="w-px h-3.5 bg-anilytics-line-soft self-center" />
        <span className="font-mono text-caption tracking-wider-md uppercase text-anilytics-text-low">
          {season} {seasonYear}
          {activeFilterCategory && selectedGenre && ` · Genre: ${selectedGenre}`}
          {activeFilterCategory && selectedFormat && ` · Format: ${selectedFormat}`}
        </span>
      </div>

      {/* Modular Seasonal Controls Bar */}
      <SeasonalControlsBar
        season={season}
        seasonYear={seasonYear}
        onSeasonChange={onSeasonChange}
        onYearChange={onYearChange}
        onLoadData={onLoadData}
        isLoading={isLoading}
        isLoadDisabled={isLoadDisabled}
        selectedGenre={selectedGenre}
        selectedFormat={selectedFormat}
        onSelectGenre={onSelectGenre}
        onSelectFormat={onSelectFormat}
        onClearFilter={onClearFilter}
        availableGenres={availableGenres}
        availableFormats={availableFormats}
        hasLoadedData={hasLoadedData}
        onOpenAggregates={handleOpenAggregates}
        errorMessage={errorMessage}
      />
    </div>
  );
});
