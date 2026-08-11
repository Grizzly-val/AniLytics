"use client";

import { useState } from "react";
import { Season, MediaFormat } from "@/lib/types";
import GenreBarChart from "@/components/charts/GenreBarChart";
import { useGenreData } from "@/lib/hooks/useGenreData";
import { SEASONS, FORMATS, getCurrentSeason, getCurrentYear, DEFAULT_FORMAT } from "@/lib/utils";

export default function GenreDataPage() {
  // Input control states (default to current season, year, and TV format)
  const [seasonInput, setSeasonInput] = useState<Season>(getCurrentSeason());
  const [seasonYearInput, setSeasonYearInput] = useState<number>(getCurrentYear());
  const [formatInput, setFormatInput] = useState<MediaFormat>(DEFAULT_FORMAT);

  // Submitted filter state (used for API call)
  const [activeSeason, setActiveSeason] = useState<Season>(getCurrentSeason());
  const [activeYear, setActiveYear] = useState<number>(getCurrentYear());
  const [activeFormat, setActiveFormat] = useState<MediaFormat>(DEFAULT_FORMAT);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(true);

  // Default metric is 'count'
  const [metric, setMetric] = useState<
    "count" | "average_score" | "trending" | "popularity"
  >("count");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seasonInput && seasonYearInput > 0 && formatInput) {
      setActiveSeason(seasonInput);
      setActiveYear(seasonYearInput);
      setActiveFormat(formatInput);
      setIsSubmitted(true);
    }
  };

  const { data, error, loading } = useGenreData(
    activeSeason,
    activeYear,
    activeFormat,
    isSubmitted
  );

  const canSubmit = Boolean(seasonInput && seasonYearInput > 0 && formatInput);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Genre Data
        </h1>
        <p className="text-neutral-400 mt-1 text-sm">
          Filter and analyze anime counts, average scores, popularity, and trending metrics across anime genres by season and format.
        </p>
      </div>

      {/* Controls Form */}
      <form
        onSubmit={handleSubmit}
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
              onChange={(e) => setSeasonInput(e.target.value as Season)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
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
                setSeasonYearInput(isNaN(val) ? 0 : val);
              }}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Format
            </label>
            <select
              id="genre-data-format-select"
              value={formatInput}
              onChange={(e) => setFormatInput(e.target.value as MediaFormat)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
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
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
          >
            Submit Filters
          </button>
        </div>
      </form>

      {/* Empty / Unsubmitted State */}
      {!isSubmitted && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-12 text-center space-y-3">
          <div className="text-4xl">📊</div>
          <h3 className="text-lg font-semibold text-white">
            Select Filters & Submit
          </h3>
          <p className="text-neutral-400 text-sm max-w-md mx-auto">
            Please select a Season, Season Year, and Format above, then click &quot;Submit Filters&quot; to fetch and display genre analytics.
          </p>
        </div>
      )}

      {/* Chart State */}
      {isSubmitted && loading && (
        <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-neutral-400 text-sm animate-pulse">
            Loading genre statistics...
          </p>
        </div>
      )}

      {isSubmitted && error && !loading && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-6 text-red-400 space-y-2">
          <h3 className="font-semibold text-lg">Error loading data</h3>
          <p className="text-sm text-red-300/80">{error}</p>
        </div>
      )}

      {isSubmitted && !loading && !error && data && (
        <GenreBarChart
          data={data}
          metric={metric}
          onMetricChange={setMetric}
          season={activeSeason as Season}
          seasonYear={activeYear as number}
          format={activeFormat as MediaFormat}
        />
      )}
    </div>
  );
}
