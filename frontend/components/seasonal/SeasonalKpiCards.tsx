"use client";

import { memo } from "react";
import { AggregateStats, Season } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

interface SeasonalKpiCardsProps {
  stats: AggregateStats;
  season: Season;
  seasonYear: number;
  activeFilter?: string;
}

export const SeasonalKpiCards = memo(function SeasonalKpiCards({
  stats,
  season,
  seasonYear,
  activeFilter,
}: SeasonalKpiCardsProps) {
  const hasFavourites = typeof stats.average_favourites === "number";

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${hasFavourites ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-[18px] mb-6`}>
      {/* 1. Total Anime */}
      <ScrollReveal direction="up" delay={40} duration={500}>
        <div className="bg-gradient-to-br from-[var(--panel-2)] to-[var(--panel)] border border-[var(--line)] border-t-2 border-t-[rgba(178,133,251,0.38)] rounded-2xl p-[22px_22px_20px] h-full flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-[36px] h-[36px] rounded-xl bg-[rgba(178,133,251,0.10)] border border-[rgba(178,133,251,0.22)] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#b285fb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                <path d="M12 3 2 8l10 5 10-5-10-5Z" />
                <path d="M2 13l10 5 10-5" />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--text-low)]">
                Total Anime
              </span>
            </div>
            <div className="font-display font-normal text-[29px] tracking-[-0.02em] text-[var(--text-hi)] mb-1">
              {stats.count}
            </div>
            <div className="font-mono text-[10.5px] text-[var(--text-low)]">
              In {season} {seasonYear} {activeFilter ? `(${activeFilter})` : ""}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 2. Avg Score */}
      <ScrollReveal direction="up" delay={80} duration={500}>
        <div className="bg-gradient-to-br from-[var(--panel-2)] to-[var(--panel)] border border-[var(--line)] border-t-2 border-t-[rgba(227,201,143,0.38)] rounded-2xl p-[22px_22px_20px] h-full flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-[36px] h-[36px] rounded-xl bg-[rgba(227,201,143,0.10)] border border-[rgba(227,201,143,0.22)] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="#d8c48a" stroke="none" className="w-[16px] h-[16px]">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2 relative">
              <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--text-low)]">
                Avg Score
              </span>
              <div className="group relative cursor-help w-[17px] h-[17px] rounded-full border border-[rgba(178,133,251,0.32)] font-mono text-[10px] text-[var(--text-mid)] flex items-center justify-center hover:border-[var(--purple-400)] hover:text-[var(--purple-300)] hover:bg-[rgba(155,92,246,0.06)] transition-colors">
                ?
                <div className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 absolute left-1/2 top-[calc(100%+10px)] -translate-x-1/2 w-[225px] bg-gradient-to-br from-[var(--panel-2)] to-[var(--panel)] border border-[var(--line)] rounded-xl p-[12px_14px] text-xs leading-[1.55] text-[var(--text-mid)] text-left z-50 shadow-2xl">
                  Weighted rating based on reviews from AniList users, adjusted to prevent bias.
                </div>
              </div>
            </div>
            <div className="font-display font-normal text-[29px] tracking-[-0.02em] text-[var(--text-hi)] mb-1">
              {stats.average_score.toFixed(2)}
            </div>
            <div className="font-mono text-[10.5px] text-[var(--text-low)]">
              Out of 100
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 3. Avg Popularity */}
      <ScrollReveal direction="up" delay={120} duration={500}>
        <div className="bg-gradient-to-br from-[var(--panel-2)] to-[var(--panel)] border border-[var(--line)] border-t-2 border-t-[rgba(147,185,242,0.38)] rounded-2xl p-[22px_22px_20px] h-full flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-[36px] h-[36px] rounded-xl bg-[rgba(147,185,242,0.10)] border border-[rgba(147,185,242,0.22)] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#93b9f2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2 relative">
              <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--text-low)]">
                Avg Popularity
              </span>
              <div className="group relative cursor-help w-[17px] h-[17px] rounded-full border border-[rgba(178,133,251,0.32)] font-mono text-[10px] text-[var(--text-mid)] flex items-center justify-center hover:border-[var(--purple-400)] hover:text-[var(--purple-300)] hover:bg-[rgba(155,92,246,0.06)] transition-colors">
                ?
                <div className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 absolute left-1/2 top-[calc(100%+10px)] -translate-x-1/2 w-[225px] bg-gradient-to-br from-[var(--panel-2)] to-[var(--panel)] border border-[var(--line)] rounded-xl p-[12px_14px] text-xs leading-[1.55] text-[var(--text-mid)] text-left z-50 shadow-2xl">
                  The total number of AniList users who have added this to their list.
                </div>
              </div>
            </div>
            <div className="font-display font-normal text-[29px] tracking-[-0.02em] text-[var(--text-hi)] mb-1">
              {Math.round(stats.average_popularity).toLocaleString("en-US")}
            </div>
            <div className="font-mono text-[10.5px] text-[var(--text-low)]">
              Total viewers count
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 4. Avg Trending */}
      <ScrollReveal direction="up" delay={160} duration={500}>
        <div className="bg-gradient-to-br from-[var(--panel-2)] to-[var(--panel)] border border-[var(--line)] border-t-2 border-t-[rgba(242,164,141,0.38)] rounded-2xl p-[22px_22px_20px] h-full flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-[36px] h-[36px] rounded-xl bg-[rgba(242,164,141,0.10)] border border-[rgba(242,164,141,0.22)] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#f2a48d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2 relative">
              <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--text-low)]">
                Avg Trending
              </span>
              <div className="group relative cursor-help w-[17px] h-[17px] rounded-full border border-[rgba(178,133,251,0.32)] font-mono text-[10px] text-[var(--text-mid)] flex items-center justify-center hover:border-[var(--purple-400)] hover:text-[var(--purple-300)] hover:bg-[rgba(155,92,246,0.06)] transition-colors">
                ?
                <div className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 absolute left-1/2 top-[calc(100%+10px)] -translate-x-1/2 w-[225px] bg-gradient-to-br from-[var(--panel-2)] to-[var(--panel)] border border-[var(--line)] rounded-xl p-[12px_14px] text-xs leading-[1.55] text-[var(--text-mid)] text-left z-50 shadow-2xl">
                  Recent daily spikes in activity — e.g. one trending point is gained each time a user updates their list progress, drops a review, or adds an anime to their favorites.
                </div>
              </div>
            </div>
            <div className="font-display font-normal text-[29px] tracking-[-0.02em] text-[var(--text-hi)] mb-1">
              {stats.average_trending.toFixed(2)}
            </div>
            <div className="font-mono text-[10.5px] text-[var(--text-low)]">
              Activity index
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 5. Avg Favourites (New Field) */}
      {hasFavourites && (
        <ScrollReveal direction="up" delay={200} duration={500}>
          <div className="bg-gradient-to-br from-[var(--panel-2)] to-[var(--panel)] border border-[var(--line)] border-t-2 border-t-[rgba(244,114,182,0.38)] rounded-2xl p-[22px_22px_20px] h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-[36px] h-[36px] rounded-xl bg-[rgba(244,114,182,0.10)] border border-[rgba(244,114,182,0.22)] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2 relative">
                <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--text-low)]">
                  Avg Favourites
                </span>
                <div className="group relative cursor-help w-[17px] h-[17px] rounded-full border border-[rgba(178,133,251,0.32)] font-mono text-[10px] text-[var(--text-mid)] flex items-center justify-center hover:border-[var(--purple-400)] hover:text-[var(--purple-300)] hover:bg-[rgba(155,92,246,0.06)] transition-colors">
                  ?
                  <div className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 absolute left-1/2 top-[calc(100%+10px)] -translate-x-1/2 w-[225px] bg-gradient-to-br from-[var(--panel-2)] to-[var(--panel)] border border-[var(--line)] rounded-xl p-[12px_14px] text-xs leading-[1.55] text-[var(--text-mid)] text-left z-50 shadow-2xl">
                    Average number of AniList users who favourited entries in this category.
                  </div>
                </div>
              </div>
              <div className="font-display font-normal text-[29px] tracking-[-0.02em] text-[var(--text-hi)] mb-1">
                {Math.round(stats.average_favourites!).toLocaleString("en-US")}
              </div>
              <div className="font-mono text-[10.5px] text-[var(--text-low)]">
                Favorites count
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
});


