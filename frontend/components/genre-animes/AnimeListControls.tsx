"use client";

import { memo } from "react";

export type SortByOption = "score" | "popularity" | "trending" | "title";
export type SortOrderOption = "asc" | "desc";
export type ViewModeOption = "grid" | "table";

interface AnimeListControlsProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  sortBy: SortByOption;
  onSortByChange: (sortBy: SortByOption) => void;
  sortOrder: SortOrderOption;
  onToggleSortOrder: () => void;
  viewMode: ViewModeOption;
  onViewModeChange: (viewMode: ViewModeOption) => void;
}

export const AnimeListControls = memo(function AnimeListControls({
  searchQuery,
  onSearchQueryChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
  viewMode,
  onViewModeChange,
}: AnimeListControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-4 shadow-md backdrop-blur-sm">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <input
          id="anime-search-input"
          type="text"
          placeholder="Search anime title..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="w-full rounded-lg border border-neutral-700/80 bg-neutral-800/90 px-4 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-purple-400 focus:outline-none transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Controls: Sort & View Mode */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort By Select */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Sort:
          </label>
          <select
            id="anime-sort-by-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortByOption)}
            className="rounded-lg border border-neutral-700/80 bg-neutral-800/90 px-3 py-2 text-xs text-white focus:border-purple-400 focus:outline-none cursor-pointer"
          >
            <option value="score">Score</option>
            <option value="popularity">Popularity</option>
            <option value="trending">Trending</option>
            <option value="title">Title</option>
          </select>

          {/* Sort Order Toggle */}
          <button
            id="anime-sort-order-toggle"
            type="button"
            onClick={onToggleSortOrder}
            className="rounded-lg border border-neutral-700/80 bg-neutral-800/90 px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:border-purple-400 transition cursor-pointer"
            title={`Order: ${sortOrder === "desc" ? "Descending" : "Ascending"}`}
          >
            {sortOrder === "desc" ? "↓ High to Low" : "↑ Low to High"}
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-lg border border-neutral-700/80 bg-neutral-800/90 p-1">
          <button
            id="view-mode-grid-button"
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              viewMode === "grid"
                ? "bg-purple-500 text-neutral-950 shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Grid
          </button>
          <button
            id="view-mode-table-button"
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
              viewMode === "table"
                ? "bg-purple-500 text-neutral-950 shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Table
          </button>
        </div>
      </div>
    </div>
  );
});
