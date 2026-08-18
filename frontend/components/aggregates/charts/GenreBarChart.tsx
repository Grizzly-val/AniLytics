"use client";

import { memo, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Season, MediaFormat, GenreAggregatesResponse } from "@/lib/types";
import { HorizontalBarChart, ChartMetricConfig } from "@/components/charts";

export interface AggregateChartItem {
  name: string;
  count: number;
  average_score: number;
  popularity: number;
  trending: number;
}

interface GenreBarChartProps {
  data: GenreAggregatesResponse;
  metric?: "count" | "average_score" | "trending" | "popularity";
  onMetricChange?: (metric: "count" | "average_score" | "trending" | "popularity") => void;
  season?: Season;
  seasonYear?: number;
  format?: MediaFormat;
}

const AGGREGATE_METRICS: ChartMetricConfig[] = [
  {
    key: "count",
    label: "Anime Count",
    valueLabel: "Count",
    color: "#10b981",
    strokeColor: "#34d399",
    format: (v: number) => Math.round(v).toLocaleString("en-US"),
    avgFormat: (v: number) => Math.round(v).toLocaleString("en-US"),
  },
  {
    key: "average_score",
    label: "Average Score",
    valueLabel: "Score",
    color: "#9b5cf6",
    strokeColor: "#b285fb",
    format: (v: number) => v.toFixed(2),
    avgFormat: (v: number) => v.toFixed(2),
    domainMax: 100,
  },
  {
    key: "popularity",
    label: "Popularity",
    valueLabel: "Members",
    color: "#4d8fe8",
    strokeColor: "#4d8fe8",
    format: (v: number) => Math.round(v).toLocaleString("en-US"),
    avgFormat: (v: number) => Math.round(v).toLocaleString("en-US"),
  },
  {
    key: "trending",
    label: "Trending",
    valueLabel: "Trending",
    color: "#f06b3f",
    strokeColor: "#f06b3f",
    format: (v: number) => v.toFixed(1),
    avgFormat: (v: number) => v.toFixed(1),
  },
];

export default memo(function GenreBarChart({
  data,
  metric,
  onMetricChange,
  season,
  seasonYear,
  format,
}: GenreBarChartProps) {
  const router = useRouter();

  const handleBarClick = useCallback(
    (genreName: string) => {
      if (genreName) {
        const queryParams = new URLSearchParams();
        if (season) queryParams.set("season", season);
        if (seasonYear) queryParams.set("seasonYear", seasonYear.toString());
        if (format) queryParams.set("format", format);
        queryParams.set("fromBarClick", "true");

        const queryString = queryParams.toString();
        router.push(
          `/seasonal/genres/genre-animes/${encodeURIComponent(genreName)}?${queryString}`
        );
      }
    },
    [season, seasonYear, format, router]
  );

  const chartData = useMemo<AggregateChartItem[]>(() => {
    if (!data) return [];
    return Object.entries(data).map(([genre, stats]) => ({
      name: genre,
      count: stats.count ?? 0,
      average_score: stats.average_score ?? 0,
      popularity: stats.average_popularity ?? 0,
      trending: stats.average_trending ?? 0,
    }));
  }, [data]);

  return (
    <HorizontalBarChart<AggregateChartItem>
      data={chartData}
      metrics={AGGREGATE_METRICS}
      defaultMetricKey="count"
      activeMetricKey={metric}
      onMetricChange={(key) => onMetricChange?.(key as any)}
      nameKey="name"
      yAxisWidth={140}
      title={(metricConfig) => (
        <h3 className="font-display font-medium text-[17px] text-[var(--text-hi)]">
          Genre <span style={{ color: metricConfig.color }}>{metricConfig.label}</span> Overview
        </h3>
      )}
      subtitle={({ metricConfig, averageValue }) => (
        <>
          Comparing genre aggregates by {metricConfig.label.toLowerCase()} against the overall average of{" "}
          <span className="font-mono text-white font-medium">
            {metricConfig.avgFormat ? metricConfig.avgFormat(averageValue) : averageValue.toFixed(1)}
          </span>
          .{" "}
          <span className="text-[var(--purple-300)] font-medium">
            (Click any genre bar to view anime in this genre)
          </span>
        </>
      )}
      onBarClick={(_, genreName) => handleBarClick(genreName)}
    />
  );
});
