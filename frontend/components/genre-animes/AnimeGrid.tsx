"use client";

import { memo } from "react";
import { AnimeItem } from "@/lib/types";
import { AnimeCard } from "./AnimeCard";

export interface ProcessedAnime {
  anime: AnimeItem;
  primaryTitle: string;
  secondaryTitle: string | null;
}

interface AnimeGridProps {
  items: ProcessedAnime[];
  highlightedTitle?: string | null;
}

export const AnimeGrid = memo(function AnimeGrid({
  items,
  highlightedTitle,
}: AnimeGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <AnimeCard
          key={item.anime.siteUrl || index}
          anime={item.anime}
          primaryTitle={item.primaryTitle}
          secondaryTitle={item.secondaryTitle}
          isHighlighted={highlightedTitle === item.primaryTitle}
        />
      ))}
    </div>
  );
});
