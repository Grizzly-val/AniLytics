"use client";

import { memo } from "react";
import { GenreAggregateStats, Season, MediaFormat } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

interface GenreKpiCardsProps {
  stats: GenreAggregateStats;
  season: Season;
  seasonYear: number;
  format: MediaFormat;
}

export const GenreKpiCards = memo(function GenreKpiCards({
  stats,
  season,
  seasonYear,
  format,
}: GenreKpiCardsProps) {
  const cards = [
    {
      title: "Total Anime",
      value: stats.count,
      sub: `In ${season} ${seasonYear} (${format})`,
      icon: "🎬",
      color: "purple",
    },
    {
      title: "Avg Score",
      value: stats.average_score.toFixed(2),
      barScore: stats.average_score,
      icon: "⭐",
      color: "emerald",
    },
    {
      title: "Avg Popularity",
      value: Math.round(stats.average_popularity).toLocaleString(),
      sub: "Total viewers count",
      icon: "👥",
      color: "cyan",
    },
    {
      title: "Avg Trending",
      value: stats.average_trending.toFixed(2),
      sub: "Activity index",
      icon: "amber",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <ScrollReveal
          key={card.title}
          direction="up"
          delay={idx * 100}
          duration={500}
        >
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-5 backdrop-blur-sm shadow-md flex items-center justify-between h-full">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {card.title}
              </p>
              <p
                className={`text-2xl sm:text-3xl font-extrabold mt-1 ${
                  card.color === "emerald"
                    ? "text-emerald-400"
                    : card.color === "cyan"
                    ? "text-cyan-400"
                    : card.color === "amber"
                    ? "text-amber-400"
                    : "text-purple-300"
                }`}
              >
                {card.value}
              </p>

              {card.barScore !== undefined ? (
                <div className="w-24 bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, card.barScore)}%` }}
                  />
                </div>
              ) : (
                <p className="text-[11px] text-neutral-500 mt-1">{card.sub}</p>
              )}
            </div>
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold border ${
                card.color === "emerald"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : card.color === "cyan"
                  ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                  : card.color === "amber"
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  : "bg-purple-500/10 border-purple-500/20 text-purple-300"
              }`}
            >
              {card.icon === "amber" ? "🔥" : card.icon}
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
});
