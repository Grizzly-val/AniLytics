"use client";

import { useState, useEffect, useMemo, use, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Season,
  AggregateStats,
  AnimeItem,
  FilterCategory,
} from "@/lib/types";
import {
  getPrimaryTitle,
  getSecondaryTitle,
  getAnimeDomId,
  getCurrentSeason,
  getCurrentYear,
} from "@/lib/utils";
import {
  SeasonalBreadcrumb,
  SeasonalBarClickHeader,
  SeasonalHeader,
  SeasonalUnsubmittedState,
  SeasonalLoadingState,
  SeasonalErrorState,
  SeasonalPromptState,
  SeasonalNoDataState,
  SeasonalKpiCards,
  SeasonalHighlights,
  SeasonalScoreChart,
  ScoreChartItem,
  AnimeListControls,
  SortByOption,
  SortOrderOption,
  ViewModeOption,
  AnimeGrid,
  ProcessedAnime,
  AnimeTable,
  SeasonalAggregatesDrawer,
} from "@/components/seasonal";
import { useSeasonalData } from "@/lib/hooks/useSeasonalData";

interface PageProps {
  params: Promise<{ filter?: string[] }>;
}

interface EnrichedAnime extends ProcessedAnime {
  searchHaystack: string;
}

export default function SeasonalPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const rawFilter = resolvedParams.filter?.[0];
  const decodedFilterFromPath = rawFilter ? decodeURIComponent(rawFilter) : "";

  const searchParams = useSearchParams();
  const isFromBarClick = searchParams.get("fromBarClick") === "true";

  const paramSeason = searchParams.get("season") as Season | null;
  const paramYear = searchParams.get("seasonYear")
    ? parseInt(searchParams.get("seasonYear")!, 10)
    : null;

  const isFromHomepage = !paramSeason && !paramYear && !isFromBarClick;

  // Header Season & Year inputs
  const [seasonInput, setSeasonInput] = useState<Season>(paramSeason || getCurrentSeason());
  const [seasonYearInput, setSeasonYearInput] = useState<number>(paramYear || getCurrentYear());

  // Active Submitted query params for API
  const [activeSeason, setActiveSeason] = useState<Season>(paramSeason || getCurrentSeason());
  const [activeYear, setActiveYear] = useState<number>(paramYear || getCurrentYear());

  const [isSubmitted, setIsSubmitted] = useState<boolean>(true);

  // Selected filter: Genre or Format (mutually exclusive)
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<string>("");

  const { data, error, loading } = useSeasonalData(
    activeSeason,
    activeYear,
    isSubmitted
  );

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortByOption>("score");
  const [sortOrder, setSortOrder] = useState<SortOrderOption>("desc");
  const [viewMode, setViewMode] = useState<ViewModeOption>("grid");

  const [highlightedTitle, setHighlightedTitle] = useState<string | null>(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Available options from fetched data
  const availableGenres = useMemo(() => {
    if (!data?.genres?.animes) return [];
    return Object.keys(data.genres.animes).sort();
  }, [data]);

  const availableFormats = useMemo(() => {
    if (!data?.formats?.animes) return [];
    return Object.keys(data.formats.animes).sort();
  }, [data]);

  // Sync decoded filter from route params
  useEffect(() => {
    if (!decodedFilterFromPath || (!availableGenres.length && !availableFormats.length)) return;

    if (availableGenres.includes(decodedFilterFromPath)) {
      setSelectedGenre(decodedFilterFromPath);
      setSelectedFormat("");
    } else if (availableFormats.includes(decodedFilterFromPath)) {
      setSelectedFormat(decodedFilterFromPath);
      setSelectedGenre("");
    }
  }, [decodedFilterFromPath, availableGenres, availableFormats]);

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

  const handleLoadData = useCallback(() => {
    setActiveSeason(seasonInput);
    setActiveYear(seasonYearInput);
    setIsSubmitted(true);
    setSelectedGenre("");
    setSelectedFormat("");
  }, [seasonInput, seasonYearInput]);

  const handleSelectGenre = useCallback((genre: string) => {
    setSelectedGenre(genre);
    setSelectedFormat("");
  }, []);

  const handleSelectFormat = useCallback((format: string) => {
    setSelectedFormat(format);
    setSelectedGenre("");
  }, []);

  const handleClearFilter = useCallback(() => {
    setSelectedGenre("");
    setSelectedFormat("");
  }, []);

  // Aggregates slide-over drawer state
  const [drawerType, setDrawerType] = useState<"genre" | "format" | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const aggregatesData = useMemo(() => {
    if (!data) return null;
    if (drawerType === "genre") return data.genres.aggregates;
    if (drawerType === "format") return data.formats.aggregates;
    return null;
  }, [data, drawerType]);

  const handleOpenGenresAggregates = useCallback(() => {
    setDrawerType("genre");
    setIsDrawerOpen(true);
  }, []);

  const handleOpenFormatsAggregates = useCallback(() => {
    setDrawerType("format");
    setIsDrawerOpen(true);
  }, []);

  const handleSelectDrawerCategory = useCallback(
    (name: string, category: "genre" | "format") => {
      if (category === "genre") {
        handleSelectGenre(name);
      } else if (category === "format") {
        handleSelectFormat(name);
      }
    },
    [handleSelectGenre, handleSelectFormat]
  );

  const isFilterUnchanged =
    isSubmitted &&
    seasonInput === activeSeason &&
    seasonYearInput === activeYear;

  const activeFilterCategory: FilterCategory | null = useMemo(() => {
    if (selectedGenre) return "genre";
    if (selectedFormat) return "format";
    return null;
  }, [selectedGenre, selectedFormat]);

  const activeItemName = selectedGenre || selectedFormat || "";

  // Error state calculation
  const apiError = useMemo(() => {
    if (error) return error;
    if (
      isSubmitted &&
      !loading &&
      data &&
      Object.keys(data.genres.animes).length === 0 &&
      Object.keys(data.formats.animes).length === 0
    ) {
      return `No anime entries found for ${activeSeason} ${activeYear}. Please try another season or year.`;
    }
    return null;
  }, [error, isSubmitted, loading, data, activeSeason, activeYear]);

  // Active Anime List based on selected filter
  const activeAnimes: AnimeItem[] = useMemo(() => {
    if (!data || !activeFilterCategory || !activeItemName) return [];

    if (activeFilterCategory === "genre") {
      if (data.genres.animes[activeItemName]) {
        return data.genres.animes[activeItemName];
      }
      const key = Object.keys(data.genres.animes).find(
        (k) => k.toLowerCase() === activeItemName.toLowerCase()
      );
      return key ? data.genres.animes[key] : [];
    }

    if (activeFilterCategory === "format") {
      if (data.formats.animes[activeItemName]) {
        return data.formats.animes[activeItemName];
      }
      const key = Object.keys(data.formats.animes).find(
        (k) => k.toLowerCase() === activeItemName.toLowerCase()
      );
      return key ? data.formats.animes[key] : [];
    }

    return [];
  }, [data, activeFilterCategory, activeItemName]);

  // Dynamic KPI Stats for active selection
  const activeStats: AggregateStats | null = useMemo(() => {
    if (!data || !activeFilterCategory || !activeItemName) return null;

    let backendStats: AggregateStats | undefined;
    if (activeFilterCategory === "genre") {
      backendStats = data.genres.aggregates[activeItemName];
    } else if (activeFilterCategory === "format") {
      backendStats = data.formats.aggregates[activeItemName];
    }

    if (backendStats) {
      return backendStats;
    }

    if (activeAnimes.length === 0) return null;
    const count = activeAnimes.length;
    const totalScore = activeAnimes.reduce((sum, a) => sum + (a.score || 0), 0);
    const totalPop = activeAnimes.reduce((sum, a) => sum + (a.popularity || 0), 0);
    const totalTrend = activeAnimes.reduce((sum, a) => sum + (a.trending || 0), 0);
    const totalFav = activeAnimes.reduce((sum, a) => sum + (a.favourites || 0), 0);
    return {
      count,
      average_score: totalScore / count,
      average_popularity: totalPop / count,
      average_trending: totalTrend / count,
      average_favourites: totalFav / count,
    };
  }, [data, activeFilterCategory, activeItemName, activeAnimes]);

  // Pre-process anime items
  const enrichedAnimes: EnrichedAnime[] = useMemo(() => {
    if (activeAnimes.length === 0) return [];

    return activeAnimes.map((anime) => {
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
  }, [activeAnimes]);

  // Highlights and chart data
  const { topScoredAnime, mostPopularAnime, mostFavoritedAnime, chartData } = useMemo(() => {
    if (enrichedAnimes.length === 0) {
      return { topScoredAnime: null, mostPopularAnime: null, mostFavoritedAnime: null, chartData: [] };
    }

    let topScoreItem: EnrichedAnime = enrichedAnimes[0];
    let mostPopularItem: EnrichedAnime = enrichedAnimes[0];
    let mostFavoritedItem: EnrichedAnime = enrichedAnimes[0];

    for (let i = 1; i < enrichedAnimes.length; i++) {
      const item = enrichedAnimes[i];
      if (item.anime.score > topScoreItem.anime.score) {
        topScoreItem = item;
      }
      if (item.anime.popularity > mostPopularItem.anime.popularity) {
        mostPopularItem = item;
      }
      if ((item.anime.favourites || 0) > (mostFavoritedItem.anime.favourites || 0)) {
        mostFavoritedItem = item;
      }
    }

    const chartItems: ScoreChartItem[] = [...enrichedAnimes]
      .sort((a, b) => b.anime.score - a.anime.score)
      .map((item) => ({
        name: item.primaryTitle,
        score: item.anime.score,
        popularity: item.anime.popularity,
        trending: item.anime.trending,
        favourites: item.anime.favourites || 0,
      }));

    return {
      topScoredAnime: topScoreItem,
      mostPopularAnime: mostPopularItem,
      mostFavoritedAnime: mostFavoritedItem,
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
      else if (sortBy === "favourites") comp = (a.anime.favourites || 0) - (b.anime.favourites || 0);
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
      <SeasonalBreadcrumb />

      {/* Header controls */}
      {isFromBarClick ? (
        <SeasonalBarClickHeader
          activeItemName={activeItemName}
          activeSeason={activeSeason}
          activeYear={activeYear}
          activeFilter={activeItemName}
        />
      ) : (
        <SeasonalHeader
          activeItemName={activeItemName}
          activeFilterCategory={activeFilterCategory}
          selectedGenre={selectedGenre}
          selectedFormat={selectedFormat}
          onSelectGenre={handleSelectGenre}
          onSelectFormat={handleSelectFormat}
          onClearFilter={handleClearFilter}
          availableGenres={availableGenres}
          availableFormats={availableFormats}
          season={seasonInput}
          seasonYear={seasonYearInput}
          onSeasonChange={handleSeasonChange}
          onYearChange={handleYearChange}
          onLoadData={handleLoadData}
          isLoading={loading}
          hasLoadedData={availableGenres.length > 0 || availableFormats.length > 0}
          isLoadDisabled={isFilterUnchanged}
          errorMessage={apiError}
          hideBackLink={isFromHomepage}
          onOpenGenresAggregates={handleOpenGenresAggregates}
          onOpenFormatsAggregates={handleOpenFormatsAggregates}
        />
      )}

      {/* Unsubmitted State */}
      {!isSubmitted && <SeasonalUnsubmittedState />}

      {/* Loading State */}
      {isSubmitted && loading && <SeasonalLoadingState />}

      {/* Error State */}
      {isSubmitted && apiError && !loading && (
        <SeasonalErrorState apiError={apiError} />
      )}

      {/* Main Content */}
      {isSubmitted && !loading && !apiError && (
        <>
          {!activeItemName ? (
            <SeasonalPromptState
              availableGenresCount={availableGenres.length}
              availableFormatsCount={availableFormats.length}
              activeSeason={activeSeason as Season}
              activeYear={activeYear as number}
            />
          ) : !activeStats ? (
            <SeasonalNoDataState
              activeItemName={activeItemName}
              activeSeason={activeSeason as Season}
              activeYear={activeYear as number}
            />
          ) : (
            <>
              {/* KPI Cards */}
              <SeasonalKpiCards
                stats={activeStats}
                season={activeSeason as Season}
                seasonYear={activeYear as number}
                activeFilter={activeItemName}
              />

              {/* Highlights */}
              <SeasonalHighlights
                topScoredAnime={topScoredAnime}
                mostPopularAnime={mostPopularAnime}
                mostFavoritedAnime={mostFavoritedAnime}
              />

              {/* Score Distribution Chart */}
              <SeasonalScoreChart
                decodedGenre={activeItemName}
                averageScore={activeStats.average_score}
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

      {/* Aggregates Drawer */}
      <SeasonalAggregatesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        type={drawerType}
        aggregatesData={aggregatesData}
        onSelectCategory={handleSelectDrawerCategory}
      />
    </div>
  );
}

