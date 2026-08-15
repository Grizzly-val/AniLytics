import React from "react";
import { Season, MediaFormat } from "@/lib/types";
import { SEASONS, FORMATS } from "@/lib/utils";

interface AggregatesFilterFormProps {
  seasonInput: Season;
  seasonYearInput: number;
  formatInput: MediaFormat;
  onSeasonChange: (season: Season) => void;
  onYearChange: (year: number) => void;
  onFormatChange: (format: MediaFormat) => void;
  onSubmit: (e: React.FormEvent) => void;
  canSubmit: boolean;
}

export default function AggregatesFilterForm({
  seasonInput,
  seasonYearInput,
  formatInput,
  onSeasonChange,
  onYearChange,
  onFormatChange,
  onSubmit,
  canSubmit,
}: AggregatesFilterFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-6 backdrop-blur-sm shadow-md space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Season
          </label>
          <select
            id="genre-data-season-select"
            value={seasonInput}
            onChange={(e) => onSeasonChange(e.target.value as Season)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
          >
            {SEASONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Season Year
          </label>
          <input
            id="genre-data-year-input"
            type="number"
            placeholder="Enter Year (e.g. 2026)"
            value={seasonYearInput || ""}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value, 10) : 0;
              onYearChange(isNaN(val) ? 0 : val);
            }}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Format
          </label>
          <select
            id="genre-data-format-select"
            value={formatInput}
            onChange={(e) => onFormatChange(e.target.value as MediaFormat)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          id="submit-genre-data-filters"
          type="submit"
          disabled={!canSubmit}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition duration-150 cursor-pointer"
        >
          Submit Filters
        </button>
      </div>
    </form>
  );
}
