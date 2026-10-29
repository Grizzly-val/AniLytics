"use client";

import { memo } from "react";

export type SortByOption = "score" | "popularity" | "trending" | "favourites" | "title";
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
    <div className="flex flex-wrap items-center justify-between gap-5 pb-4.5 mb-6 border-b border-anilytics-line-soft">
      {/* Search Input Field */}
      <div className="flex items-center gap-2.5 border-b border-anilytics-line focus-within:border-anilytics-purple-400 py-1.5 px-0.5 min-w-57.5 flex-1 max-w-sm transition-colors">
        <svg className="w-3.5 h-3.5 stroke-anilytics-text-low shrink-0" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          id="anime-search-input"
          type="text"
          placeholder="Search anime title…"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="bg-transparent border-none outline-none text-body text-anilytics-text-hi placeholder-anilytics-text-low w-full font-sans"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchQueryChange("")}
            className="text-xs text-anilytics-text-low hover:text-white transition-colors shrink-0"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex items-center gap-6 flex-wrap">
        {/* Sort Controls */}
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-2xs tracking-widest-sm uppercase text-anilytics-text-low">
            Sort
          </span>
          <div className="relative flex items-center">
            <select
              id="anime-sort-by-select"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortByOption)}
              className="appearance-none bg-transparent border-0 border-b border-anilytics-line text-anilytics-text-hi text-body-md pb-1 pt-0.5 pr-6 focus:outline-none focus:border-anilytics-purple-400 cursor-pointer transition-colors"
            >
              <option value="score" className="bg-anilytics-panel text-anilytics-text-hi">
                Score
              </option>
              <option value="popularity" className="bg-anilytics-panel text-anilytics-text-hi">
                Popularity
              </option>
              <option value="trending" className="bg-anilytics-panel text-anilytics-text-hi">
                Trending
              </option>
              <option value="favourites" className="bg-anilytics-panel text-anilytics-text-hi">
                Favourites
              </option>
              <option value="title" className="bg-anilytics-panel text-anilytics-text-hi">
                Title
              </option>
            </select>
            <svg
              className="w-3 h-3 stroke-anilytics-text-low pointer-events-none absolute right-0.5 top-1/2 -translate-y-1/2"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>

          {/* Sort Direction Toggle Button */}
          <button
            id="anime-sort-order-toggle"
            type="button"
            onClick={onToggleSortOrder}
            className="w-7 h-7 rounded-lg border border-anilytics-line flex items-center justify-center text-anilytics-text-mid hover:border-anilytics-purple-400 hover:text-anilytics-purple-300 transition-colors cursor-pointer"
            aria-label="Toggle sort direction"
            title={`Order: ${sortOrder === "desc" ? "Descending" : "Ascending"}`}
          >
            <svg
              className={`w-3.25 h-3.25 transition-transform duration-350 ease-custom ${
                sortOrder === "asc" ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        {/* View Mode Indicator Toggle */}
        <div className="relative flex gap-5.5 border-b border-anilytics-line-soft">
          <button
            id="view-mode-grid-button"
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`font-medium text-body-md pb-2 transition-colors cursor-pointer ${
              viewMode === "grid" ? "text-anilytics-text-hi" : "text-anilytics-text-low"
            }`}
          >
            Grid
          </button>
          <button
            id="view-mode-table-button"
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`font-medium text-body-md pb-2 transition-colors cursor-pointer ${
              viewMode === "table" ? "text-anilytics-text-hi" : "text-anilytics-text-low"
            }`}
          >
            Table
          </button>

          {/* Active Tab Indicator Bar */}
          <div
            className={`absolute -bottom-px h-0.375 bg-anilytics-purple-400 transition-all duration-350 ease-custom ${
              viewMode === "grid" ? "left-0 w-8" : "left-11.25 w-9"
            }`}
          />
        </div>
      </div>
    </div>
  );
});

