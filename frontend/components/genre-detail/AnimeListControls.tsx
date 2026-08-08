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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-neutral-900/60 p-4 rounded-xl border border-neutral-800">
      <div className="relative flex-1">
        <input
          id="anime-search-input"
          type="text"
          placeholder="Search anime title..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none transition"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchQueryChange("")}
            className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <select
          id="anime-sort-by-select"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SortByOption)}
          className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
        >
          <option value="score">Sort by Score</option>
          <option value="popularity">Sort by Popularity</option>
          <option value="trending">Sort by Trending</option>
          <option value="title">Sort by Title</option>
        </select>

        <button
          id="anime-sort-order-toggle"
          onClick={onToggleSortOrder}
          className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-700 transition"
          title="Toggle Sort Direction"
        >
          {sortOrder === "desc" ? "High → Low" : "Low → High"}
        </button>

        <div className="flex border border-neutral-700 rounded-lg overflow-hidden bg-neutral-800">
          <button
            id="view-mode-grid"
            onClick={() => onViewModeChange("grid")}
            className={`px-3 py-1.5 text-xs font-medium transition ${
              viewMode === "grid"
                ? "bg-indigo-600 text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Grid
          </button>
          <button
            id="view-mode-table"
            onClick={() => onViewModeChange("table")}
            className={`px-3 py-1.5 text-xs font-medium transition ${
              viewMode === "table"
                ? "bg-indigo-600 text-white"
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
