"use client";

import { useState, useEffect } from "react";
import { Season, MediaFormat, GenreDataResponse } from "@/lib/types";
import GenreBarChart from "@/components/charts/GenreBarChart";

const SEASONS: Season[] = ["WINTER", "SPRING", "SUMMER", "FALL"];
const FORMATS: MediaFormat[] = [
  "TV",
  "TV_SHORT",
  "MOVIE",
  "SPECIAL",
  "OVA",
  "ONA",
  "MUSIC",
];

export default function GenreDataPage() {
  const [season, setSeason] = useState<Season>("SUMMER");
  const [seasonYear, setSeasonYear] = useState<number>(2025);
  const [format, setFormat] = useState<MediaFormat>("TV");
  const [metric, setMetric] = useState<
    "average_score" | "count" | "trending" | "popularity"
  >("average_score");

  const [data, setData] = useState<GenreDataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams({
          season,
          seasonYear: seasonYear.toString(),
          format,
        });

        const res = await fetch(`/api/genre-data?${queryParams.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error || `HTTP error! status: ${res.status}`);
        }

        const result: GenreDataResponse = await res.json();
        setData(result);
      } catch (err: any) {
        if (err.name === "AbortError") {
          return;
        }
        setError(err.message || "An unexpected error occurred.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [season, seasonYear, format]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Genre Data
        </h1>
        <p className="text-neutral-400 mt-1 text-sm">
          Filter and analyze average scores, anime count, popularity, and trending metrics across anime genres by season and format.
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-6 backdrop-blur-sm shadow-md">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Season
          </label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value as Season)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
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
            type="number"
            value={seasonYear}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) setSeasonYear(val);
            }}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as MediaFormat)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Metric
          </label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as any)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          >
            <option value="average_score">Average Score</option>
            <option value="count">Count</option>
            <option value="trending">Trending</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
      </div>

      {/* Chart State */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-neutral-400 text-sm animate-pulse">
            Loading genre statistics...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-6 text-red-400 space-y-2">
          <h3 className="font-semibold text-lg">Error loading data</h3>
          <p className="text-sm text-red-300/80">{error}</p>
        </div>
      )}

      {!loading && !error && data && (
        <GenreBarChart
          data={data}
          metric={metric}
          season={season}
          seasonYear={seasonYear}
          format={format}
        />
      )}
    </div>
  );
}
