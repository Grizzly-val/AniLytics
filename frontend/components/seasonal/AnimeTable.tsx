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
      <table className="w-full border-collapse min-w-[640px] text-left">
        <thead>
          <tr className="border-b border-[var(--line-soft)] font-mono text-[10px] tracking-[0.06em] uppercase text-[var(--text-low)] font-medium">
            <th className="px-3.5 py-0 pb-3">#</th>
            <th className="px-3.5 py-0 pb-3">Title</th>
            <th className="px-3.5 py-0 pb-3 max-w-[170px]">Genres</th>
            <th className="px-3.5 py-0 pb-3 text-right">Score</th>
            <th className="px-3.5 py-0 pb-3 text-right">Members</th>
            <th className="px-3.5 py-0 pb-3 text-right">Trending</th>
            <th className="px-3.5 py-0 pb-3 text-right">Favourites</th>
            <th className="px-3.5 py-0 pb-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line-soft)]">
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
                    ? "bg-[rgba(178,133,251,0.16)]"
                    : "hover:bg-[rgba(255,255,255,0.02)]"
                }`}
              >
                {/* Rank Column */}
                <td className="px-3.5 py-3 font-mono text-[11px] text-[var(--text-low)] align-middle">
                  {rankStr}
                </td>

                {/* Title Column */}
                <td className="px-3.5 py-3 align-middle">
                  <div className="font-display font-medium text-[13.5px] text-[var(--text-hi)] mb-0.5 line-clamp-1">
                    {item.primaryTitle}
                  </div>
                  {item.secondaryTitle && (
                    <div className="text-[11px] text-[var(--text-low)] line-clamp-1">
                      {item.secondaryTitle}
                    </div>
                  )}
                </td>

                {/* Genres Column */}
                <td className="px-3.5 py-3 align-middle max-w-[170px]">
                  {item.anime?.genres && item.anime?.genres.length > 0 ? (
                    <div className="flex items-center gap-1 overflow-hidden truncate">
                      {item.anime.genres.slice(0, 2).map((g) => (
                        <span
                          key={g}
                          className="px-1.5 py-0.5 rounded text-[9.5px] font-mono tracking-wide bg-purple-500/10 border border-purple-500/20 text-purple-300 shrink-0"
                        >
                          {g}
                        </span>
                      ))}
                      {item.anime?.genres.length > 2 && (
                        <span className="px-1 py-0.5 rounded text-[9px] font-mono text-[var(--text-low)] bg-[var(--panel-2)] border border-[var(--line-soft)] shrink-0">
                          +{item.anime?.genres.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-[var(--text-low)] font-mono">-</span>
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
                <td className="px-3.5 py-3 text-right font-mono text-xs text-[#93b9f2] align-middle">
                  {item.anime.popularity.toLocaleString("en-US")}
                </td>

                {/* Trending Column */}
                <td className="px-3.5 py-3 text-right font-mono text-xs text-[#f2a48d] align-middle">
                  {item.anime.trending}
                </td>

                {/* Favourites Column */}
                <td className="px-3.5 py-3 text-right font-mono text-xs text-[#f472b6] align-middle">
                  {item.anime.favourites !== undefined ? item.anime.favourites.toLocaleString("en-US") : "-"}
                </td>

                {/* Action Link Column */}
                <td className="px-3.5 py-3 text-right align-middle">
                  <a
                    href={item.anime.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.25 group-hover:gap-2 font-medium text-xs text-[var(--purple-300)] transition-all"
                  >
                    <span>AniList</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-[11px] h-[11px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
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
