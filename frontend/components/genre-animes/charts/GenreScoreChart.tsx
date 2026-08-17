"use client";

import { memo, useCallback } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

export interface ScoreChartItem {
  name: string;
  score: number;
  popularity: number;
  trending: number;
}

interface GenreScoreChartProps {
  decodedGenre: string;
  averageScore: number;
  chartData: ScoreChartItem[];
  onBarClick?: (titleName: string) => void;
}

const truncateTitle = (title: string, maxLength: number = 30) => {
  if (!title) return "";
  if (title.length <= maxLength) return title;
  return `${title.slice(0, maxLength)}...`;
};

export const GenreScoreChart = memo(function GenreScoreChart({
  decodedGenre,
  averageScore,
  chartData,
  onBarClick,
}: GenreScoreChartProps) {
  const handleBarClick = useCallback(
    (data: any) => {
      if (data && data.name && onBarClick) {
        onBarClick(data.name);
      }
    },
    [onBarClick]
  );

  const tooltipFormatter = useCallback(
    (value: any) => [value != null ? `${value} / 100` : "N/A", "Score"],
    []
  );

  const tooltipLabelFormatter = useCallback(
    (label: any) => `Title: ${label} (Click bar to locate)`,
    []
  );

  if (chartData.length === 0) return null;

  const chartHeight = Math.max(280, chartData.length * 36 + 50);

  return (
    <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-5 sm:p-6 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Anime Score Distribution in {decodedGenre}
          </h3>
          <p className="text-xs text-neutral-400 font-normal">
            Comparing individual titles against the genre average of {averageScore.toFixed(2)}.
            <span className="text-purple-300 font-medium ml-1">
              (Click any bar to jump to anime details)
            </span>
          </p>
        </div>
      </div>

      <div style={{ width: "100%", height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 25, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#262626" />
            <XAxis
              type="number"
              domain={[0, 100]}
              stroke="#737373"
              tick={{ fill: "#a3a3a3", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#737373"
              tick={{ fill: "#e5e5e5", fontSize: 12 }}
              tickFormatter={(value: string) => truncateTitle(value, 30)}
              width={190}
            />
            <Tooltip
              formatter={tooltipFormatter}
              labelFormatter={tooltipLabelFormatter}
              contentStyle={{
                backgroundColor: "#171717",
                borderColor: "#404040",
                borderRadius: "0.5rem",
                color: "#f5f5f5",
              }}
            />
            <ReferenceLine
              x={averageScore}
              stroke="#a855f7"
              strokeDasharray="4 4"
              label={{
                value: `Avg: ${averageScore.toFixed(1)}`,
                fill: "#c084fc",
                fontSize: 11,
                position: "top",
                offset: 8,
              }}
            />
            <Bar
              dataKey="score"
              name="Score"
              fill="#c084fc"
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
