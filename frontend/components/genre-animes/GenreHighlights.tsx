"use client";

import { memo } from "react";
import { AnimeItem } from "@/lib/types";

interface GenreHighlightsProps {
  topScoredAnime: { anime: AnimeItem; primaryTitle: string; secondaryTitle: string | null } | null;
  mostPopularAnime: { anime: AnimeItem; primaryTitle: string; secondaryTitle: string | null } | null;
}

export const GenreHighlights = memo(function GenreHighlights({
  topScoredAnime,
  mostPopularAnime,
}: GenreHighlightsProps) {
  if (!topScoredAnime && !mostPopularAnime) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {topScoredAnime && (
        <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 to-neutral-900/60 p-5 relative overflow-hidden">
          <div className="absolute top-3 right-3 text-xs uppercase font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-full">
            Highest Scored
          </div>
          <p className="text-xs text-neutral-400 uppercase font-medium">Top Performer</p>
          <h3 className="text-xl font-bold text-white mt-1 line-clamp-1">
            {topScoredAnime.primaryTitle}
          </h3>
          {topScoredAnime.secondaryTitle && (
            <p className="text-xs text-neutral-400 line-clamp-1">
              {topScoredAnime.secondaryTitle}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-emerald-400 font-bold">
                ★ {topScoredAnime.anime.score}
              </span>
              <span className="text-neutral-400">
                👥 {topScoredAnime.anime.popularity.toLocaleString()}
              </span>
            </div>
            <a
              href={topScoredAnime.anime.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
              View on AniList &rarr;
            </a>
          </div>
        </div>
      )}

      {mostPopularAnime && (
        <div className="rounded-xl border border-pink-500/30 bg-gradient-to-br from-pink-950/30 to-neutral-900/60 p-5 relative overflow-hidden">
          <div className="absolute top-3 right-3 text-xs uppercase font-bold text-pink-400 bg-pink-500/10 border border-pink-500/30 px-2.5 py-1 rounded-full">
            Most Popular
          </div>
          <p className="text-xs text-neutral-400 uppercase font-medium">Fan Favorite</p>
          <h3 className="text-xl font-bold text-white mt-1 line-clamp-1">
            {mostPopularAnime.primaryTitle}
          </h3>
          {mostPopularAnime.secondaryTitle && (
            <p className="text-xs text-neutral-400 line-clamp-1">
              {mostPopularAnime.secondaryTitle}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-emerald-400 font-bold">
                ★ {mostPopularAnime.anime.score}
              </span>
              <span className="text-pink-400 font-bold">
                👥 {mostPopularAnime.anime.popularity.toLocaleString()}
              </span>
            </div>
            <a
              href={mostPopularAnime.anime.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-pink-400 hover:text-pink-300 transition"
            >
              View on AniList &rarr;
            </a>
          </div>
        </div>
      )}
    </div>
  );
});
