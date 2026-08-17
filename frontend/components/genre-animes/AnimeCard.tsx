"use client";

import { memo } from "react";
import { AnimeItem } from "@/lib/types";
import { getAnimeDomId } from "@/lib/utils";

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
  const domId = getAnimeDomId(primaryTitle);

  return (
    <div
      id={domId}
      className={`rounded-xl border p-5 backdrop-blur-sm shadow-md transition-all duration-300 flex flex-col justify-between ${
        isHighlighted
          ? "border-purple-400 bg-purple-950/40 ring-2 ring-purple-400/80 shadow-purple-500/20 scale-[1.01]"
          : "border-neutral-800/80 bg-neutral-900/50 hover:border-purple-500/40 hover:bg-neutral-900/80"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-bold text-white text-base sm:text-lg line-clamp-2">
            {primaryTitle}
          </h4>
          <span className="shrink-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
            ★ {anime.score}
          </span>
        </div>

        {secondaryTitle && (
          <p className="text-xs text-neutral-400 mt-1 line-clamp-1 font-normal">
            {secondaryTitle}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-neutral-400">
          <span>👥 {anime.popularity.toLocaleString()}</span>
          <span className="text-amber-400 font-medium">🔥 {anime.trending}</span>
        </div>

        <a
          href={anime.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-purple-300 hover:text-purple-200 transition"
        >
          AniList ↗
        </a>
      </div>
    </div>
  );
});
