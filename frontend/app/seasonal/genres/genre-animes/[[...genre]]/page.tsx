"use client";

import { useState, useEffect, useMemo, use, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Season,
  MediaFormat,
  GenreAggregateStats,
  AnimeItem,
} from "@/lib/types";
import {
  getPrimaryTitle,
  getSecondaryTitle,
  getAnimeDomId,
  getCurrentSeason,
  getCurrentYear,
  DEFAULT_FORMAT,
} from "@/lib/utils";
import {
  GenreAnimesBreadcrumb,
  GenreBarClickHeader,
  GenreHeader,
  GenreAnimesUnsubmittedState,
  GenreAnimesLoadingState,
  GenreAnimesErrorState,
  GenrePromptState,
  GenreNoDataState,
  GenreKpiCards,
  GenreHighlights,
  GenreScoreChart,
  ScoreChartItem,
  AnimeListControls,
  SortByOption,
  SortOrderOption,
  ViewModeOption,
  AnimeGrid,
  ProcessedAnime,
  AnimeTable,
} from "@/components/genre-animes";
import { useGenreAnimes } from "@/lib/hooks/useGenreData";

interface PageProps {
  params: Promise<{ genre?: string[] }>;
}

interface EnrichedAnime extends ProcessedAnime {
  searchHaystack: string;
}

export default function GenreAnimesPage({ params }: PageProps) {
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

  const { data, error, loading } = useGenreAnimes(
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

  // Available genres from backend animes data
  const availableGenres = useMemo(() => {
    if (!data) return [];
    return Object.keys(data).sort();
  }, [data]);

  // Sync selectedGenre only when decodedGenreFromPath actually changes via route navigation
  const prevDecodedGenreRef = useRef(decodedGenreFromPath);
  useEffect(() => {
    if (decodedGenreFromPath !== prevDecodedGenreRef.current) {
      prevDecodedGenreRef.current = decodedGenreFromPath;
      if (decodedGenreFromPath) {
        setSelectedGenre(decodedGenreFromPath);
      }
    }
  }, [decodedGenreFromPath]);

  const activeGenreName = selectedGenre;

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
  }, []);

  const handleYearChange = useCallback((year: number) => {
    setSeasonYearInput(year);
  }, []);

  const handleFormatChange = useCallback((format: MediaFormat) => {
    setFormatInput(format);
  }, []);

  const handleLoadGenres = useCallback(() => {
    setActiveSeason(seasonInput);
    setActiveYear(seasonYearInput);
    setActiveFormat(formatInput);
    setIsSubmitted(true);
    setHasLoadedGenres(true);
    setSelectedGenre("");
  }, [seasonInput, seasonYearInput, formatInput]);

  const isFilterUnchanged =
    isSubmitted &&
    seasonInput === activeSeason &&
    seasonYearInput === activeYear &&
    formatInput === activeFormat;

  // Computed error state (API error or empty backend result)
  const apiError = useMemo(() => {
    if (error) return error;
    if (isSubmitted && !loading && data && Object.keys(data).length === 0) {
      return `No anime or genre data found for ${activeSeason} ${activeYear} (${activeFormat}). Please try another filter.`;
    }
    return null;
  }, [error, isSubmitted, loading, data, activeSeason, activeYear, activeFormat]);

  // Get anime items list for selected genre
  const genreAnimes: AnimeItem[] = useMemo(() => {
    if (!data || !activeGenreName) return [];
    if (data[activeGenreName]) return data[activeGenreName];
    const key = Object.keys(data).find(
      (k) => k.toLowerCase() === activeGenreName.toLowerCase()
    );
    return key ? data[key] : [];
  }, [data, activeGenreName]);

  // Dynamically aggregate stats for selected genre
  const genreStats: GenreAggregateStats | null = useMemo(() => {
    if (genreAnimes.length === 0) return null;
    const count = genreAnimes.length;
    const totalScore = genreAnimes.reduce((sum, a) => sum + (a.score || 0), 0);
    const totalPop = genreAnimes.reduce((sum, a) => sum + (a.popularity || 0), 0);
    const totalTrend = genreAnimes.reduce((sum, a) => sum + (a.trending || 0), 0);
    return {
      count,
      average_score: totalScore / count,
      average_popularity: totalPop / count,
      average_trending: totalTrend / count,
    };
  }, [genreAnimes]);

  // Pre-process anime items
  const enrichedAnimes: EnrichedAnime[] = useMemo(() => {
    if (genreAnimes.length === 0) return [];

    return genreAnimes.map((anime) => {
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
  }, [genreAnimes]);

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

  const handleSortByChange = useCallback((newSortBy: SortByOption) => {
    setSortBy(newSortBy);
    if (newSortBy === "title") {
      setSortOrder("asc");
    } else {
      setSortOrder("desc");
    }
  }, []);

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
    <div className="max-w-[1180px] mx-auto px-6 sm:px-12 pt-6 pb-24 space-y-7">
      <GenreAnimesBreadcrumb />

      {/* Header controls or simple header */}
      {isFromBarClick ? (
        <GenreBarClickHeader
          activeGenreName={activeGenreName}
          activeSeason={activeSeason}
          activeYear={activeYear}
          activeFormat={activeFormat}
        />
      ) : (
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
          isLoadDisabled={isFilterUnchanged}
          errorMessage={apiError}
          hideBackLink={isFromHomepage}
        />
      )}

      {/* Unsubmitted / Pending State */}
      {!isSubmitted && <GenreAnimesUnsubmittedState />}

      {/* Loading State */}
      {isSubmitted && loading && <GenreAnimesLoadingState />}

      {/* Error State */}
      {isSubmitted && apiError && !loading && (
        <GenreAnimesErrorState apiError={apiError} />
      )}

      {/* Main Content */}
      {isSubmitted && !loading && !apiError && (
        <>
          {!selectedGenre ? (
            <GenrePromptState
              availableGenresCount={availableGenres.length}
              activeSeason={activeSeason as Season}
              activeYear={activeYear as number}
              activeFormat={activeFormat as MediaFormat}
            />
          ) : !genreStats ? (
            <GenreNoDataState
              activeGenreName={activeGenreName}
              activeSeason={activeSeason as Season}
              activeYear={activeYear as number}
              activeFormat={activeFormat as MediaFormat}
            />
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
                  onSortByChange={handleSortByChange}
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
