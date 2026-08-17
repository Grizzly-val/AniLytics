"use client";

import { memo, useState, useMemo, useCallback } from "react";
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

type ChartMetric = "score" | "popularity" | "trending";

const truncateTitle = (title: string, maxLength: number = 28) => {
  if (!title) return "";
  if (title.length <= maxLength) return title;
  return `${title.slice(0, maxLength)}...`;
};

export const GenreScoreChart = memo(function GenreScoreChart({
  decodedGenre,
  chartData,
  onBarClick,
}: GenreScoreChartProps) {
  const [metric, setMetric] = useState<ChartMetric>("score");

  const metricConfig = useMemo(() => {
    return {
      score: {
        label: "Score",
        valueLabel: "Score",
        color: "#9b5cf6",
        strokeColor: "#b285fb",
        format: (v: number) => v.toFixed(0),
        avgFormat: (v: number) => v.toFixed(1),
      },
      popularity: {
        label: "Popularity",
        valueLabel: "Members",
        color: "#4d8fe8",
        strokeColor: "#4d8fe8",
        format: (v: number) => Math.round(v).toLocaleString("en-US"),
        avgFormat: (v: number) => Math.round(v).toLocaleString("en-US"),
      },
      trending: {
        label: "Trending",
        valueLabel: "Trending",
        color: "#f06b3f",
        strokeColor: "#f06b3f",
        format: (v: number) => v.toFixed(0),
        avgFormat: (v: number) => v.toFixed(1),
      },
    }[metric];
  }, [metric]);

  const sortedData = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    return [...chartData].sort((a, b) => b[metric] - a[metric]);
  }, [chartData, metric]);

  const averageValue = useMemo(() => {
    if (!sortedData || sortedData.length === 0) return 0;
    const sum = sortedData.reduce((acc, item) => acc + (Number(item[metric]) || 0), 0);
    return sum / sortedData.length;
  }, [sortedData, metric]);

  const domainMax = useMemo(() => {
    if (metric === "score") return 100;
    if (!sortedData || sortedData.length === 0) return 100;
    const maxVal = Math.max(...sortedData.map((d) => Number(d[metric]) || 0));
    return Math.ceil(maxVal * 1.08);
  }, [sortedData, metric]);

  const handleBarClick = useCallback(
    (data: any) => {
      if (data && data.name && onBarClick) {
        onBarClick(data.name);
      }
    },
    [onBarClick]
  );

  const customTooltip = useCallback(
    ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const item = payload[0].payload as ScoreChartItem;
        const val = item[metric];
        return (
          <div className="bg-gradient-to-br from-[var(--panel-2)] to-[var(--panel)] border border-[var(--line)] rounded-xl p-[9px_11px] shadow-2xl z-50 pointer-events-none min-w-[150px] max-w-[240px]">
            <span className="block font-mono text-[10.5px] text-[var(--text-hi)] truncate mb-1">
              {item.name}
            </span>
            <span className="block font-mono text-[10px] tracking-[0.05em] uppercase" style={{ color: metricConfig.color }}>
              {metricConfig.valueLabel} · {metricConfig.format(val)}
            </span>
          </div>
        );
      }
      return null;
    },
    [metric, metricConfig]
  );

  if (!chartData || chartData.length === 0) return null;

  const chartHeight = Math.max(300, sortedData.length * 38 + 60);

  return (
    <div className="bg-gradient-to-br from-[var(--panel-2)] to-[var(--panel)] border border-[var(--line)] rounded-2xl p-[24px_24px_20px] sm:p-[30px_32px_26px] mb-9 shadow-2xl space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-display font-medium text-[17px] text-[var(--text-hi)]">
            Anime <span style={{ color: metricConfig.color }}>{metricConfig.label}</span> Distribution
          </h3>
          <p className="text-[12.5px] text-[var(--text-mid)] mt-1">
            Comparing individual titles by {metricConfig.label.toLowerCase()} against the genre average of{" "}
            <span className="font-mono text-white font-medium">{metricConfig.avgFormat(averageValue)}</span>.{" "}
            <span className="text-[var(--purple-300)] font-medium">
              (Click any bar to jump to its card below)
            </span>
          </p>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center gap-2 pl-4 border-l border-[var(--line)] self-center">
          <span className="font-mono text-[9px] tracking-[0.08em] uppercase text-[var(--text-low)]">
            Metric
          </span>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as ChartMetric)}
            aria-label="Chart metric"
            className="appearance-none bg-transparent border-0 text-[var(--text-mid)] font-mono text-[11px] tracking-[0.03em] pr-5 py-1 focus:outline-none focus:text-[var(--text-hi)] cursor-pointer transition-colors bg-no-repeat bg-[right_2px_center] bg-[length:10px] [background-image:url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%236d6880%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22><path%20d=%22m6%209%206%206%206-6%22/></svg>')]"
          >
            <option value="score" className="bg-[var(--panel-2)] text-[var(--text-hi)]">
              Score
            </option>
            <option value="popularity" className="bg-[var(--panel-2)] text-[var(--text-hi)]">
              Popularity
            </option>
            <option value="trending" className="bg-[var(--panel-2)] text-[var(--text-hi)]">
              Trending
            </option>
          </select>
        </div>
      </div>

      <div style={{ width: "100%", height: chartHeight }} className="pt-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={sortedData}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.04)" />
            <XAxis
              type="number"
              domain={[0, domainMax]}
              stroke="rgba(255,255,255,0.1)"
              tick={{ fill: "#6d6880", fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickFormatter={(v) => (metric === "popularity" ? (v >= 1000 ? `${Math.round(v / 1000)}k` : v) : v)}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="transparent"
              tick={{ fill: "#a9a3b8", fontSize: 11.5, fontFamily: "var(--font-body)" }}
              tickFormatter={(value: string) => truncateTitle(value, 28)}
              width={180}
            />
            <Tooltip content={customTooltip} cursor={{ fill: "rgba(255,255,255,0.025)" }} />
            <ReferenceLine
              x={averageValue}
              stroke={metricConfig.strokeColor}
              strokeDasharray="3 3"
              strokeWidth={1.5}
              label={{
                value: `Avg: ${metricConfig.avgFormat(averageValue)}`,
                fill: metricConfig.strokeColor,
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                position: "top",
                offset: 8,
              }}
            />
            <Bar
              dataKey={metric}
              name={metricConfig.label}
              fill={metricConfig.color}
              radius={[0, 4, 4, 0]}
              cursor="pointer"
              animationDuration={600}
              animationEasing="ease-in-out"
              onClick={handleBarClick}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

