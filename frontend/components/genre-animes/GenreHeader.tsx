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

  const currentGenreName = selectedGenre || decodedGenre || "Genre Animes";

  const handleLoadGenresClick = () => {
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
    <div className="space-y-6">
      {!hideBackLink && (
        <Link
          href="/seasonal/genres/aggregates"
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--purple-300)] hover:text-white transition-colors"
          id="back-to-genre-data-link"
        >
          &larr; Back to Genre Aggregates
        </Link>
      )}

      {/* Heading hierarchy from blueprint: Page Title + Tag divider + Context Tag. No subtext. */}
      <div className="flex items-baseline gap-3.5 flex-wrap">
        <h1 className="font-display font-normal text-[clamp(30px,4vw,40px)] tracking-[-0.02em] bg-gradient-to-b from-white via-white to-[var(--purple-300)] bg-clip-text text-transparent">
          {currentGenreName}
        </h1>
        <div className="w-[1px] h-3.5 bg-[var(--line-soft)] self-center" />
        <span className="font-mono text-[11.5px] tracking-[0.06em] uppercase text-[var(--text-low)]">
          {season} {seasonYear} · {format}
        </span>
      </div>

      {/* Blueprint Filter Bar */}
      <div className="bg-gradient-to-br from-[var(--panel-2)] to-[var(--panel)] border border-[var(--line)] rounded-2xl p-5 sm:p-[22px_26px] space-y-4">
        <div className="flex flex-wrap items-end gap-5 sm:gap-7">
          {/* Season Select */}
          <div className="flex flex-col gap-2 min-w-[100px] flex-1 sm:flex-none">
            <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--text-low)]">
              Season
            </span>
            <select
              id="genre-animes-season-select"
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

          {/* Year Input / Select */}
          <div className="flex flex-col gap-2 min-w-[90px] flex-1 sm:flex-none">
            <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--text-low)]">
              Year
            </span>
            <input
              id="genre-animes-year-input"
              type="number"
              value={seasonYear || ""}
              onChange={(e) => {
                setValidationError(null);
                const val = e.target.value ? parseInt(e.target.value, 10) : 0;
                onYearChange(isNaN(val) ? 0 : val);
              }}
              className="bg-transparent border-0 border-b border-[var(--line)] text-[var(--text-hi)] text-[13.5px] pb-1.5 pt-0.5 focus:outline-none focus:border-[var(--purple-400)] transition-colors w-20 font-mono"
            />
          </div>

          {/* Format Select */}
          <div className="flex flex-col gap-2 min-w-[90px] flex-1 sm:flex-none">
            <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--text-low)]">
              Format
            </span>
            <select
              id="genre-animes-format-select"
              value={format}
              onChange={(e) => {
                setValidationError(null);
                onFormatChange(e.target.value as MediaFormat);
              }}
              className="appearance-none bg-transparent border-0 border-b border-[var(--line)] text-[var(--text-hi)] text-[13.5px] pb-1.5 pt-0.5 pr-5 focus:outline-none focus:border-[var(--purple-400)] cursor-pointer transition-colors bg-no-repeat bg-[right_2px_center] bg-[length:12px] [background-image:url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%236d6880%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22><path%20d=%22m6%209%206%206%206-6%22/></svg>')]"
            >
              {FORMATS.map((f) => (
                <option key={f} value={f} className="bg-[var(--panel)] text-[var(--text-hi)]">
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Subtle separation divider before Genre */}
          <div className="w-[1px] h-[34px] bg-[var(--line-soft)] self-end mb-0.5 hidden sm:block" />

          {/* Genre Select */}
          <div className="flex flex-col gap-2 min-w-[130px] flex-1 sm:flex-none">
            <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[rgba(178,133,251,0.72)]">
              Genre
            </span>
            {hasLoadedGenres && availableGenres && availableGenres.length > 0 ? (
              <select
                id="genre-animes-genre-select"
                value={selectedGenre || ""}
                onChange={(e) => onGenreChange?.(e.target.value)}
                className="appearance-none bg-transparent border-0 border-b border-[var(--line)] text-[var(--text-hi)] text-[13.5px] pb-1.5 pt-0.5 pr-5 focus:outline-none focus:border-[var(--purple-400)] cursor-pointer transition-colors bg-no-repeat bg-[right_2px_center] bg-[length:12px] [background-image:url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%236d6880%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22><path%20d=%22m6%209%206%206%206-6%22/></svg>')]"
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
                Pending Load
              </div>
            )}
          </div>

          {/* Load Genres Submit Action */}
          <button
            id="load-genres-button"
            type="button"
            onClick={handleLoadGenresClick}
            disabled={isLoadingGenres || isLoadDisabled}
            className={`sm:ml-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border font-medium text-[13px] tracking-[0.01em] transition-all duration-300 cursor-pointer ${
              isLoadingGenres
                ? "bg-[rgba(155,92,246,0.2)] border-[var(--purple-400)] text-[var(--purple-300)]"
                : "border-[var(--purple-400)] bg-[rgba(155,92,246,0.12)] text-[var(--purple-300)] hover:bg-gradient-to-br hover:from-[var(--purple-500)] hover:to-[var(--violet-glow)] hover:text-white hover:border-transparent"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoadingGenres ? (
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
                <span>Load Genres</span>
              </>
            )}
          </button>
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

