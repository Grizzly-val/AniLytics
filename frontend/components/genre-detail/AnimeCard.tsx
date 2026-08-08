"use client";

import { memo } from "react";
import { AnimeItem } from "@/lib/types";
import { getScoreBadgeClass, getAnimeDomId } from "@/lib/utils";

interface AnimeCardProps {
  anime: AnimeItem;
  primaryTitle: string;
  secondaryTitle: string | null;
  isHighlighted?: boolean;
}

export const AnimeCard = memo(function AnimeCard({
  anime,
  primaryTitle,
  secondaryTitle,
  isHighlighted = false,
}: AnimeCardProps) {
  const badgeClass = getScoreBadgeClass(anime.score);
  const domId = getAnimeDomId(primaryTitle);

  return (
    <div
      id={domId}
      className={`rounded-xl border p-5 backdrop-blur-sm shadow-md flex flex-col justify-between space-y-4 transition-all duration-300 ${
        isHighlighted
          ? "border-indigo-500 bg-indigo-950/50 ring-2 ring-indigo-500/80 shadow-indigo-500/20 scale-[1.01]"
          : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-700"
      }`}
    >
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-base font-bold text-white leading-snug line-clamp-2">
            {primaryTitle}
          </h4>
          <span className={`shrink-0 text-xs font-extrabold px-2.5 py-1 rounded-md border ${badgeClass}`}>
            {anime.score}
          </span>
        </div>
        {secondaryTitle && (
          <p className="text-xs text-neutral-400 line-clamp-1">
            {secondaryTitle}
          </p>
        )}
      </div>

      <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-neutral-400">
          <span>👥 {anime.popularity.toLocaleString()}</span>
          <span>🔥 {anime.trending}</span>
        </div>
        <a
          href={anime.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 transition"
        >
          AniList ↗
        </a>
      </div>
    </div>
  );
});
