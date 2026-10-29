"use client";

import { memo } from "react";
import {
  AnimeListControls,
  SortByOption,
  SortOrderOption,
  ViewModeOption,
} from "./AnimeListControls";
import { AnimeGrid, ProcessedAnime } from "./AnimeGrid";
import { AnimeTable } from "./AnimeTable";

export interface SeasonalAnimeSectionProps {
  items: ProcessedAnime[];
  highlightedTitle: string | null;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  sortBy: SortByOption;
  onSortByChange: (sortBy: SortByOption) => void;
  sortOrder: SortOrderOption;
  onToggleSortOrder: () => void;
  viewMode: ViewModeOption;
  onViewModeChange: (viewMode: ViewModeOption) => void;
}

export const SeasonalAnimeSection = memo(function SeasonalAnimeSection({
  items,
  highlightedTitle,
  searchQuery,
  onSearchQueryChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
  viewMode,
  onViewModeChange,
}: SeasonalAnimeSectionProps) {
  return (
    <div className="space-y-4">
      <AnimeListControls
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        sortBy={sortBy}
        onSortByChange={onSortByChange}
        sortOrder={sortOrder}
        onToggleSortOrder={onToggleSortOrder}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />

      {viewMode === "grid" && (
        <AnimeGrid
          items={items}
          highlightedTitle={highlightedTitle}
        />
      )}

      {viewMode === "table" && (
        <AnimeTable
          items={items}
          highlightedTitle={highlightedTitle}
        />
      )}

      {items.length === 0 && searchQuery && (
        <div className="rounded-card-lg border border-anilytics-line bg-anilytics-panel p-card text-center text-anilytics-text-mid font-mono text-body-sm">
          No anime found matching &quot;{searchQuery}&quot;.
        </div>
      )}
    </div>
  );
});
