"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { Season, FilterCategory } from "@/lib/types";
import { SEASONS } from "@/lib/utils";

interface SeasonalHeaderProps {
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
  onOpenGenresAggregates,
  onOpenFormatsAggregates,
}: SeasonalHeaderProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  const displayTitle = activeItemName || "Seasonal Analytics";

  const handleLoadClick = () => {
    if (!season) {
      setValidationError("Invalid Season: Please select a valid season.");
      return;
    }
    if (
      !seasonYear ||
      isNaN(seasonYear) ||
      seasonYear < 1900 ||
      seasonYear > 2100 ||
      !Number.isInteger(seasonYear)
    ) {
      setValidationError(
        "Invalid Year: Please enter a valid 4-digit year between 1900 and 2100."
      );
      return;
    }

    setValidationError(null);
    onLoadData();
  };

  const displayError = validationError || errorMessage;

  const isGenreDisabled = Boolean(selectedFormat);
  const isFormatDisabled = Boolean(selectedGenre);

  return (
    <div className="space-y-6">
      {!hideBackLink && (
        <Link
          href="/easy-anilytics/filter-by"
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--purple-300)] hover:text-white transition-colors"
          id="back-to-filter-by-link"
        >
          &larr; Back to Filter by Dashboards
        </Link>
      )}

      {/* Heading hierarchy: Page Title + Tag divider + Context Tag */}
      <div className="flex items-baseline gap-3.5 flex-wrap">
        <h1 className="font-display font-normal text-[clamp(30px,4vw,40px)] tracking-[-0.02em] bg-gradient-to-b from-white via-white to-[var(--purple-300)] bg-clip-text text-transparent">
          {displayTitle}
        </h1>
        <div className="w-[1px] h-3.5 bg-[var(--line-soft)] self-center" />
        <span className="font-mono text-[11.5px] tracking-[0.06em] uppercase text-[var(--text-low)]">
          {season} {seasonYear}
          {activeFilterCategory && selectedGenre && ` · Genre: ${selectedGenre}`}
          {activeFilterCategory && selectedFormat && ` · Format: ${selectedFormat}`}
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-gradient-to-br from-[var(--panel-2)] to-[var(--panel)] border border-[var(--line)] rounded-2xl p-5 sm:p-[22px_26px] space-y-5">
        {/* Top Controls Row: Season, Year, and Load Action */}
        <div className="flex flex-wrap items-end gap-5 sm:gap-7">
          {/* Season Select */}
          <div className="flex flex-col gap-2 min-w-[110px] flex-1 sm:flex-none">
            <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--text-low)]">
              Season
            </span>
            <select
              id="seasonal-season-select"
              value={season}
              onChange={(e) => {
                setValidationError(null);
                onSeasonChange(e.target.value as Season);
              }}
              className="appearance-none bg-transparent border-0 border-b border-[var(--line)] text-[var(--text-hi)] text-[13.5px] pb-1.5 pt-0.5 pr-5 focus:outline-none focus:border-[var(--purple-400)] cursor-pointer transition-colors bg-no-repeat bg-[right_2px_center] bg-[length:12px] [background-image:url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%236d6880%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22><path%20d=%22m6%209%206%206%206-6%22/></svg>')]"
            >
              {SEASONS.map((s) => (
                <option key={s} value={s} className="bg-[var(--panel)] text-[var(--text-hi)]">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Year Input */}
          <div className="flex flex-col gap-2 min-w-[90px] flex-1 sm:flex-none">
            <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--text-low)]">
              Year
            </span>
            <input
              id="seasonal-year-input"
              type="number"
              value={seasonYear || ""}
              onChange={(e) => {
                setValidationError(null);
                const val = e.target.value ? parseInt(e.target.value, 10) : 0;
                onYearChange(isNaN(val) ? 0 : val);
              }}
              className="bg-transparent border-0 border-b border-[var(--line)] text-[var(--text-hi)] text-[13.5px] pb-1.5 pt-0.5 focus:outline-none focus:border-[var(--purple-400)] transition-colors w-24 font-mono"
            />
          </div>

          {/* Load Data Action Button */}
          <button
            id="load-seasonal-data-button"
            type="button"
            onClick={handleLoadClick}
            disabled={isLoading || isLoadDisabled}
            className={`sm:ml-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border font-medium text-[13px] tracking-[0.01em] transition-all duration-300 cursor-pointer ${
              isLoading
                ? "bg-[rgba(155,92,246,0.2)] border-[var(--purple-400)] text-[var(--purple-300)]"
                : "border-[var(--purple-400)] bg-[rgba(155,92,246,0.12)] text-[var(--purple-300)] hover:bg-gradient-to-br hover:from-[var(--purple-500)] hover:to-[var(--violet-glow)] hover:text-white hover:border-transparent"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
                  <path d="M21 12a9 9 0 0 0-9-9" />
                </svg>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
                <span>Load Data</span>
              </>
            )}
          </button>
        </div>

        {/* Grouped Mutually Exclusive Filter Dropdowns: Genres & Format */}
        <div className="pt-4 border-t border-[var(--line-soft)] flex flex-wrap items-center gap-5 sm:gap-6">
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-[var(--purple-300)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filter By (Choose 1):</span>
          </div>

          {/* Genre Dropdown */}
          <div className="flex flex-col gap-1.5 min-w-[150px] flex-1 sm:flex-none">
            <span className={`font-mono text-[10px] tracking-[0.08em] uppercase ${isGenreDisabled ? "text-[var(--text-low)] opacity-40" : "text-[rgba(178,133,251,0.9)]"}`}>
              Genre {isGenreDisabled && "(Disabled - Format Active)"}
            </span>
            {hasLoadedData && availableGenres.length > 0 ? (
              <select
                id="seasonal-genre-select"
                value={selectedGenre || ""}
                disabled={isGenreDisabled}
                onChange={(e) => onSelectGenre(e.target.value)}
                className={`appearance-none bg-transparent border-0 border-b text-[13.5px] pb-1.5 pt-0.5 pr-5 focus:outline-none transition-colors bg-no-repeat bg-[right_2px_center] bg-[length:12px] [background-image:url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%236d6880%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22><path%20d=%22m6%209%206%206%206-6%22/></svg>')] ${
                  isGenreDisabled
                    ? "border-[var(--line-soft)] text-[var(--text-low)] opacity-40 cursor-not-allowed"
                    : "border-[var(--line)] text-[var(--text-hi)] focus:border-[var(--purple-400)] cursor-pointer"
                }`}
              >
                <option value="" className="bg-[var(--panel)] text-[var(--text-low)]">
                  Select Genre...
                </option>
                {availableGenres.map((g) => (
                  <option key={g} value={g} className="bg-[var(--panel)] text-[var(--text-hi)]">
                    {g}
                  </option>
                ))}
              </select>
            ) : (
              <div className="border-b border-[var(--line)] pb-1.5 text-xs text-[var(--text-low)] font-mono">
                {hasLoadedData ? "No genres available" : "Pending Data Load"}
              </div>
            )}
          </div>

          <div className="w-[1px] h-7 bg-[var(--line-soft)] hidden sm:block" />

          {/* Format Dropdown */}
          <div className="flex flex-col gap-1.5 min-w-[140px] flex-1 sm:flex-none">
            <span className={`font-mono text-[10px] tracking-[0.08em] uppercase ${isFormatDisabled ? "text-[var(--text-low)] opacity-40" : "text-[rgba(178,133,251,0.9)]"}`}>
              Format {isFormatDisabled && "(Disabled - Genre Active)"}
            </span>
            {hasLoadedData && availableFormats.length > 0 ? (
              <select
                id="seasonal-format-select"
                value={selectedFormat || ""}
                disabled={isFormatDisabled}
                onChange={(e) => onSelectFormat(e.target.value)}
                className={`appearance-none bg-transparent border-0 border-b text-[13.5px] pb-1.5 pt-0.5 pr-5 focus:outline-none transition-colors bg-no-repeat bg-[right_2px_center] bg-[length:12px] [background-image:url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%236d6880%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22><path%20d=%22m6%209%206%206%206-6%22/></svg>')] ${
                  isFormatDisabled
                    ? "border-[var(--line-soft)] text-[var(--text-low)] opacity-40 cursor-not-allowed"
                    : "border-[var(--line)] text-[var(--text-hi)] focus:border-[var(--purple-400)] cursor-pointer"
                }`}
              >
                <option value="" className="bg-[var(--panel)] text-[var(--text-low)]">
                  Select Format...
                </option>
                {availableFormats.map((f) => (
                  <option key={f} value={f} className="bg-[var(--panel)] text-[var(--text-hi)]">
                    {f}
                  </option>
                ))}
              </select>
            ) : (
              <div className="border-b border-[var(--line)] pb-1.5 text-xs text-[var(--text-low)] font-mono">
                {hasLoadedData ? "No formats available" : "Pending Data Load"}
              </div>
            )}
          </div>

          {/* Reset Filter Button if a filter is active */}
          {(selectedGenre || selectedFormat) && (
            <button
              type="button"
              onClick={onClearFilter}
              className="text-xs font-mono text-[var(--text-low)] hover:text-[var(--purple-300)] underline underline-offset-4 transition-colors cursor-pointer"
            >
              Clear Selection
            </button>
          )}

          {/* Aggregates Overview Drawer Buttons */}
          <div className="flex items-center gap-2 sm:ml-auto">
            <button
              type="button"
              onClick={onOpenGenresAggregates}
              disabled={!hasLoadedData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[12px] font-mono hover:bg-purple-500/20 hover:border-purple-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              title="Open Genres Aggregates Drawer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M18 20V10" />
                <path d="M12 20V4" />
                <path d="M6 20v-6" />
              </svg>
              <span>Genres Aggregates</span>
            </button>

            <button
              type="button"
              onClick={onOpenFormatsAggregates}
              disabled={!hasLoadedData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[12px] font-mono hover:bg-indigo-500/20 hover:border-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              title="Open Formats Aggregates Drawer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
              <span>Formats Aggregates</span>
            </button>
          </div>
        </div>

        {displayError && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-center gap-2.5 shadow-sm">
            <span className="text-rose-400 text-sm font-bold shrink-0">⚠️</span>
            <span className="font-medium">{displayError}</span>
          </div>
        )}
      </div>
    </div>
  );
});


