"use client";

import { memo, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Season, MediaFormat, GenreAggregatesResponse } from "@/lib/types";

interface GenreBarChartProps {
  data: GenreAggregatesResponse;
  metric: "count" | "average_score" | "trending" | "popularity";
  onMetricChange?: (metric: "count" | "average_score" | "trending" | "popularity") => void;
  season?: Season;
  seasonYear?: number;
  format?: MediaFormat;
}

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
    (entry: any) => {
      if (entry && entry.genre) {
        const queryParams = new URLSearchParams();
        if (season) queryParams.set("season", season);
        if (seasonYear) queryParams.set("seasonYear", seasonYear.toString());
        if (format) queryParams.set("format", format);
        queryParams.set("fromBarClick", "true");

        const queryString = queryParams.toString();
        router.push(
          `/seasonal/genres/genre-animes/${encodeURIComponent(entry.genre)}?${queryString}`
        );
      }
    },
    [season, seasonYear, format, router]
  );

  const metricConfig = useMemo(() => {
    switch (metric) {
      case "count":
        return {
          label: "Anime Count",
          color: "#10b981", // Emerald
          domain: [0, "auto"] as const,
          format: (v: number) => Math.round(v).toString(),
        };
      case "trending":
        return {
          label: "Average Trending",
          color: "#f59e0b", // Amber
          domain: [0, "auto"] as const,
          format: (v: number) => Math.round(v).toLocaleString(),
        };
      case "popularity":
        return {
          label: "Average Popularity",
          color: "#ec4899", // Pink
          domain: [0, "auto"] as const,
          format: (v: number) => Math.round(v).toLocaleString(),
        };
      case "average_score":
      default:
        return {
          label: "Average Score",
          color: "#6366f1", // Indigo
          domain: [0, 100] as const,
          format: (v: number) => v.toFixed(2),
        };
    }
  }, [metric]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return Object.entries(data)
      .map(([genre, stats]) => {
        let value = 0;
        if (metric === "average_score") {
          value = stats.average_score ?? 0;
        } else if (metric === "count") {
          value = stats.count ?? 0;
        } else if (metric === "trending") {
          value = stats.average_trending ?? 0;
        } else if (metric === "popularity") {
          value = stats.average_popularity ?? 0;
        }

        return {
          genre,
          value,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [data, metric]);

  const tooltipFormatter = useCallback(
    (value: any) => [
      typeof value === "number" ? metricConfig.format(value) : String(value ?? 0),
      metricConfig.label,
    ],
    [metricConfig]
  );

  const tooltipLabelFormatter = useCallback((label: any) => `Genre: ${label}`, []);

  if (chartData.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 text-neutral-400">
        No genre data available for the selected criteria.
      </div>
    );
  }

  const chartHeight = chartData.length * 32 + 40;

  return (
    <div className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-800/80 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {metricConfig.label} by Genre
          </h3>
          <span className="text-xs text-neutral-400">{chartData.length} Genres</span>
        </div>
        {onMetricChange && (
          <div className="flex items-center gap-2 bg-neutral-800/60 p-1.5 rounded-lg border border-neutral-700/60">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 pl-1">
              Metric:
            </label>
            <select
              id="chart-metric-select"
              value={metric}
              onChange={(e) => onMetricChange(e.target.value as any)}
              className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white focus:border-indigo-500 focus:outline-none transition cursor-pointer"
            >
              <option value="count">Count</option>
              <option value="average_score">Average Score</option>
              <option value="popularity">Popularity</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        )}
      </div>
      <div style={{ width: "100%", height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#262626" />
            <XAxis
              type="number"
              domain={metricConfig.domain}
              stroke="#737373"
              tick={{ fill: "#a3a3a3", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="genre"
              stroke="#737373"
              tick={{ fill: "#e5e5e5", fontSize: 13 }}
              width={110}
            />
            <Tooltip
              formatter={tooltipFormatter}
              labelFormatter={tooltipLabelFormatter}
              contentStyle={{
                backgroundColor: "#171717",
                borderColor: "#404040",
                borderRadius: "0.5rem",
                color: "#f5f5f5",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
              }}
              itemStyle={{ color: metricConfig.color }}
            />
            <Bar
              dataKey="value"
              name={metricConfig.label}
              fill={metricConfig.color}
              radius={[0, 4, 4, 0]}
              cursor="pointer"
              animationDuration={300}
              onClick={handleBarClick}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
