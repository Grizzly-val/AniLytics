"use client";

import { memo } from "react";
import { AnimeItem } from "@/lib/types";
import { getAnimeDomId, getScoreStyle, getAnimeBannerImage, ANIME_PLACEHOLDER_BANNER } from "@/lib/utils";

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
  const bannerSrc = getAnimeBannerImage(anime);
  const scoreColor = getScoreStyle(anime.score);

  return (
    <div
      id={domId}
      className={`group bg-gradient-to-br from-[var(--panel-2)] to-[var(--panel)] border rounded-2xl px-[20px] pb-[18px] overflow-hidden relative transition-all duration-300 flex flex-col justify-between ${
        isHighlighted
          ? "border-[var(--purple-400)] shadow-[0_0_0_4px_rgba(178,133,251,0.25)] scale-[1.01]"
          : "border-[var(--line)] hover:border-[rgba(178,133,251,0.35)] hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-30px_rgba(124,58,237,0.5)]"
      }`}
    >
      <div>
        {/* Media Banner Header */}
        <div className="h-[86px] -mx-[20px] mb-4 relative overflow-hidden bg-[var(--panel-2)] border-b border-[var(--line-soft)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerSrc}
            alt={`${primaryTitle} banner`}
            loading="lazy"
            onError={(e) => {
              if (e.currentTarget.src !== ANIME_PLACEHOLDER_BANNER) {
                e.currentTarget.src = ANIME_PLACEHOLDER_BANNER;
              }
            }}
            className="w-full h-full object-cover object-center saturate-[0.82] contrast-[0.94] opacity-68 scale-[1.015] transition-all duration-600 ease-[cubic-bezier(.65,0,.35,1)] group-hover:scale-[1.05] group-hover:opacity-86 group-hover:saturate-[0.98] group-hover:contrast-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(8,7,12,0.04)] via-[rgba(8,7,12,0.18)] to-[rgba(19,16,25,0.98)] pointer-events-none" />
          <span className="absolute left-[14px] bottom-[10px] z-10 font-mono text-[8.5px] tracking-[0.09em] uppercase text-[rgba(244,242,248,0.52)]">
            anime / banner
          </span>
        </div>

        {/* Title & Score */}
        <div className="flex items-start justify-between gap-2.5 mb-1.25">
          <h4 className="font-display font-medium text-[14px] leading-[1.32] text-[var(--text-hi)] line-clamp-2">
            {primaryTitle}
          </h4>
          <div className="flex items-center gap-1 font-mono text-xs shrink-0 pt-0.5" style={{ color: scoreColor }}>
            <svg viewBox="0 0 24 24" fill="#d8c48a" stroke="none" className="w-[11px] h-[11px]">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>{anime.score}</span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-[11.5px] text-[var(--text-low)] leading-[1.4] mb-4 line-clamp-1">
          {secondaryTitle || "\u00A0"}
        </p>
      </div>

      {/* Meta Footer Row */}
      <div className="pt-2.5 border-t border-[var(--line-soft)] flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3.5 font-mono text-[11px] text-[var(--text-mid)]">
          <span className="flex items-center gap-1 text-[#93b9f2]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            <span className="text-[var(--text-mid)]">{anime.popularity.toLocaleString("en-US")}</span>
          </span>
          <span className="flex items-center gap-1 text-[#f2a48d]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            <span className="text-[var(--text-mid)]">{anime.trending}</span>
          </span>
        </div>

        <a
          href={anime.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-medium text-[11.5px] text-[var(--purple-300)] group-hover:gap-1.75 transition-all"
        >
          <span>AniList</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[11px] h-[11px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
      </div>
    </div>
  );
});

