"use client";

import { memo } from "react";
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

export const GenreScoreChart = memo(function GenreScoreChart({
  decodedGenre,
  averageScore,
  chartData,
  onBarClick,
}: GenreScoreChartProps) {
  if (chartData.length === 0) return null;

  const chartHeight = Math.max(260, chartData.length * 36 + 40);

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Anime Score Distribution in {decodedGenre}
          </h3>
          <p className="text-xs text-neutral-400">
            Comparing individual titles against the genre average of {averageScore.toFixed(2)}.
            <span className="text-indigo-400 font-medium ml-1">
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
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
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
              width={150}
            />
            <Tooltip
              formatter={(value) => [
                value != null ? `${value} / 100` : "N/A",
                "Score",
              ]}
              labelFormatter={(label) => `Title: ${label} (Click bar to locate)`}
              contentStyle={{
                backgroundColor: "#171717",
                borderColor: "#404040",
                borderRadius: "0.5rem",
                color: "#f5f5f5",
              }}
            />
            <ReferenceLine
              x={averageScore}
              stroke="#ec4899"
              strokeDasharray="4 4"
              label={{
                value: `Avg: ${averageScore.toFixed(1)}`,
                fill: "#ec4899",
                fontSize: 11,
                position: "top",
              }}
            />
            <Bar
              dataKey="score"
              name="Score"
              fill="#6366f1"
              radius={[0, 4, 4, 0]}
              cursor="pointer"
              onClick={(data) => {
                if (data && data.name && onBarClick) {
                  onBarClick(data.name);
                }
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
