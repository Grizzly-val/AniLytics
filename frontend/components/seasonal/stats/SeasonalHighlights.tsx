"use client";

import { memo, useMemo } from "react";
import { AnimeItem } from "@/lib/types";
import { getScoreStyle, getAnimeBannerImage, ANIME_PLACEHOLDER_BANNER } from "@/lib/utils";
import { ScrollReveal } from "@/components/common/ScrollReveal";

export interface HighlightAnimeEntry {
  anime: AnimeItem;
  primaryTitle: string;
  secondaryTitle: string | null;
}

export interface SeasonalHighlightsProps {
  topScoredAnime?: HighlightAnimeEntry | null;
  mostPopularAnime?: HighlightAnimeEntry | null;
  mostFavoritedAnime?: HighlightAnimeEntry | null;
}

export interface AwardInfo {
  id: "score" | "popularity" | "favourites";
  title: string;
  subtitle: string;
  badgeClass: string;
  borderClass: string;
}

const AWARD_CONFIGS: Record<"score" | "popularity" | "favourites", Omit<AwardInfo, "id">> = {
  score: {
    title: "Top Performer",
    subtitle: "Highest Scored",
    badgeClass: "bg-emerald-500/15 border-emerald-500/35 text-emerald-300",
    borderClass: "border-t-anilytics-metric-green-34 hover:border-anilytics-metric-green-48",
  },
  popularity: {
    title: "Attention Gatherer",
    subtitle: "Most Popular",
    badgeClass: "bg-blue-500/15 border-blue-500/35 text-blue-300",
    borderClass: "border-t-anilytics-metric-blue-32 hover:border-anilytics-metric-blue-48",
  },
  favourites: {
    title: "Fan Favorite",
    subtitle: "Most Favourites",
    badgeClass: "bg-rose-500/15 border-rose-500/35 text-rose-300",
    borderClass: "border-t-anilytics-metric-pink-32 hover:border-anilytics-metric-pink-48",
  },
};

interface ConsolidatedHighlightCard {
  key: string;
  anime: AnimeItem;
  primaryTitle: string;
  secondaryTitle: string | null;
  awards: AwardInfo[];
}

export const SeasonalHighlights = memo(function SeasonalHighlights({
  topScoredAnime,
  mostPopularAnime,
  mostFavoritedAnime,
}: SeasonalHighlightsProps) {
  const consolidatedCards = useMemo(() => {
    const map = new Map<string, ConsolidatedHighlightCard>();

    const registerAward = (
      entry: HighlightAnimeEntry | null | undefined,
      type: "score" | "popularity" | "favourites"
    ) => {
      if (!entry) return;
      const key = String(entry.anime.id ?? entry.primaryTitle);
      const award: AwardInfo = {
        id: type,
        ...AWARD_CONFIGS[type],
      };

      if (!map.has(key)) {
        map.set(key, {
          key,
          anime: entry.anime,
          primaryTitle: entry.primaryTitle,
          secondaryTitle: entry.secondaryTitle,
          awards: [award],
        });
      } else {
        const existing = map.get(key)!;
        if (!existing.awards.some((a) => a.id === type)) {
          existing.awards.push(award);
        }
      }
    };

    registerAward(topScoredAnime, "score");
    registerAward(mostPopularAnime, "popularity");
    registerAward(mostFavoritedAnime, "favourites");

    return Array.from(map.values());
  }, [topScoredAnime, mostPopularAnime, mostFavoritedAnime]);

  if (consolidatedCards.length === 0) return null;

  const cardCount = consolidatedCards.length;
  const gridLayoutClass =
    cardCount === 1
      ? "grid-cols-1 max-w-2xl mx-auto"
      : cardCount === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-3";

  return (
    <div className={`grid ${gridLayoutClass} gap-4.5 mb-9`}>
      {consolidatedCards.map((card, index) => {
        const primaryAward = card.awards[0];
        const borderClass = primaryAward?.borderClass || "border-t-anilytics-line";

        return (
          <ScrollReveal key={card.key} direction="up" delay={200 + index * 40} duration={500}>
            <div
              className={`group rounded-card-lg border border-anilytics-line border-t-2 ${borderClass} bg-gradient-to-br from-anilytics-panel-2 to-anilytics-panel relative overflow-hidden h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-highlight-hover flex flex-col justify-between`}
            >
              {/* Banner Header */}
              <div className="h-banner w-full relative overflow-hidden bg-anilytics-panel-2 border-b border-anilytics-line-soft shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getAnimeBannerImage(card.anime)}
                  alt={`${card.primaryTitle} banner`}
                  onError={(e) => {
                    if (e.currentTarget.src !== ANIME_PLACEHOLDER_BANNER) {
                      e.currentTarget.src = ANIME_PLACEHOLDER_BANNER;
                    }
                  }}
                  className="w-full h-full object-cover object-center opacity-78 scale-101 transition-all duration-700 ease-custom group-hover:scale-105 group-hover:opacity-92 group-hover:contrast-100 will-change-transform"
                />
                <span className="absolute left-4 bottom-3.25 z-5 font-mono text-3xs tracking-widest-sm uppercase text-anilytics-text-muted-64">
                  banner / preview
                </span>
              </div>

              {/* Unclipped Gradient Shadow Overlay */}
              <div className="absolute top-0 left-0 right-0 h-scrim bg-gradient-card-scrim pointer-events-none z-10" />

              {/* Content Body */}
              <div className="p-highlight-card flex flex-col justify-between flex-1 relative z-20">
                <div>
                  {/* Consolidated Awards Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {card.awards.map((award) => (
                      <div
                        key={award.id}
                        className={`inline-flex items-center gap-1.5 font-mono text-2xs tracking-wider-md uppercase px-2.5 py-1 rounded-md border ${award.badgeClass}`}
                      >
                        <span className="font-semibold">{award.title}</span>
                        <span className="opacity-60">•</span>
                        <span className="opacity-80">{award.subtitle}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className="font-display font-medium text-title text-anilytics-text-hi mb-1 line-clamp-1">
                    {card.primaryTitle}
                  </h3>
                  <p className="text-body-sm text-anilytics-text-low mb-2.5 line-clamp-1">
                    {card.secondaryTitle || "\u00A0"}
                  </p>

                  {/* Genre Badges */}
                  {card.anime.genres && card.anime.genres.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 mb-4">
                      {card.anime.genres.slice(0, 3).map((g) => (
                        <span
                          key={g}
                          className="px-1.5 py-0.5 rounded text-badge font-mono tracking-wide bg-purple-500/10 border border-purple-500/20 text-purple-300"
                        >
                          {g}
                        </span>
                      ))}
                      {card.anime.genres.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded text-3xs font-mono text-anilytics-text-low bg-anilytics-panel-2 border border-anilytics-line-soft">
                          +{card.anime.genres.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Meta Row with Score, Members, and Favourites */}
                <div className="flex items-center justify-between pt-4 border-t border-anilytics-line-soft mt-auto">
                  <div className="flex items-center gap-3.5 font-mono text-xs text-anilytics-text-mid">
                    {/* Score */}
                    <span className="flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="#d8c48a" stroke="none" className="w-3.125 h-3.125">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span style={{ color: getScoreStyle(card.anime.score) }}>
                        {card.anime.score}
                      </span>
                    </span>

                    {/* Members / Popularity */}
                    <span className="flex items-center gap-1 text-anilytics-metric-blue">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.125 h-3.125">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                      </svg>
                      <span className="text-anilytics-text-mid">{card.anime.popularity.toLocaleString("en-US")}</span>
                    </span>

                    {/* Favourites */}
                    {typeof card.anime.favourites === "number" && (
                      <span className="flex items-center gap-1 text-anilytics-metric-pink">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.125 h-3.125">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                        <span className="text-anilytics-text-mid">{card.anime.favourites.toLocaleString("en-US")}</span>
                      </span>
                    )}
                  </div>

                  <a
                    href={card.anime.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-medium text-body-sm text-anilytics-purple-300 group-hover:gap-2 transition-all"
                  >
                    <span>AniList</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                      <path d="M7 17 17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
});


