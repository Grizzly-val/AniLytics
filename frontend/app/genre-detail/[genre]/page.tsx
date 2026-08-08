"use client";

import { useState, useEffect, useMemo, use, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Season,
  MediaFormat,
  GenreDataResponse,
  GenreStats,
} from "@/lib/types";
import { getPrimaryTitle, getSecondaryTitle, getAnimeDomId } from "@/lib/utils";
import { GenreHeader } from "@/components/genre-detail/GenreHeader";
import { GenreKpiCards } from "@/components/genre-detail/GenreKpiCards";
import { GenreHighlights } from "@/components/genre-detail/GenreHighlights";
import {
  GenreScoreChart,
  ScoreChartItem,
} from "@/components/genre-detail/GenreScoreChart";
import {
  AnimeListControls,
  SortByOption,
  SortOrderOption,
  ViewModeOption,
} from "@/components/genre-detail/AnimeListControls";
import {
  AnimeGrid,
  ProcessedAnime,
} from "@/components/genre-detail/AnimeGrid";
import { AnimeTable } from "@/components/genre-detail/AnimeTable";
import { useGenreData } from "@/lib/hooks/useGenreData";

interface PageProps {
  params: Promise<{ genre: string }>;
}

interface EnrichedAnime extends ProcessedAnime {
  searchHaystack: string;
}

export default function GenreDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const rawGenre = resolvedParams.genre;
  const decodedGenre = decodeURIComponent(rawGenre);

  const searchParams = useSearchParams();

  const [season, setSeason] = useState<Season>(
    (searchParams.get("season") as Season) || "SUMMER"
  );
  const [seasonYear, setSeasonYear] = useState<number>(
    parseInt(searchParams.get("seasonYear") || "2025", 10) || 2025
  );
  const [format, setFormat] = useState<MediaFormat>(
    (searchParams.get("format") as MediaFormat) || "TV"
  );

  const { data, error, loading } = useGenreData(season, seasonYear, format);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortByOption>("score");
  const [sortOrder, setSortOrder] = useState<SortOrderOption>("desc");
  const [viewMode, setViewMode] = useState<ViewModeOption>("grid");

  const [highlightedTitle, setHighlightedTitle] = useState<string | null>(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

  // Find exact or case-insensitive genre match
  const genreStats: GenreStats | null = useMemo(() => {
    if (!data) return null;
    if (data[decodedGenre]) return data[decodedGenre];
    const key = Object.keys(data).find(
      (k) => k.toLowerCase() === decodedGenre.toLowerCase()
    );
    return key ? data[key] : null;
  }, [data, decodedGenre]);

  // Pre-process anime items to index titles and search haystack once
  const enrichedAnimes: EnrichedAnime[] = useMemo(() => {
    if (!genreStats || !genreStats.animes) return [];

    return genreStats.animes.map((anime) => {
      const primaryTitle = getPrimaryTitle(anime.title);
      const secondaryTitle = getSecondaryTitle(anime.title);
      const eng = anime.title?.english?.toLowerCase() || "";
      const rom = anime.title?.romaji?.toLowerCase() || "";
      const nat = anime.title?.native?.toLowerCase() || "";
      const searchHaystack = `${eng} ${rom} ${nat}`;

      return {
        anime,
        primaryTitle,
        secondaryTitle,
        searchHaystack,
      };
    });
  }, [genreStats]);

  // Extract highlights and chart data in O(N) single pass instead of multiple array sorts
  const { topScoredAnime, mostPopularAnime, chartData } = useMemo(() => {
    if (enrichedAnimes.length === 0) {
      return { topScoredAnime: null, mostPopularAnime: null, chartData: [] };
    }

    let topScoreItem: EnrichedAnime = enrichedAnimes[0];
    let mostPopularItem: EnrichedAnime = enrichedAnimes[0];

    for (let i = 1; i < enrichedAnimes.length; i++) {
      const item = enrichedAnimes[i];
      if (item.anime.score > topScoreItem.anime.score) {
        topScoreItem = item;
      }
      if (item.anime.popularity > mostPopularItem.anime.popularity) {
        mostPopularItem = item;
      }
    }

    const chartItems: ScoreChartItem[] = [...enrichedAnimes]
      .sort((a, b) => b.anime.score - a.anime.score)
      .map((item) => ({
        name: item.primaryTitle,
        score: item.anime.score,
        popularity: item.anime.popularity,
        trending: item.anime.trending,
      }));

    return {
      topScoredAnime: topScoreItem,
      mostPopularAnime: mostPopularItem,
      chartData: chartItems,
    };
  }, [enrichedAnimes]);

  // Filter & sort anime list efficiently using pre-indexed fields
  const processedAnimes = useMemo(() => {
    if (enrichedAnimes.length === 0) return [];
    let list = enrichedAnimes;

    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery) {
      list = list.filter((item) => item.searchHaystack.includes(trimmedQuery));
    }

    const sortedList = [...list].sort((a, b) => {
      let comp = 0;
      if (sortBy === "score") comp = a.anime.score - b.anime.score;
      else if (sortBy === "popularity") comp = a.anime.popularity - b.anime.popularity;
      else if (sortBy === "trending") comp = a.anime.trending - b.anime.trending;
      else if (sortBy === "title") {
        comp = a.primaryTitle.localeCompare(b.primaryTitle);
      }
      return sortOrder === "desc" ? -comp : comp;
    });

    return sortedList;
  }, [enrichedAnimes, searchQuery, sortBy, sortOrder]);

  const handleToggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const handleBarClick = useCallback((titleName: string) => {
    // Clear search filter so the clicked title is visible if previously filtered out
    setSearchQuery("");
    setHighlightedTitle(titleName);

    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
    }

    // Smooth scroll to the target DOM element
    requestAnimationFrame(() => {
      const domId = getAnimeDomId(titleName);
      const targetElement = document.getElementById(domId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    // Reset highlight after 3 seconds
    highlightTimerRef.current = setTimeout(() => {
      setHighlightedTitle(null);
    }, 3000);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Filter Controls */}
      <GenreHeader
        decodedGenre={decodedGenre}
        season={season}
        seasonYear={seasonYear}
        format={format}
        onSeasonChange={setSeason}
        onYearChange={setSeasonYear}
        onFormatChange={setFormat}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-neutral-400 text-sm animate-pulse">
            Fetching {decodedGenre} analytics...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-6 text-red-400 space-y-2">
          <h3 className="font-semibold text-lg">Error loading genre details</h3>
          <p className="text-sm text-red-300/80">{error}</p>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          {!genreStats ? (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-12 text-center space-y-4">
              <div className="text-4xl">📊</div>
              <h3 className="text-xl font-semibold text-white">
                No data for &quot;{decodedGenre}&quot;
              </h3>
              <p className="text-neutral-400 text-sm max-w-md mx-auto">
                No anime matching the genre &quot;{decodedGenre}&quot; were found in the selected {season} {seasonYear} ({format}) dataset. Try adjusting the season or format filters above.
              </p>
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <GenreKpiCards
                stats={genreStats}
                season={season}
                seasonYear={seasonYear}
                format={format}
              />

              {/* Highlights */}
              <GenreHighlights
                topScoredAnime={topScoredAnime}
                mostPopularAnime={mostPopularAnime}
              />

              {/* Score Distribution Chart with Click-to-Jump */}
              <GenreScoreChart
                decodedGenre={decodedGenre}
                averageScore={genreStats.average_score}
                chartData={chartData}
                onBarClick={handleBarClick}
              />

              {/* Anime List Controls & Views */}
              <div className="space-y-4">
                <AnimeListControls
                  searchQuery={searchQuery}
                  onSearchQueryChange={setSearchQuery}
                  sortBy={sortBy}
                  onSortByChange={setSortBy}
                  sortOrder={sortOrder}
                  onToggleSortOrder={handleToggleSortOrder}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />

                {viewMode === "grid" && (
                  <AnimeGrid
                    items={processedAnimes}
                    highlightedTitle={highlightedTitle}
                  />
                )}
                {viewMode === "table" && (
                  <AnimeTable
                    items={processedAnimes}
                    highlightedTitle={highlightedTitle}
                  />
                )}

                {processedAnimes.length === 0 && searchQuery && (
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 text-center text-neutral-400">
                    No anime found matching &quot;{searchQuery}&quot;.
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
