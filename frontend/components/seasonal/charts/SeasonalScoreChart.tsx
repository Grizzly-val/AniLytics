"use client";

import { memo } from "react";
import { HorizontalBarChart, ChartMetricConfig } from "@/components/charts";

export interface ScoreChartItem {
  name: string;
  score: number;
  popularity: number;
  trending: number;
  favourites: number;
}

export interface SeasonalScoreChartProps {
  decodedGenre?: string;
  activeTitle?: string;
  averageScore?: number;
  chartData: ScoreChartItem[];
  onBarClick?: (titleName: string) => void;
}

const SEASONAL_SCORE_METRICS: ChartMetricConfig[] = [
  {
    key: "score",
    label: "Score",
    valueLabel: "Score",
    color: "#9b5cf6",
    strokeColor: "#b285fb",
    format: (v: number) => v.toFixed(0),
    avgFormat: (v: number) => v.toFixed(1),
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
    format: (v: number) => v.toFixed(0),
    avgFormat: (v: number) => v.toFixed(1),
  },
  {
    key: "favourites",
    label: "Favourites",
    valueLabel: "Favourites",
    color: "#e11d48",
    strokeColor: "#f43f5e",
    format: (v: number) => Math.round(v).toLocaleString("en-US"),
    avgFormat: (v: number) => Math.round(v).toLocaleString("en-US"),
  },
];

export const SeasonalScoreChart = memo(function SeasonalScoreChart({
  chartData,
  onBarClick,
}: SeasonalScoreChartProps) {
  if (!chartData || chartData.length === 0) return null;

  return (
    <HorizontalBarChart<ScoreChartItem>
      data={chartData}
      metrics={SEASONAL_SCORE_METRICS}
      defaultMetricKey="score"
      nameKey="name"
      yAxisWidth={180}
      title={(metricConfig) => (
        <h3 className="font-display font-medium text-[17px] text-[var(--text-hi)]">
          Anime <span style={{ color: metricConfig.color }}>{metricConfig.label}</span> Distribution
        </h3>
      )}
      subtitle={({ metricConfig, averageValue }) => (
        <>
          Comparing individual titles by {metricConfig.label.toLowerCase()} against the category average of{" "}
          <span className="font-mono text-white font-medium">
            {metricConfig.avgFormat ? metricConfig.avgFormat(averageValue) : averageValue.toFixed(1)}
          </span>
          .{" "}
          <span className="text-[var(--purple-300)] font-medium">
            (Click any bar to jump to its card below)
          </span>
        </>
      )}
      onBarClick={(_, name) => {
        if (onBarClick) {
          onBarClick(name);
        }
      }}
    />
  );
});

export const GenreScoreChart = SeasonalScoreChart;

