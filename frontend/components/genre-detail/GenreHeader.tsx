"use client";

import { memo } from "react";
import Link from "next/link";
import { Season, MediaFormat } from "@/lib/types";
import { SEASONS, FORMATS } from "@/lib/utils";

interface GenreHeaderProps {
  decodedGenre: string;
  season: Season;
  seasonYear: number;
  format: MediaFormat;
  onSeasonChange: (season: Season) => void;
  onYearChange: (year: number) => void;
  onFormatChange: (format: MediaFormat) => void;
}

export const GenreHeader = memo(function GenreHeader({
  decodedGenre,
  season,
  seasonYear,
  format,
  onSeasonChange,
  onYearChange,
  onFormatChange,
}: GenreHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-800 pb-6">
      <div>
        <Link
          href="/genre-data"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition mb-2"
          id="back-to-genre-data-link"
        >
          &larr; Back to Genre Overview
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {decodedGenre}
            </span>
          </h1>
          <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-neutral-300 border border-neutral-700">
            {season} {seasonYear} • {format}
          </span>
        </div>
        <p className="text-neutral-400 text-sm mt-1">
          Detailed breakdown and performance analytics for {decodedGenre} anime.
        </p>
      </div>

      {/* Dynamic Filter Controls */}
      <div className="grid grid-cols-3 gap-2 bg-neutral-900/80 p-2 rounded-xl border border-neutral-800 backdrop-blur-sm self-start md:self-auto">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1 px-1">
            Season
          </label>
          <select
            id="genre-detail-season-select"
            value={season}
            onChange={(e) => onSeasonChange(e.target.value as Season)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition"
          >
            {SEASONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1 px-1">
            Year
          </label>
          <input
            id="genre-detail-year-input"
            type="number"
            value={seasonYear}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) onYearChange(val);
            }}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1 px-1">
            Format
          </label>
          <select
            id="genre-detail-format-select"
            value={format}
            onChange={(e) => onFormatChange(e.target.value as MediaFormat)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition"
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
});
