"use client";

import { memo } from "react";
import { ProcessedAnime } from "./AnimeGrid";
import { getAnimeDomId, getScoreStyle } from "@/lib/utils";
import { ScrollReveal } from "@/components/common/ScrollReveal";

interface AnimeTableProps {
  items: ProcessedAnime[];
  highlightedTitle?: string | null;
}

export const AnimeTable = memo(function AnimeTable({
  items,
  highlightedTitle,
}: AnimeTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-160 text-left">
        <thead>
          <tr className="border-b border-anilytics-line-soft font-mono text-2xs tracking-wider-md uppercase text-anilytics-text-low font-medium">
            <th className="px-3.5 py-0 pb-3">#</th>
            <th className="px-3.5 py-0 pb-3">Title</th>
            <th className="px-3.5 py-0 pb-3 max-w-42.5">Genres</th>
            <th className="px-3.5 py-0 pb-3 text-right">Score</th>
            <th className="px-3.5 py-0 pb-3 text-right">Members</th>
            <th className="px-3.5 py-0 pb-3 text-right">Trending</th>
            <th className="px-3.5 py-0 pb-3 text-right">Favourites</th>
            <th className="px-3.5 py-0 pb-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-anilytics-line-soft">
          {items.map((item, idx) => {
            const isHighlighted = highlightedTitle === item.primaryTitle;
            const domId = getAnimeDomId(item.primaryTitle);
            const scoreColor = getScoreStyle(item.anime.score);
            const rankStr = String(idx + 1).padStart(2, "0");

            return (
              <ScrollReveal
                as="tr"
                key={item.anime.siteUrl || idx}
                id={domId}
                direction="up"
                delay={(idx % 10) * 40}
                duration={400}
                className={`group transition-all duration-300 ${
                  isHighlighted
                    ? "bg-anilytics-purple-light-16"
                    : "hover:bg-anilytics-white-2"
                }`}
              >
                {/* Rank Column */}
                <td className="px-3.5 py-3 font-mono text-label text-anilytics-text-low align-middle">
                  {rankStr}
                </td>

                {/* Title Column */}
                <td className="px-3.5 py-3 align-middle">
                  <div className="font-display font-medium text-body text-anilytics-text-hi mb-0.5 line-clamp-1">
                    {item.primaryTitle}
                  </div>
                  {item.secondaryTitle && (
                    <div className="text-label text-anilytics-text-low line-clamp-1">
                      {item.secondaryTitle}
                    </div>
                  )}
                </td>

                {/* Genres Column */}
                <td className="px-3.5 py-3 align-middle max-w-42.5">
                  {item.anime?.genres && item.anime?.genres.length > 0 ? (
                    <div className="flex items-center gap-1 overflow-hidden truncate">
                      {item.anime.genres.slice(0, 2).map((g) => (
                        <span
                          key={g}
                          className="px-1.5 py-0.5 rounded text-badge font-mono tracking-wide bg-purple-500/10 border border-purple-500/20 text-purple-300 shrink-0"
                        >
                          {g}
                        </span>
                      ))}
                      {item.anime?.genres.length > 2 && (
                        <span className="px-1 py-0.5 rounded text-3xs font-mono text-anilytics-text-low bg-anilytics-panel-2 border border-anilytics-line-soft shrink-0">
                          +{item.anime?.genres.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-label text-anilytics-text-low font-mono">-</span>
                  )}
                </td>

                {/* Score Column */}
                <td
                  className="px-3.5 py-3 text-right font-mono text-xs font-semibold align-middle"
                  style={{ color: scoreColor }}
                >
                  {item.anime.score}
                </td>

                {/* Members Column */}
                <td className="px-3.5 py-3 text-right font-mono text-xs text-anilytics-metric-blue align-middle">
                  {item.anime.popularity.toLocaleString("en-US")}
                </td>

                {/* Trending Column */}
                <td className="px-3.5 py-3 text-right font-mono text-xs text-anilytics-metric-peach align-middle">
                  {item.anime.trending}
                </td>

                {/* Favourites Column */}
                <td className="px-3.5 py-3 text-right font-mono text-xs text-anilytics-metric-pink align-middle">
                  {item.anime.favourites !== undefined ? item.anime.favourites.toLocaleString("en-US") : "-"}
                </td>

                {/* Action Link Column */}
                <td className="px-3.5 py-3 text-right align-middle">
                  <a
                    href={item.anime.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.25 group-hover:gap-2 font-medium text-xs text-anilytics-purple-300 transition-all"
                  >
                    <span>AniList</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-2.75 h-2.75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    >
                      <path d="M7 17 17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </a>
                </td>
              </ScrollReveal>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
