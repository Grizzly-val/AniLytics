"use client";

import { memo } from "react";
import { ProcessedAnime } from "./AnimeGrid";
import { getAnimeDomId } from "@/lib/utils";

interface AnimeTableProps {
  items: ProcessedAnime[];
  highlightedTitle?: string | null;
}

export const AnimeTable = memo(function AnimeTable({
  items,
  highlightedTitle,
}: AnimeTableProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-x-auto shadow-md">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-neutral-800 bg-neutral-900/80 uppercase font-semibold text-neutral-400 tracking-wider">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3 text-right">Score</th>
            <th className="px-4 py-3 text-right">Popularity</th>
            <th className="px-4 py-3 text-right">Trending</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
          {items.map((item, idx) => {
            const isHighlighted = highlightedTitle === item.primaryTitle;
            const domId = getAnimeDomId(item.primaryTitle);

            return (
              <tr
                key={item.anime.siteUrl || idx}
                id={domId}
                className={`transition-all duration-300 ${
                  isHighlighted
                    ? "bg-indigo-950/70 border-l-4 border-l-indigo-500 font-semibold"
                    : "hover:bg-neutral-800/30"
                }`}
              >
                <td className="px-4 py-3 text-neutral-500 font-medium">
                  {idx + 1}
                </td>
                <td className="px-4 py-3 font-medium text-white max-w-xs truncate">
                  <div>{item.primaryTitle}</div>
                  {item.secondaryTitle && (
                    <div className="text-[10px] text-neutral-500 truncate">
                      {item.secondaryTitle}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-bold text-emerald-400">
                  {item.anime.score}
                </td>
                <td className="px-4 py-3 text-right text-neutral-300">
                  {item.anime.popularity.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-amber-400">
                  {item.anime.trending}
                </td>
                <td className="px-4 py-3 text-center">
                  <a
                    href={item.anime.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    AniList ↗
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
