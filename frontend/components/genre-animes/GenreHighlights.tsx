"use client";

import { memo } from "react";
import { AnimeItem } from "@/lib/types";
import { getScoreStyle, getAnimeBannerImage, ANIME_PLACEHOLDER_BANNER } from "@/lib/utils";
import { ScrollReveal } from "@/components/common/ScrollReveal";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] mb-9">
      {/* 1. Top Performer / Highest Scored */}
      {topScoredAnime && (
        <ScrollReveal direction="up" delay={200} duration={500}>
          <div className="group rounded-2xl border border-[var(--line)] border-t-2 border-t-[rgba(115,210,150,0.34)] bg-gradient-to-br from-[rgba(92,188,124,0.055)] to-[var(--panel)] relative overflow-hidden h-full transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(115,210,150,0.46)] hover:shadow-[0_18px_45px_-28px_rgba(72,187,117,0.22)] flex flex-col justify-between">
            {/* Banner Header - Image strictly clipped at 132px */}
            <div className="h-[132px] w-full relative overflow-hidden bg-[var(--panel-2)] border-b border-[var(--line-soft)] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getAnimeBannerImage(topScoredAnime.anime)}
                alt={`${topScoredAnime.primaryTitle} banner`}
                onError={(e) => {
                  if (e.currentTarget.src !== ANIME_PLACEHOLDER_BANNER) {
                    e.currentTarget.src = ANIME_PLACEHOLDER_BANNER;
                  }
                }}
                className="w-full h-full object-cover object-center saturate-[0.88] contrast-[0.96] opacity-78 scale-[1.015] transition-all duration-700 ease-[cubic-bezier(.65,0,.35,1)] group-hover:scale-[1.045] group-hover:opacity-92 group-hover:saturate-100 group-hover:contrast-100 will-change-transform"
              />
              <span className="absolute left-4 bottom-3.25 z-[5] font-mono text-[9px] tracking-[0.08em] uppercase text-[rgba(244,242,248,0.64)]">
                banner / preview
              </span>
            </div>

            {/* Unclipped Gradient Shadow Overlay extending past 132px into content area */}
            <div className="absolute top-0 left-0 right-0 h-[175px] bg-gradient-to-b from-[rgba(8,7,12,0.08)] via-[rgba(8,7,12,0.45)] to-transparent pointer-events-none z-10" />

            {/* Content Body */}
            <div className="p-[18px_20px_20px] flex flex-col justify-between flex-1 relative z-20">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-mono text-[10.5px] tracking-[0.08em] uppercase text-[var(--text-low)]">
                    Top Performer
                  </span>
                  <span className="font-mono text-[10.5px] tracking-[0.06em] uppercase text-[rgba(125,218,158,0.86)]">
                    Highest Scored
                  </span>
                </div>

                <h3 className="font-display font-medium text-[19px] text-[var(--text-hi)] mb-1 line-clamp-1">
                  {topScoredAnime.primaryTitle}
                </h3>
                <p className="text-[12.5px] text-[var(--text-low)] mb-[18px] line-clamp-1">
                  {topScoredAnime.secondaryTitle || "\u00A0"}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--line-soft)] mt-auto">
                <div className="flex items-center gap-4 font-mono text-xs text-[var(--text-mid)]">
                  <span className="flex items-center gap-1.25">
                    <svg viewBox="0 0 24 24" fill="#d8c48a" stroke="none" className="w-[12.5px] h-[12.5px]">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span style={{ color: getScoreStyle(topScoredAnime.anime.score) }}>
                      {topScoredAnime.anime.score}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.25">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#93b9f2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[12.5px] h-[12.5px]">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                    <span>{topScoredAnime.anime.popularity.toLocaleString("en-US")}</span>
                  </span>
                </div>

                <a
                  href={topScoredAnime.anime.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-medium text-[12.5px] text-[var(--purple-300)] group-hover:gap-2.25 transition-all"
                >
                  <span>View on AniList</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* 2. Fan Favorite / Most Popular */}
      {mostPopularAnime && (
        <ScrollReveal direction="up" delay={240} duration={500}>
          <div className="group rounded-2xl border border-[var(--line)] border-t-2 border-t-[rgba(147,185,242,0.32)] bg-gradient-to-br from-[rgba(102,142,206,0.055)] to-[var(--panel)] relative overflow-hidden h-full transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(147,185,242,0.44)] hover:shadow-[0_18px_45px_-28px_rgba(82,128,202,0.22)] flex flex-col justify-between">
            {/* Banner Header - Image strictly clipped at 132px */}
            <div className="h-[132px] w-full relative overflow-hidden bg-[var(--panel-2)] border-b border-[var(--line-soft)] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getAnimeBannerImage(mostPopularAnime.anime)}
                alt={`${mostPopularAnime.primaryTitle} banner`}
                onError={(e) => {
                  if (e.currentTarget.src !== ANIME_PLACEHOLDER_BANNER) {
                    e.currentTarget.src = ANIME_PLACEHOLDER_BANNER;
                  }
                }}
                className="w-full h-full object-cover object-center saturate-[0.88] contrast-[0.96] opacity-78 scale-[1.015] transition-all duration-700 ease-[cubic-bezier(.65,0,.35,1)] group-hover:scale-[1.045] group-hover:opacity-92 group-hover:saturate-100 group-hover:contrast-100 will-change-transform"
              />
              <span className="absolute left-4 bottom-3.25 z-[5] font-mono text-[9px] tracking-[0.08em] uppercase text-[rgba(244,242,248,0.64)]">
                banner / preview
              </span>
            </div>

            {/* Unclipped Gradient Shadow Overlay extending past 132px into content area */}
            <div className="absolute top-0 left-0 right-0 h-[175px] bg-gradient-to-b from-[rgba(8,7,12,0.08)] via-[rgba(8,7,12,0.45)] to-transparent pointer-events-none z-10" />

            {/* Content Body */}
            <div className="p-[18px_20px_20px] flex flex-col justify-between flex-1 relative z-20">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-mono text-[10.5px] tracking-[0.08em] uppercase text-[var(--text-low)]">
                    Fan Favorite
                  </span>
                  <span className="font-mono text-[10.5px] tracking-[0.06em] uppercase text-[rgba(154,192,246,0.84)]">
                    Most Popular
                  </span>
                </div>

                <h3 className="font-display font-medium text-[19px] text-[var(--text-hi)] mb-1 line-clamp-1">
                  {mostPopularAnime.primaryTitle}
                </h3>
                <p className="text-[12.5px] text-[var(--text-low)] mb-[18px] line-clamp-1">
                  {mostPopularAnime.secondaryTitle || "\u00A0"}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--line-soft)] mt-auto">
                <div className="flex items-center gap-4 font-mono text-xs text-[var(--text-mid)]">
                  <span className="flex items-center gap-1.25">
                    <svg viewBox="0 0 24 24" fill="#d8c48a" stroke="none" className="w-[12.5px] h-[12.5px]">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span style={{ color: getScoreStyle(mostPopularAnime.anime.score) }}>
                      {mostPopularAnime.anime.score}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.25">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#93b9f2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[12.5px] h-[12.5px]">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                    <span>{mostPopularAnime.anime.popularity.toLocaleString("en-US")}</span>
                  </span>
                </div>

                <a
                  href={mostPopularAnime.anime.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-medium text-[12.5px] text-[var(--purple-300)] group-hover:gap-2.25 transition-all"
                >
                  <span>View on AniList</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
});
