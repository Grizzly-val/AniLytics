"use client";

import { memo, useState } from "react";
import { Season } from "@/lib/types";
import { SEASONS } from "@/lib/utils";

export interface SeasonYearControlsProps {
  season: Season;
  seasonYear: number;
  onSeasonChange: (season: Season) => void;
  onYearChange: (year: number) => void;
  onLoadData: () => void;
  isLoading?: boolean;
  isLoadDisabled?: boolean;
  onValidationError?: (error: string | null) => void;
}

export const SeasonYearControls = memo(function SeasonYearControls({
  season,
  seasonYear,
  onSeasonChange,
  onYearChange,
  onLoadData,
  isLoading = false,
  isLoadDisabled = false,
  onValidationError,
}: SeasonYearControlsProps) {
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleLoadClick = () => {
    if (!season) {
      const err = "Invalid Season: Please select a valid season.";
      setInternalError(err);
      onValidationError?.(err);
      return;
    }
    if (
      !seasonYear ||
      isNaN(seasonYear) ||
      seasonYear < 1900 ||
      seasonYear > 2100 ||
      !Number.isInteger(seasonYear)
    ) {
      const err = "Invalid Year: Please enter a valid 4-digit year between 1900 and 2100.";
      setInternalError(err);
      onValidationError?.(err);
      return;
    }

    setInternalError(null);
    onValidationError?.(null);
    onLoadData();
  };

  const handleSeasonSelectChange = (newSeason: Season) => {
    setInternalError(null);
    onValidationError?.(null);
    onSeasonChange(newSeason);
  };

  const handleYearInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalError(null);
    onValidationError?.(null);
    const val = e.target.value ? parseInt(e.target.value, 10) : 0;
    onYearChange(isNaN(val) ? 0 : val);
  };

  return (
    <div className="flex flex-wrap items-end gap-5 sm:gap-7 w-full">
      {/* Season Select */}
      <div className="flex flex-col gap-2 min-w-27.5 flex-1 sm:flex-none">
        <label
          htmlFor="seasonal-season-select"
          className="font-mono text-2xs tracking-widest-sm uppercase text-anilytics-text-low cursor-pointer"
        >
          Season
        </label>
        <select
          id="seasonal-season-select"
          value={season}
          onChange={(e) => handleSeasonSelectChange(e.target.value as Season)}
          className="appearance-none bg-transparent border-0 border-b border-anilytics-line text-anilytics-text-hi text-body pb-1.5 pt-0.5 pr-5 focus:outline-none focus:border-anilytics-purple-400 cursor-pointer transition-colors bg-select-chevron"
        >
          {SEASONS.map((s) => (
            <option key={s} value={s} className="bg-anilytics-panel text-anilytics-text-hi">
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Year Input */}
      <div className="flex flex-col gap-2 min-w-22.5 flex-1 sm:flex-none">
        <label
          htmlFor="seasonal-year-input"
          className="font-mono text-2xs tracking-widest-sm uppercase text-anilytics-text-low cursor-pointer"
        >
          Year
        </label>
        <input
          id="seasonal-year-input"
          type="number"
          value={seasonYear || ""}
          onChange={handleYearInputChange}
          className="bg-transparent border-0 border-b border-anilytics-line text-anilytics-text-hi text-body pb-1.5 pt-0.5 focus:outline-none focus:border-anilytics-purple-400 transition-colors w-24 font-mono"
        />
      </div>

      {/* Load Data Action Button */}
      <button
        id="load-seasonal-data-button"
        type="button"
        onClick={handleLoadClick}
        disabled={isLoading || isLoadDisabled}
        className={`sm:ml-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border font-medium text-body-md tracking-wide-xs transition-all duration-300 cursor-pointer ${
          isLoading
            ? "bg-anilytics-purple-glow-20 border-anilytics-purple-400 text-anilytics-purple-300"
            : "border-anilytics-purple-400 bg-anilytics-purple-glow-12 text-anilytics-purple-300 hover:bg-gradient-to-br hover:from-anilytics-purple-500 hover:to-anilytics-violet-glow hover:text-white hover:border-transparent"
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
  );
});
