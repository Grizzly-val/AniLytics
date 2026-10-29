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
      className={`group bg-gradient-to-br from-anilytics-panel-2 to-anilytics-panel border rounded-card-lg overflow-hidden relative transition-all duration-300 flex flex-col justify-between ${
        isHighlighted
          ? "border-anilytics-purple-400 shadow-focus-ring scale-101"
          : "border-anilytics-line hover:border-anilytics-purple-light-35 hover:-translate-y-0.5 hover:shadow-card-hover"
      }`}
    >
      {/* Media Banner Header - Image strictly clipped at 86px (h-banner-sm) */}
      <div className="h-banner-sm w-full relative overflow-hidden bg-anilytics-panel-2 border-b border-anilytics-line-soft shrink-0">
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
          className="w-full h-full object-cover object-center opacity-68 scale-101 transition-all duration-600 ease-custom group-hover:scale-105 group-hover:opacity-86 group-hover:contrast-100 will-change-transform"
        />
        <span className="absolute left-3.5 bottom-2.5 z-5 font-mono text-micro tracking-widest-md uppercase text-anilytics-text-muted-52">
          anime / banner
        </span>
      </div>

      {/* Unclipped Gradient Shadow Overlay */}
      <div className="absolute top-0 left-0 right-0 h-scrim-sm bg-gradient-card-scrim-sm pointer-events-none z-10" />

      {/* Card Content Body */}
      <div className="px-5 pt-4 pb-4.5 flex flex-col justify-between flex-1 relative z-20">
        <div>
          {/* Title & Score */}
          <div className="flex items-start justify-between gap-2.5 mb-1.25">
            <h4 className="font-display font-medium text-body-base leading-tight-sm text-anilytics-text-hi line-clamp-2">
              {primaryTitle}
            </h4>
            <div className="flex items-center gap-1 font-mono text-xs shrink-0 pt-0.5" style={{ color: scoreColor }}>
              <svg viewBox="0 0 24 24" fill="#d8c48a" stroke="none" className="w-2.75 h-2.75">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{anime.score}</span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-caption text-anilytics-text-low leading-snug-sm mb-2 line-clamp-1">
            {secondaryTitle || "\u00A0"}
          </p>

          {/* Genre Badges */}
          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mb-3.5">
              {anime.genres.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="px-1.5 py-0.5 rounded text-badge font-mono tracking-wide bg-purple-500/10 border border-purple-500/20 text-purple-300"
                >
                  {g}
                </span>
              ))}
              {anime.genres.length > 3 && (
                <span className="px-1.5 py-0.5 rounded text-3xs font-mono text-anilytics-text-low bg-anilytics-panel-2 border border-anilytics-line-soft">
                  +{anime.genres.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Meta Footer Row */}
        <div className="pt-2.5 border-t border-anilytics-line-soft flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3 font-mono text-label text-anilytics-text-mid">
            <span className="flex items-center gap-1 text-anilytics-metric-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <span className="text-anilytics-text-mid">{anime.popularity.toLocaleString("en-US")}</span>
            </span>
            <span className="flex items-center gap-1 text-anilytics-metric-peach">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
              <span className="text-anilytics-text-mid">{anime.trending}</span>
            </span>
            {typeof anime.favourites === "number" && (
              <span className="flex items-center gap-1 text-anilytics-metric-pink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span className="text-anilytics-text-mid">{anime.favourites}</span>
              </span>
            )}
          </div>

          <a
            href={anime.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-medium text-caption text-anilytics-purple-300 group-hover:gap-1.75 transition-all"
          >
            <span>AniList</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.75 h-2.75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
});
