"use client";

import { memo, useMemo, useEffect, useState } from "react";
import { AggregateStats } from "@/lib/types";
import { HorizontalBarChart, ChartMetricConfig } from "@/components/charts";

export interface SeasonalAggregatesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: "genre" | "format" | null;
  aggregatesData?: Record<string, AggregateStats> | null;
  onSelectCategory: (name: string, category: "genre" | "format") => void;
}

export interface AggregateChartItem {
  name: string;
  count: number;
  average_score: number;
  average_popularity: number;
  average_trending: number;
  average_favourites: number;
}

const AGGREGATE_CHART_METRICS: ChartMetricConfig[] = [
  {
    key: "average_score",
    label: "Avg Score",
    valueLabel: "Score",
    color: "#9b5cf6",
    strokeColor: "#b285fb",
    format: (v: number) => v.toFixed(1),
    avgFormat: (v: number) => v.toFixed(1),
    domainMax: 100,
  },
  {
    key: "average_popularity",
    label: "Avg Members",
    valueLabel: "Members",
    color: "#4d8fe8",
    strokeColor: "#4d8fe8",
    format: (v: number) => Math.round(v).toLocaleString("en-US"),
    avgFormat: (v: number) => Math.round(v).toLocaleString("en-US"),
  },
  {
    key: "average_trending",
    label: "Avg Trending",
    valueLabel: "Trending",
    color: "#f06b3f",
    strokeColor: "#f06b3f",
    format: (v: number) => v.toFixed(1),
    avgFormat: (v: number) => v.toFixed(1),
  },
  {
    key: "average_favourites",
    label: "Avg Favourites",
    valueLabel: "Favourites",
    color: "#e11d48",
    strokeColor: "#f43f5e",
    format: (v: number) => Math.round(v).toLocaleString("en-US"),
    avgFormat: (v: number) => Math.round(v).toLocaleString("en-US"),
  },
  {
    key: "count",
    label: "Anime Count",
    valueLabel: "Titles",
    color: "#10b981",
    strokeColor: "#34d399",
    format: (v: number) => Math.round(v).toLocaleString("en-US"),
    avgFormat: (v: number) => Math.round(v).toLocaleString("en-US"),
  },
];

export const SeasonalAggregatesDrawer = memo(function SeasonalAggregatesDrawer({
  isOpen,
  onClose,
  type,
  aggregatesData,
  onSelectCategory,
}: SeasonalAggregatesDrawerProps) {
  // Mounting & animation lifecycle states
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimateIn, setIsAnimateIn] = useState(false);
  const [activeType, setActiveType] = useState<"genre" | "format" | null>(type);

  // Preserve activeType during exit transition
  useEffect(() => {
    if (type) {
      setActiveType(type);
    }
  }, [type]);

  // Transition lifecycle effect
  useEffect(() => {
    let animFrame: number;
    let timeout: ReturnType<typeof setTimeout>;

    if (isOpen) {
      setIsMounted(true);
      animFrame = requestAnimationFrame(() => {
        animFrame = requestAnimationFrame(() => {
          setIsAnimateIn(true);
        });
      });
    } else {
      setIsAnimateIn(false);
      timeout = setTimeout(() => {
        setIsMounted(false);
      }, 300);
    }

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
      if (timeout) clearTimeout(timeout);
    };
  }, [isOpen]);

  // ESC key listener to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isMounted) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMounted]);

  const chartData = useMemo<AggregateChartItem[]>(() => {
    if (!aggregatesData) return [];
    return Object.entries(aggregatesData).map(([name, stats]) => ({
      name,
      count: stats.count,
      average_score: stats.average_score,
      average_popularity: stats.average_popularity,
      average_trending: stats.average_trending,
      average_favourites: stats.average_favourites || 0,
    }));
  }, [aggregatesData]);

  if (!isMounted || !activeType) return null;

  const isGenre = activeType === "genre";
  const titleText = isGenre ? "Genres Aggregates Overview" : "Formats Aggregates Overview";
  const descriptionText = isGenre
    ? "Compare average performance across all loaded anime genres. Click any bar to filter the dashboard by that genre."
    : "Compare average performance across all loaded anime formats. Click any bar to filter the dashboard by that format.";

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      {/* Backdrop overlay with opacity transition */}
      <div
        className={`fixed inset-0 bg-black/60 transition-opacity duration-[420ms] ease-[cubic-bezier(.65,0,.35,1)] ${
          isAnimateIn ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel with hardware accelerated slide-x transition */}
      <div
        className={`relative z-10 w-full sm:w-[540px] md:w-[620px] lg:w-[680px] xl:w-[740px] bg-[var(--panel-2)] border-r border-[var(--line)] flex flex-col h-full overflow-hidden transform-gpu will-change-transform transition-transform duration-[420ms] ease-[cubic-bezier(.65,0,.35,1)] shadow-2xl ${
          isAnimateIn ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[var(--line-soft)] flex items-start justify-between gap-4 bg-[var(--panel)] shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  isGenre ? "bg-purple-400" : "bg-indigo-400"
                } animate-pulse`}
              />
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--purple-300)]">
                Aggregates Overview
              </span>
            </div>
            <h2 className="font-display font-medium text-2xl text-[var(--text-hi)]">
              {titleText}
            </h2>
            <p className="text-xs text-[var(--text-mid)] mt-1 max-w-lg leading-relaxed font-body">
              {descriptionText}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-[var(--line)] text-[var(--text-mid)] hover:text-white hover:border-[var(--purple-400)] transition-colors shrink-0 cursor-pointer"
            aria-label="Close drawer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <HorizontalBarChart<AggregateChartItem>
            data={chartData}
            metrics={AGGREGATE_CHART_METRICS}
            defaultMetricKey="average_score"
            nameKey="name"
            yAxisWidth={140}
            title={(metricConfig) => (
              <h3 className="font-display font-medium text-[16px] text-[var(--text-hi)]">
                Aggregates by <span style={{ color: metricConfig.color }}>{metricConfig.label}</span>
              </h3>
            )}
            subtitle={({ metricConfig, averageValue }) => (
              <>
                Category overall average:{" "}
                <span className="font-mono text-white font-medium">
                  {metricConfig.avgFormat ? metricConfig.avgFormat(averageValue) : averageValue.toFixed(1)}
                </span>
                . <span className="text-[var(--purple-300)]">(Click any bar to apply filter & close)</span>
              </>
            )}
            onBarClick={(_, name) => {
              if (name && activeType) {
                onSelectCategory(name, activeType);
                onClose();
              }
            }}
            emptyMessage={`No ${isGenre ? "genre" : "format"} aggregate data available.`}
          />
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[var(--line-soft)] bg-[var(--panel)] flex items-center justify-between font-mono text-[11px] text-[var(--text-low)] shrink-0">
          <span>{chartData.length} total categories loaded</span>
          <span>Click bar to filter</span>
        </div>
      </div>
    </div>
  );
});

