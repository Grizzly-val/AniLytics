"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { Season, MediaFormat } from "@/lib/types";
import { SEASONS, FORMATS } from "@/lib/utils";

interface GenreHeaderProps {
  decodedGenre?: string;
  selectedGenre?: string;
  onGenreChange?: (genre: string) => void;
  availableGenres?: string[];
  season: Season;
  seasonYear: number;
  format: MediaFormat;
  onSeasonChange: (season: Season) => void;
  onYearChange: (year: number) => void;
  onFormatChange: (format: MediaFormat) => void;
  onLoadGenres: () => void;
  isLoadingGenres?: boolean;
  hasLoadedGenres?: boolean;
  isLoadDisabled?: boolean;
  errorMessage?: string | null;
  hideBackLink?: boolean;
}

export const GenreHeader = memo(function GenreHeader({
  decodedGenre,
  selectedGenre,
  onGenreChange,
  availableGenres,
  season,
  seasonYear,
  format,
  onSeasonChange,
  onYearChange,
  onFormatChange,
  onLoadGenres,
  isLoadingGenres = false,
  hasLoadedGenres = false,
  isLoadDisabled = false,
  errorMessage = null,
  hideBackLink = false,
}: GenreHeaderProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentGenreName = selectedGenre || "Genre Detail";

  const handleLoadGenresClick = () => {
    // Input validation
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
    if (!format) {
      setValidationError("Invalid Format: Please select a valid format.");
      return;
    }

    setValidationError(null);
    onLoadGenres();
  };

  const displayError = validationError || errorMessage;

  return (
    <div className="flex flex-col gap-6 border-b border-neutral-800 pb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {!hideBackLink && (
            <Link
              href="/seasonal/genres/aggregates"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition mb-2"
              id="back-to-genre-data-link"
            >
              &larr; Back to Genre Aggregates
            </Link>
          )}
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {currentGenreName}
              </span>
            </h1>
            {hasLoadedGenres && season && seasonYear > 0 && format && (
              <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-neutral-300 border border-neutral-700">
                {season} {seasonYear} • {format}
              </span>
            )}
          </div>
          <p className="text-neutral-400 text-sm mt-1">
            Detailed breakdown and performance analytics for {selectedGenre ? `${selectedGenre} anime` : "the selected anime genre"}.
          </p>
        </div>
      </div>

      {/* Dynamic Filter Controls & Load Genres Action */}
      <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800 backdrop-blur-sm shadow-md space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Season
            </label>
            <select
              id="genre-detail-season-select"
              value={season}
              onChange={(e) => {
                setValidationError(null);
                onSeasonChange(e.target.value as Season);
              }}
              className="w-full h-[38px] rounded-lg border border-neutral-700 bg-neutral-800 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none transition cursor-pointer"
            >
              {SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Year
            </label>
            <input
              id="genre-detail-year-input"
              type="number"
              placeholder="e.g. 2026"
              value={seasonYear || ""}
              onChange={(e) => {
                setValidationError(null);
                const val = e.target.value ? parseInt(e.target.value, 10) : 0;
                onYearChange(isNaN(val) ? 0 : val);
              }}
              className="w-full h-[38px] rounded-lg border border-neutral-700 bg-neutral-800 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Format
            </label>
            <select
              id="genre-detail-format-select"
              value={format}
              onChange={(e) => {
                setValidationError(null);
                onFormatChange(e.target.value as MediaFormat);
              }}
              className="w-full h-[38px] rounded-lg border border-neutral-700 bg-neutral-800 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none transition cursor-pointer"
            >
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Genre
            </label>
            {hasLoadedGenres && availableGenres && availableGenres.length > 0 ? (
              <select
                id="genre-detail-genre-select"
                value={selectedGenre || ""}
                onChange={(e) => onGenreChange?.(e.target.value)}
                className="w-full h-[38px] rounded-lg border border-neutral-700 bg-neutral-800 px-3 text-xs text-white focus:border-indigo-500 focus:outline-none transition cursor-pointer"
              >
                <option value="">Select Genre...</option>
                {availableGenres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            ) : (
              <div
                className="flex items-center justify-between h-[38px] rounded-lg border border-neutral-800 bg-neutral-800/40 px-3 text-xs text-neutral-400 font-medium select-none"
              >
                <span className="truncate">Genres not loaded</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Pending
                </span>
              </div>
            )}
          </div>

          <div>
            <button
              id="load-genres-button"
              type="button"
              onClick={handleLoadGenresClick}
              disabled={isLoadingGenres || isLoadDisabled}
              className="w-full h-[38px] rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoadingGenres ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>Load Genres</span>
              )}
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
