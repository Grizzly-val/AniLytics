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
          <div className="bg-gradient-to-br from-[var(--panel-2)] to-[var(--panel)] border border-[var(--line)] rounded-xl p-[9px_11px] shadow-2xl z-50 pointer-events-none min-w-[150px] max-w-[240px]">
            <span className="block font-mono text-[10.5px] text-[var(--text-hi)] truncate mb-1">
              {displayLabel}
            </span>
            <span
              className="block font-mono text-[10px] tracking-[0.05em] uppercase"
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
      <div className="flex h-48 items-center justify-center rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--panel-2)] to-[var(--panel)] p-6 text-[var(--text-mid)] font-mono text-xs">
        {emptyMessage}
      </div>
    );
  }

  const chartHeight = Math.max(300, sortedData.length * 38 + 60);

  const renderedTitle =
    typeof title === "function"
      ? title(metricConfig)
      : title || (
          <h3 className="font-display font-medium text-[17px] text-[var(--text-hi)]">
            Distribution by{" "}
            <span style={{ color: metricConfig.color }}>{metricConfig.label}</span>
          </h3>
        );

  const renderedSubtitle =
    typeof subtitle === "function"
      ? subtitle({ metricConfig, averageValue })
      : subtitle;

  return (
    <div className="bg-gradient-to-br from-[var(--panel-2)] to-[var(--panel)] border border-[var(--line)] rounded-2xl p-[24px_24px_20px] sm:p-[30px_32px_26px] mb-9 shadow-2xl space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          {renderedTitle}
          {renderedSubtitle && (
            <p className="text-[12.5px] text-[var(--text-mid)] mt-1">
              {renderedSubtitle}
            </p>
          )}
        </div>

        {/* Metric Selector (if multiple metrics defined) */}
        {metrics.length > 1 && (
          <div className="flex items-center gap-2 pl-4 border-l border-[var(--line)] self-center">
            <span className="font-mono text-[9px] tracking-[0.08em] uppercase text-[var(--text-low)]">
              Metric
            </span>
            <select
              value={currentMetricKey}
              onChange={(e) => handleMetricSelect(e.target.value)}
              aria-label="Chart metric"
              className="appearance-none bg-transparent border-0 text-[var(--text-mid)] font-mono text-[11px] tracking-[0.03em] pr-5 py-1 focus:outline-none focus:text-[var(--text-hi)] cursor-pointer transition-colors bg-no-repeat bg-[right_2px_center] bg-[length:10px] [background-image:url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%236d6880%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22><path%20d=%22m6%209%206%206%206-6%22/></svg>')]"
            >
              {metrics.map((m) => (
                <option
                  key={m.key}
                  value={m.key}
                  className="bg-[var(--panel-2)] text-[var(--text-hi)]"
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
