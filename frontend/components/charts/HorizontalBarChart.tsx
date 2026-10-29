"use client";

import { memo, useState, useMemo, useCallback, ReactNode } from "react";
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

export interface ChartMetricConfig {
  key: string;
  label: string;
  valueLabel?: string;
  color: string;
  strokeColor?: string;
  format?: (value: number) => string;
  avgFormat?: (value: number) => string;
  domainMax?: number | ((maxVal: number) => number);
  xAxisFormatter?: (value: number) => string;
}

export interface HorizontalBarChartProps<T extends Record<string, any> = Record<string, any>> {
  data: T[];
  metrics: ChartMetricConfig[];
  defaultMetricKey?: string;
  activeMetricKey?: string;
  onMetricChange?: (metricKey: string) => void;
  nameKey?: keyof T & string;
  title?: ReactNode | ((metricConfig: ChartMetricConfig) => ReactNode);
  subtitle?: ReactNode | ((context: { metricConfig: ChartMetricConfig; averageValue: number }) => ReactNode);
  onBarClick?: (item: T, name: string) => void;
  yAxisWidth?: number;
  maxTitleLength?: number;
  showAverageLine?: boolean;
  emptyMessage?: string;
}

const truncateTitle = (title: string, maxLength: number = 28) => {
  if (!title) return "";
  if (title.length <= maxLength) return title;
  return `${title.slice(0, maxLength)}...`;
};

function HorizontalBarChartInner<T extends Record<string, any> = Record<string, any>>({
  data,
  metrics,
  defaultMetricKey,
  activeMetricKey,
  onMetricChange,
  nameKey = "name" as keyof T & string,
  title,
  subtitle,
  onBarClick,
  yAxisWidth = 180,
  maxTitleLength = 28,
  showAverageLine = true,
  emptyMessage = "No data available for the selected criteria.",
}: HorizontalBarChartProps<T>) {
  const [internalMetricKey, setInternalMetricKey] = useState<string>(
    defaultMetricKey || metrics[0]?.key || ""
  );

  const currentMetricKey = activeMetricKey ?? internalMetricKey;

  const handleMetricSelect = useCallback(
    (key: string) => {
      if (!activeMetricKey) {
        setInternalMetricKey(key);
      }
      onMetricChange?.(key);
    },
    [activeMetricKey, onMetricChange]
  );

  const metricConfig = useMemo(() => {
    const found = metrics.find((m) => m.key === currentMetricKey);
    if (found) return found;
    return (
      metrics[0] || {
        key: currentMetricKey,
        label: currentMetricKey,
        valueLabel: currentMetricKey,
        color: "#9b5cf6",
        strokeColor: "#b285fb",
      }
    );
  }, [metrics, currentMetricKey]);

  const formatValue = useCallback(
    (val: number) => {
      if (metricConfig.format) return metricConfig.format(val);
      return val.toLocaleString("en-US");
    },
    [metricConfig]
  );

  const formatAvgValue = useCallback(
    (val: number) => {
      if (metricConfig.avgFormat) return metricConfig.avgFormat(val);
      if (metricConfig.format) return metricConfig.format(val);
      return val.toFixed(1);
    },
    [metricConfig]
  );

  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...data].sort((a, b) => {
      const valA = Number(a[currentMetricKey]) || 0;
      const valB = Number(b[currentMetricKey]) || 0;
      return valB - valA;
    });
  }, [data, currentMetricKey]);

  const averageValue = useMemo(() => {
    if (!sortedData || sortedData.length === 0) return 0;
    const sum = sortedData.reduce(
      (acc, item) => acc + (Number(item[currentMetricKey]) || 0),
      0
    );
    return sum / sortedData.length;
  }, [sortedData, currentMetricKey]);

  const domainMax = useMemo(() => {
    if (!sortedData || sortedData.length === 0) return 100;
    if (typeof metricConfig.domainMax === "number") {
      return metricConfig.domainMax;
    }
    const maxVal = Math.max(
      ...sortedData.map((d) => Number(d[currentMetricKey]) || 0)
    );
    if (typeof metricConfig.domainMax === "function") {
      return metricConfig.domainMax(maxVal);
    }
    return Math.ceil(maxVal * 1.08);
  }, [sortedData, currentMetricKey, metricConfig]);

  const handleBarClickInternal = useCallback(
    (barData: any) => {
      if (barData && onBarClick) {
        const rawItem = sortedData.find(
          (d) => String(d[nameKey]) === String(barData[nameKey] || barData.payload?.[nameKey])
        ) || barData.payload || barData;
        onBarClick(rawItem as T, String(barData[nameKey] || barData.payload?.[nameKey] || ""));
      }
    },
    [sortedData, nameKey, onBarClick]
  );

  const customTooltip = useCallback(
    ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const item = payload[0].payload as T;
        const rawVal = item[currentMetricKey];
        const numVal = typeof rawVal === "number" ? rawVal : Number(rawVal) || 0;
        const displayLabel = item[nameKey] || "";

        return (
          <div className="bg-gradient-to-br from-anilytics-panel-2 to-anilytics-panel border border-anilytics-line rounded-xl p-tooltip-sm shadow-2xl z-50 pointer-events-none min-w-37.5 max-w-60">
            <span className="block font-mono text-label-sm text-anilytics-text-hi truncate mb-1">
              {displayLabel}
            </span>
            <span
              className="block font-mono text-2xs tracking-wider-sm uppercase"
              style={{ color: metricConfig.color }}
            >
              {metricConfig.valueLabel || metricConfig.label} · {formatValue(numVal)}
            </span>
          </div>
        );
      }
      return null;
    },
    [currentMetricKey, nameKey, metricConfig, formatValue]
  );

  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-card-lg border border-anilytics-line bg-gradient-to-br from-anilytics-panel-2 to-anilytics-panel p-6 text-anilytics-text-mid font-mono text-xs">
        {emptyMessage}
      </div>
    );
  }

  const chartHeight = Math.max(300, sortedData.length * 38 + 60);

  const renderedTitle =
    typeof title === "function"
      ? title(metricConfig)
      : title || (
          <h3 className="font-display font-medium text-title-sm text-anilytics-text-hi">
            Distribution by{" "}
            <span style={{ color: metricConfig.color }}>{metricConfig.label}</span>
          </h3>
        );

  const renderedSubtitle =
    typeof subtitle === "function"
      ? subtitle({ metricConfig, averageValue })
      : subtitle;

  return (
    <div className="bg-gradient-to-br from-anilytics-panel-2 to-anilytics-panel border border-anilytics-line rounded-card-lg p-chart-card sm:p-chart-card-lg mb-9 shadow-2xl space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          {renderedTitle}
          {renderedSubtitle && (
            <p className="text-body-sm text-anilytics-text-mid mt-1">
              {renderedSubtitle}
            </p>
          )}
        </div>

        {/* Metric Selector (if multiple metrics defined) */}
        {metrics.length > 1 && (
          <div className="flex items-center gap-2 pl-4 border-l border-anilytics-line self-center">
            <span className="font-mono text-3xs tracking-widest-sm uppercase text-anilytics-text-low">
              Metric
            </span>
            <select
              value={currentMetricKey}
              onChange={(e) => handleMetricSelect(e.target.value)}
              aria-label="Chart metric"
              className="appearance-none bg-transparent border-0 text-anilytics-text-mid font-mono text-label tracking-wide-md pr-5 py-1 focus:outline-none focus:text-anilytics-text-hi cursor-pointer transition-colors bg-select-chevron-sm"
            >
              {metrics.map((m) => (
                <option
                  key={m.key}
                  value={m.key}
                  className="bg-anilytics-panel-2 text-anilytics-text-hi"
                >
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div style={{ width: "100%", height: chartHeight }} className="pt-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={sortedData}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="rgba(255,255,255,0.04)"
            />
            <XAxis
              type="number"
              domain={[0, domainMax]}
              stroke="rgba(255,255,255,0.1)"
              tick={{ fill: "#6d6880", fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickFormatter={(v) => {
                if (metricConfig.xAxisFormatter) return metricConfig.xAxisFormatter(v);
                return currentMetricKey === "popularity" || currentMetricKey === "count"
                  ? v >= 1000
                    ? `${Math.round(v / 1000)}k`
                    : v
                  : v;
              }}
            />
            <YAxis
              type="category"
              dataKey={nameKey as any}
              stroke="transparent"
              tick={{ fill: "#a9a3b8", fontSize: 11.5, fontFamily: "var(--font-body)" }}
              tickFormatter={(value: string) => truncateTitle(value, maxTitleLength)}
              width={yAxisWidth}
            />
            <Tooltip content={customTooltip} cursor={{ fill: "rgba(255,255,255,0.025)" }} />
            {showAverageLine && (
              <ReferenceLine
                x={averageValue}
                stroke={metricConfig.strokeColor || metricConfig.color}
                strokeDasharray="3 3"
                strokeWidth={1.5}
                label={{
                  value: `Avg: ${formatAvgValue(averageValue)}`,
                  fill: metricConfig.strokeColor || metricConfig.color,
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  position: "top",
                  offset: 8,
                }}
              />
            )}
            <Bar
              dataKey={currentMetricKey}
              name={metricConfig.label}
              fill={metricConfig.color}
              radius={[0, 4, 4, 0]}
              cursor="pointer"
              animationDuration={600}
              animationEasing="ease-in-out"
              onClick={handleBarClickInternal}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export const HorizontalBarChart = memo(HorizontalBarChartInner) as <
  T extends Record<string, any> = Record<string, any>
>(
  props: HorizontalBarChartProps<T>
) => React.ReactElement | null;
