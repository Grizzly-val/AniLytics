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
    <div className="flex flex-wrap items-center justify-between gap-5 pb-[18px] mb-6 border-b border-[var(--line-soft)]">
      {/* Search Input Field */}
      <div className="flex items-center gap-2.5 border-b border-[var(--line)] focus-within:border-[var(--purple-400)] py-1.5 px-0.5 min-w-[230px] flex-1 max-w-sm transition-colors">
        <svg className="w-3.5 h-3.5 stroke-[var(--text-low)] shrink-0" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          id="anime-search-input"
          type="text"
          placeholder="Search anime title…"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="bg-transparent border-none outline-none text-[13.5px] text-[var(--text-hi)] placeholder-[var(--text-low)] w-full font-sans"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchQueryChange("")}
            className="text-xs text-[var(--text-low)] hover:text-white transition-colors shrink-0"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex items-center gap-6 flex-wrap">
        {/* Sort Controls */}
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--text-low)]">
            Sort
          </span>
          <select
            id="anime-sort-by-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortByOption)}
            className="appearance-none bg-transparent border-0 border-b border-[var(--line)] text-[var(--text-hi)] text-[13px] pb-1 pt-0.5 pr-5 focus:outline-none focus:border-[var(--purple-400)] cursor-pointer transition-colors bg-no-repeat bg-[right_0_center] bg-[length:12px] [background-image:url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%236d6880%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22><path%20d=%22m6%209%206%206%206-6%22/></svg>')]"
          >
            <option value="score" className="bg-[var(--panel)] text-[var(--text-hi)]">
              Score
            </option>
            <option value="popularity" className="bg-[var(--panel)] text-[var(--text-hi)]">
              Popularity
            </option>
            <option value="trending" className="bg-[var(--panel)] text-[var(--text-hi)]">
              Trending
            </option>
            <option value="title" className="bg-[var(--panel)] text-[var(--text-hi)]">
              Title
            </option>
          </select>

          {/* Sort Direction Toggle Button */}
          <button
            id="anime-sort-order-toggle"
            type="button"
            onClick={onToggleSortOrder}
            className="w-[28px] h-[28px] rounded-lg border border-[var(--line)] flex items-center justify-center text-[var(--text-mid)] hover:border-[var(--purple-400)] hover:text-[var(--purple-300)] transition-colors cursor-pointer"
            aria-label="Toggle sort direction"
            title={`Order: ${sortOrder === "desc" ? "Descending" : "Ascending"}`}
          >
            <svg
              className={`w-[13px] h-[13px] transition-transform duration-350 ease-[cubic-bezier(.65,0,.35,1)] ${
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
        <div className="relative flex gap-[22px] border-b border-[var(--line-soft)]">
          <button
            id="view-mode-grid-button"
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`font-medium text-[13px] pb-2 transition-colors cursor-pointer ${
              viewMode === "grid" ? "text-[var(--text-hi)]" : "text-[var(--text-low)]"
            }`}
          >
            Grid
          </button>
          <button
            id="view-mode-table-button"
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`font-medium text-[13px] pb-2 transition-colors cursor-pointer ${
              viewMode === "table" ? "text-[var(--text-hi)]" : "text-[var(--text-low)]"
            }`}
          >
            Table
          </button>

          {/* Active Tab Indicator Bar */}
          <div
            className={`absolute bottom-[-1px] h-[1.5px] bg-[var(--purple-400)] transition-all duration-350 ease-[cubic-bezier(.65,0,.35,1)] ${
              viewMode === "grid" ? "left-0 w-8" : "left-[45px] w-9"
            }`}
          />
        </div>
      </div>
    </div>
  );
});

