"use client";

import { memo } from "react";
import { ProcessedAnime } from "./AnimeGrid";
import { getAnimeDomId, getScoreStyle, getAnimeBannerImage, ANIME_PLACEHOLDER_BANNER } from "@/lib/utils";
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
            <th className="px-3.5 py-0 pb-3 text-right">Score</th>
            <th className="px-3.5 py-0 pb-3 text-right">Members</th>
            <th className="px-3.5 py-0 pb-3 text-right">Trending</th>
            <th className="px-3.5 py-0 pb-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line-soft)]">
          {items.map((item, idx) => {
            const isHighlighted = highlightedTitle === item.primaryTitle;
            const domId = getAnimeDomId(item.primaryTitle);
            const scoreColor = getScoreStyle(item.anime.score);
            const rankStr = String(idx + 1).padStart(2, "0");
            const bannerSrc = getAnimeBannerImage(item.anime);

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
                <td className="px-3.5 py-2.5 font-mono text-[11px] text-[var(--text-low)] align-middle">
                  {rankStr}
                </td>

                {/* Title Column with Wide Banner Overlay Layer */}
                <td className="px-3.5 py-2.5 align-middle">
                  <div className="min-w-[300px] min-h-[42px] group-hover:min-h-[82px] relative flex items-center isolate overflow-visible transition-[min-height] duration-500 ease-[cubic-bezier(.65,0,.35,1)]">
                    {/* Banner Image Layer */}
                    <div className="absolute -z-10 left-0 right-[-28px] top-0 bottom-0 overflow-hidden pointer-events-none [mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.18)_9%,#000_29%,#000_93%,rgba(0,0,0,0.92)_98%,rgba(0,0,0,0.72)_100%)]">
                      {/* Overlay fade */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--panel)] via-[rgba(19,16,25,0.72)] to-transparent pointer-events-none" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={bannerSrc}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        onError={(e) => {
                          if (e.currentTarget.src !== ANIME_PLACEHOLDER_BANNER) {
                            e.currentTarget.src = ANIME_PLACEHOLDER_BANNER;
                          }
                        }}
                        className="w-full h-full object-cover object-center saturate-[0.72] contrast-[0.94] opacity-70 scale-[1.015] group-hover:scale-[1.025] group-hover:opacity-88 group-hover:saturate-[0.9] group-hover:contrast-100 transition-all duration-600 ease-[cubic-bezier(.65,0,.35,1)]"
                      />
                    </div>

                    <div className="relative z-10 min-w-0 pr-3">
                      <div className="font-display font-medium text-[13.5px] text-[var(--text-hi)] mb-0.5 line-clamp-1">
                        {item.primaryTitle}
                      </div>
                      {item.secondaryTitle && (
                        <div className="text-[11px] text-[var(--text-low)] line-clamp-1">
                          {item.secondaryTitle}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Score Column */}
                <td className="px-3.5 py-2.5 text-right font-mono text-xs font-semibold align-middle" style={{ color: scoreColor }}>
                  {item.anime.score}
                </td>

                {/* Members Column */}
                <td className="px-3.5 py-2.5 text-right font-mono text-xs text-[#93b9f2] align-middle">
                  {item.anime.popularity.toLocaleString("en-US")}
                </td>

                {/* Trending Column */}
                <td className="px-3.5 py-2.5 text-right font-mono text-xs text-[#f2a48d] align-middle">
                  {item.anime.trending}
                </td>

                {/* Action Link Column */}
                <td className="px-3.5 py-2.5 text-right align-middle">
                  <a
                    href={item.anime.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.25 group-hover:gap-2 font-medium text-xs text-[var(--purple-300)] transition-all"
                  >
                    <span>AniList</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[11px] h-[11px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
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

