"use client";

import { useState, useEffect, useMemo, use, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Season,
  MediaFormat,
  GenreStats,
} from "@/lib/types";
import { getPrimaryTitle, getSecondaryTitle, getAnimeDomId, getCurrentSeason, getCurrentYear, DEFAULT_FORMAT } from "@/lib/utils";
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
  params: Promise<{ genre?: string[] }>;
}

interface EnrichedAnime extends ProcessedAnime {
  searchHaystack: string;
}

export default function GenreDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const rawGenre = resolvedParams.genre?.[0];
  const decodedGenreFromPath = rawGenre ? decodeURIComponent(rawGenre) : "";

  const searchParams = useSearchParams();
  const isFromBarClick = searchParams.get("fromBarClick") === "true";

  const paramSeason = searchParams.get("season") as Season | null;
  const paramYear = searchParams.get("seasonYear")
    ? parseInt(searchParams.get("seasonYear")!, 10)
    : null;
  const paramFormat = searchParams.get("format") as MediaFormat | null;

  const isFromHomepage = !paramSeason && !paramYear && !paramFormat && !isFromBarClick;

  // Initial filter input state
  const [seasonInput, setSeasonInput] = useState<Season>(paramSeason || getCurrentSeason());
  const [seasonYearInput, setSeasonYearInput] = useState<number>(paramYear || getCurrentYear());
  const [formatInput, setFormatInput] = useState<MediaFormat>(paramFormat || DEFAULT_FORMAT);

  // Active submitted state for API request
  const [activeSeason, setActiveSeason] = useState<Season>(paramSeason || getCurrentSeason());
  const [activeYear, setActiveYear] = useState<number>(paramYear || getCurrentYear());
  const [activeFormat, setActiveFormat] = useState<MediaFormat>(paramFormat || DEFAULT_FORMAT);

  const initialHasLoaded = Boolean(
    isFromBarClick || (paramSeason && paramYear && paramFormat)
  );

  const [isSubmitted, setIsSubmitted] = useState<boolean>(initialHasLoaded);
  const [hasLoadedGenres, setHasLoadedGenres] = useState<boolean>(initialHasLoaded);

  const [selectedGenre, setSelectedGenre] = useState<string>(
    decodedGenreFromPath
  );

  const { data, error, loading } = useGenreData(
    activeSeason,
    activeYear,
    activeFormat,
    isSubmitted
  );

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortByOption>("score");
  const [sortOrder, setSortOrder] = useState<SortOrderOption>("desc");
  const [viewMode, setViewMode] = useState<ViewModeOption>("grid");

  const [highlightedTitle, setHighlightedTitle] = useState<string | null>(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Available genres from data
  const availableGenres = useMemo(() => {
    if (!data) return [];
    return Object.keys(data).sort();
  }, [data]);

  // Keep selectedGenre in sync if missing or changed
  useEffect(() => {
    if (decodedGenreFromPath) {
      setSelectedGenre(decodedGenreFromPath);
    } else if (!selectedGenre && availableGenres.length > 0) {
      setSelectedGenre(availableGenres[0]);
    }
  }, [decodedGenreFromPath, availableGenres, selectedGenre]);

  const activeGenreName = decodedGenreFromPath || selectedGenre;

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

  const handleSeasonChange = useCallback((season: Season) => {
    setSeasonInput(season);
    setHasLoadedGenres(false);
  }, []);

  const handleYearChange = useCallback((year: number) => {
    setSeasonYearInput(year);
    setHasLoadedGenres(false);
  }, []);

  const handleFormatChange = useCallback((format: MediaFormat) => {
    setFormatInput(format);
    setHasLoadedGenres(false);
  }, []);

  const handleLoadGenres = useCallback(() => {
    setActiveSeason(seasonInput);
    setActiveYear(seasonYearInput);
    setActiveFormat(formatInput);
    setIsSubmitted(true);
    setHasLoadedGenres(true);
  }, [seasonInput, seasonYearInput, formatInput]);

  // Computed error state (API error or empty backend result)
  const apiError = useMemo(() => {
    if (error) return error;
    if (isSubmitted && !loading && data && Object.keys(data).length === 0) {
      return `No anime or genre data found for ${activeSeason} ${activeYear} (${activeFormat}). Please try another filter.`;
    }
    return null;
  }, [error, isSubmitted, loading, data, activeSeason, activeYear, activeFormat]);

  // Find exact or case-insensitive genre match
  const genreStats: GenreStats | null = useMemo(() => {
    if (!data || !activeGenreName) return null;
    if (data[activeGenreName]) return data[activeGenreName];
    const key = Object.keys(data).find(
      (k) => k.toLowerCase() === activeGenreName.toLowerCase()
    );
    return key ? data[key] : null;
  }, [data, activeGenreName]);

  // Pre-process anime items
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

  // Highlights and chart data
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

  // Filter & sort anime list
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
    setSearchQuery("");
    setHighlightedTitle(titleName);

    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
    }

    requestAnimationFrame(() => {
      const domId = getAnimeDomId(titleName);
      const targetElement = document.getElementById(domId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    highlightTimerRef.current = setTimeout(() => {
      setHighlightedTitle(null);
    }, 3000);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* If accessed through a bar click: NO GenreHeader controls, only back link & title badge */}
      {isFromBarClick ? (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <Link
              href="/genre-data"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition mb-2"
              id="back-to-genre-data-link"
            >
              &larr; Back to Genre Overview
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {activeGenreName || "Genre Detail"}
                </span>
              </h1>
              {activeSeason && activeYear && activeFormat && (
                <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-neutral-300 border border-neutral-700">
                  {activeSeason} {activeYear} • {activeFormat}
                </span>
              )}
            </div>
            <p className="text-neutral-400 text-sm mt-1">
              Detailed breakdown and performance analytics for {activeGenreName || "the selected"} anime genre.
            </p>
          </div>
        </div>
      ) : (
        /* Direct access: GenreHeader is available to configure Season, Year, Format & Load Genres */
        <GenreHeader
          decodedGenre={decodedGenreFromPath}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          availableGenres={availableGenres}
          season={seasonInput}
          seasonYear={seasonYearInput}
          format={formatInput}
          onSeasonChange={handleSeasonChange}
          onYearChange={handleYearChange}
          onFormatChange={handleFormatChange}
          onLoadGenres={handleLoadGenres}
          isLoadingGenres={loading}
          hasLoadedGenres={hasLoadedGenres && availableGenres.length > 0}
          errorMessage={apiError}
          hideBackLink={isFromHomepage}
        />
      )}

      {/* Unsubmitted / Pending State */}
      {!isSubmitted && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-12 text-center space-y-3">
          <div className="text-4xl">📊</div>
          <h3 className="text-lg font-semibold text-white">
            Load Genres to View Analytics
          </h3>
          <p className="text-neutral-400 text-sm max-w-md mx-auto">
            Please configure Season, Year, and Format above, then click &quot;Load Genres&quot; to fetch available genres and view detailed analytics.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isSubmitted && loading && (
        <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-neutral-400 text-sm animate-pulse">
            Fetching {activeGenreName || "genre"} analytics...
          </p>
        </div>
      )}

      {/* Error State */}
      {isSubmitted && apiError && !loading && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-6 text-red-400 space-y-2">
          <h3 className="font-semibold text-lg">Error loading genre details</h3>
          <p className="text-sm text-red-300/80">{apiError}</p>
        </div>
      )}

      {/* Main Content */}
      {isSubmitted && !loading && !apiError && (
        <>
          {!genreStats ? (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-12 text-center space-y-4">
              <div className="text-4xl">📊</div>
              <h3 className="text-xl font-semibold text-white">
                No data for &quot;{activeGenreName || "selected genre"}&quot;
              </h3>
              <p className="text-neutral-400 text-sm max-w-md mx-auto">
                No anime matching the genre &quot;{activeGenreName}&quot; were found in the selected {activeSeason} {activeYear} ({activeFormat}) dataset. Try adjusting your filters and clicking Load Genres.
              </p>
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <GenreKpiCards
                stats={genreStats}
                season={activeSeason as Season}
                seasonYear={activeYear as number}
                format={activeFormat as MediaFormat}
              />

              {/* Highlights */}
              <GenreHighlights
                topScoredAnime={topScoredAnime}
                mostPopularAnime={mostPopularAnime}
              />

              {/* Score Distribution Chart with Click-to-Jump */}
              <GenreScoreChart
                decodedGenre={activeGenreName}
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
