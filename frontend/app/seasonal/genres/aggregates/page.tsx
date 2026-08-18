"use client";

import { useState } from "react";
import { Season, MediaFormat } from "@/lib/types";
import { useGenreAggregates } from "@/lib/hooks/useGenreData";
import { getCurrentSeason, getCurrentYear, DEFAULT_FORMAT } from "@/lib/utils";
import {
  AggregatesHeader,
  AggregatesFilterForm,
  AggregatesEmptyState,
  AggregatesLoadingState,
  AggregatesErrorState,
  GenreBarChart,
} from "@/components/aggregates";

export default function GenreAggregatesPage() {
  // Input control states (default to current season, year, and TV format)
  const [seasonInput, setSeasonInput] = useState<Season>(getCurrentSeason());
  const [seasonYearInput, setSeasonYearInput] = useState<number>(getCurrentYear());
  const [formatInput, setFormatInput] = useState<MediaFormat>(DEFAULT_FORMAT);

  // Submitted filter state (used for API call)
  const [activeSeason, setActiveSeason] = useState<Season>(getCurrentSeason());
  const [activeYear, setActiveYear] = useState<number>(getCurrentYear());
  const [activeFormat, setActiveFormat] = useState<MediaFormat>(DEFAULT_FORMAT);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seasonInput && seasonYearInput > 0 && formatInput) {
      setActiveSeason(seasonInput);
      setActiveYear(seasonYearInput);
      setActiveFormat(formatInput);
      setIsSubmitted(true);
    }
  };

  const { data, error, loading } = useGenreAggregates(
    activeSeason,
    activeYear,
    activeFormat,
    isSubmitted
  );

  const canSubmit = Boolean(seasonInput && seasonYearInput > 0 && formatInput);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <AggregatesHeader />

      <AggregatesFilterForm
        seasonInput={seasonInput}
        seasonYearInput={seasonYearInput}
        formatInput={formatInput}
        onSeasonChange={setSeasonInput}
        onYearChange={setSeasonYearInput}
        onFormatChange={setFormatInput}
        onSubmit={handleSubmit}
        canSubmit={canSubmit}
      />

      {!isSubmitted && <AggregatesEmptyState />}

      {isSubmitted && loading && <AggregatesLoadingState />}

      {isSubmitted && error && !loading && <AggregatesErrorState error={error} />}

      {isSubmitted && !loading && !error && data && (
        <GenreBarChart
          data={data}
          season={activeSeason as Season}
          seasonYear={activeYear as number}
          format={activeFormat as MediaFormat}
        />
      )}
    </div>
  );
}
