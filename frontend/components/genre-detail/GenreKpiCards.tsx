"use client";

import { memo } from "react";
import { GenreStats, Season, MediaFormat } from "@/lib/types";

interface GenreKpiCardsProps {
  stats: GenreStats;
  season: Season;
  seasonYear: number;
  format: MediaFormat;
}

export const GenreKpiCards = memo(function GenreKpiCards({
  stats,
  season,
  seasonYear,
  format,
}: GenreKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Anime Card */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-sm shadow-md flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Total Anime
          </p>
          <p className="text-3xl font-extrabold text-white mt-1">
            {stats.count}
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">
            In {season} {seasonYear} ({format})
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xl font-bold">
          🎬
        </div>
      </div>

      {/* Avg Score Card */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-sm shadow-md flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Avg Score
          </p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-1">
            {stats.average_score.toFixed(2)}
          </p>
          <div className="w-24 bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${Math.min(100, stats.average_score)}%` }}
            />
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xl font-bold">
          ⭐
        </div>
      </div>

      {/* Avg Popularity Card */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-sm shadow-md flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Avg Popularity
          </p>
          <p className="text-3xl font-extrabold text-pink-400 mt-1">
            {Math.round(stats.average_popularity).toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">Total viewers count</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xl font-bold">
          👥
        </div>
      </div>

      {/* Avg Trending Card */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-sm shadow-md flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Avg Trending
          </p>
          <p className="text-3xl font-extrabold text-amber-400 mt-1">
            {stats.average_trending.toFixed(2)}
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">Activity index</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xl font-bold">
          🔥
        </div>
      </div>
    </div>
  );
});
