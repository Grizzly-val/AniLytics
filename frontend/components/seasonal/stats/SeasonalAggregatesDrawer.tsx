"use client";

import { memo, useMemo, useEffect, useState } from "react";
import { AggregateStats } from "@/lib/types";
import { HorizontalBarChart, ChartMetricConfig } from "@/components/charts";

export interface SeasonalAggregatesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "genre" | "format" | null;
  genresAggregates?: Record<string, AggregateStats> | null;
  formatsAggregates?: Record<string, AggregateStats> | null;
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

// Blue color palette for genres selection
const GENRE_CHART_METRICS: ChartMetricConfig[] = [
  {
    key: "average_score",
    label: "Avg Score",
    valueLabel: "Score",
    color: "#3b82f6",
    strokeColor: "#60a5fa",
    format: (v: number) => v.toFixed(1),
    avgFormat: (v: number) => v.toFixed(1),
    domainMax: 100,
  },
  {
    key: "average_popularity",
    label: "Avg Members",
    valueLabel: "Members",
    color: "#2563eb",
    strokeColor: "#93c5fd",
    format: (v: number) => Math.round(v).toLocaleString("en-US"),
    avgFormat: (v: number) => Math.round(v).toLocaleString("en-US"),
  },
  {
    key: "average_trending",
    label: "Avg Trending",
    valueLabel: "Trending",
    color: "#0284c7",
    strokeColor: "#38bdf8",
    format: (v: number) => v.toFixed(1),
    avgFormat: (v: number) => v.toFixed(1),
  },
  {
    key: "average_favourites",
    label: "Avg Favourites",
    valueLabel: "Favourites",
    color: "#4f46e5",
    strokeColor: "#818cf8",
    format: (v: number) => Math.round(v).toLocaleString("en-US"),
    avgFormat: (v: number) => Math.round(v).toLocaleString("en-US"),
  },
  {
    key: "count",
    label: "Anime Count",
    valueLabel: "Titles",
    color: "#0ea5e9",
    strokeColor: "#7dd3fc",
    format: (v: number) => Math.round(v).toLocaleString("en-US"),
    avgFormat: (v: number) => Math.round(v).toLocaleString("en-US"),
  },
];

// Green color palette for formats selection
const FORMAT_CHART_METRICS: ChartMetricConfig[] = [
  {
    key: "average_score",
    label: "Avg Score",
    valueLabel: "Score",
    color: "#10b981",
    strokeColor: "#34d399",
    format: (v: number) => v.toFixed(1),
    avgFormat: (v: number) => v.toFixed(1),
    domainMax: 100,
  },
  {
    key: "average_popularity",
    label: "Avg Members",
    valueLabel: "Members",
    color: "#059669",
    strokeColor: "#6ee7b7",
    format: (v: number) => Math.round(v).toLocaleString("en-US"),
    avgFormat: (v: number) => Math.round(v).toLocaleString("en-US"),
  },
  {
    key: "average_trending",
    label: "Avg Trending",
    valueLabel: "Trending",
    color: "#14b8a6",
    strokeColor: "#2dd4bf",
    format: (v: number) => v.toFixed(1),
    avgFormat: (v: number) => v.toFixed(1),
  },
  {
    key: "average_favourites",
    label: "Avg Favourites",
    valueLabel: "Favourites",
    color: "#16a34a",
    strokeColor: "#86efac",
    format: (v: number) => Math.round(v).toLocaleString("en-US"),
    avgFormat: (v: number) => Math.round(v).toLocaleString("en-US"),
  },
  {
    key: "count",
    label: "Anime Count",
    valueLabel: "Titles",
    color: "#84cc16",
    strokeColor: "#a3e635",
    format: (v: number) => Math.round(v).toLocaleString("en-US"),
    avgFormat: (v: number) => Math.round(v).toLocaleString("en-US"),
  },
];

export const SeasonalAggregatesDrawer = memo(function SeasonalAggregatesDrawer({
  isOpen,
  onClose,
  type = "genre",
  genresAggregates,
  formatsAggregates,
  aggregatesData,
  onSelectCategory,
}: SeasonalAggregatesDrawerProps) {
  // Mounting & animation lifecycle states
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimateIn, setIsAnimateIn] = useState(false);

  // Active category selection inside drawer (Genres vs Formats)
  const [selectedCategory, setSelectedCategory] = useState<"genre" | "format">(type || "genre");

  // Sync category if `type` prop updates
  useEffect(() => {
    if (type) {
      setSelectedCategory(type);
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

  const activeAggregates = useMemo(() => {
    if (selectedCategory === "genre") {
      return genresAggregates || (type === "genre" ? aggregatesData : null);
    } else {
      return formatsAggregates || (type === "format" ? aggregatesData : null);
    }
  }, [selectedCategory, genresAggregates, formatsAggregates, aggregatesData, type]);

  const chartData = useMemo<AggregateChartItem[]>(() => {
    if (!activeAggregates) return [];
    return Object.entries(activeAggregates).map(([name, stats]) => ({
      name,
      count: stats.count,
      average_score: stats.average_score,
      average_popularity: stats.average_popularity,
      average_trending: stats.average_trending,
      average_favourites: stats.average_favourites || 0,
    }));
  }, [activeAggregates]);

  if (!isMounted) return null;

  const isGenre = selectedCategory === "genre";
  const titleText = isGenre ? "Genres Aggregates Overview" : "Formats Aggregates Overview";
  const descriptionText = isGenre
    ? "Compare average performance across all loaded anime genres. Click any bar to filter the dashboard by that genre."
    : "Compare average performance across all loaded anime formats. Click any bar to filter the dashboard by that format.";

  const currentMetrics = isGenre ? GENRE_CHART_METRICS : FORMAT_CHART_METRICS;
  const accentTextColor = isGenre ? "text-blue-400" : "text-emerald-400";
  const pulseDotColor = isGenre ? "bg-blue-400" : "bg-emerald-400";

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      {/* Backdrop overlay with opacity transition */}
      <div
        className={`fixed inset-0 bg-black/60 transition-opacity duration-normal ease-custom ${
          isAnimateIn ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel with hardware accelerated slide-x transition */}
      <div
        className={`relative z-10 w-full sm:w-135 md:w-155 lg:w-170 xl:w-185 bg-anilytics-panel-2 border-r border-anilytics-line flex flex-col h-full overflow-hidden transform-gpu will-change-transform transition-transform duration-normal ease-custom shadow-2xl ${
          isAnimateIn ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-anilytics-line-soft flex flex-col gap-4 bg-anilytics-panel shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${pulseDotColor} animate-pulse`} />
                <span className={`font-mono text-label uppercase tracking-widest-sm ${accentTextColor}`}>
                  Aggregates Overview
                </span>
              </div>
              <h2 className="font-display font-medium text-2xl text-anilytics-text-hi">
                {titleText}
              </h2>
              <p className="text-xs text-anilytics-text-mid mt-1 max-w-lg leading-relaxed font-body">
                {descriptionText}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-anilytics-line text-anilytics-text-mid hover:text-white hover:border-anilytics-purple-400 transition-colors shrink-0 cursor-pointer"
              aria-label="Close drawer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Category Toggle Switcher: Choose Between Genres (Blue) or Formats (Green) */}
          <div className="flex items-center gap-1.5 p-1 bg-anilytics-panel-2 border border-anilytics-line rounded-xl w-fit">
            <button
              type="button"
              id="drawer-select-genres-btn"
              onClick={() => setSelectedCategory("genre")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                isGenre
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-sm"
                  : "text-anilytics-text-mid hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isGenre ? "bg-blue-400" : "bg-neutral-600"}`} />
              <span>Genres</span>
            </button>

            <button
              type="button"
              id="drawer-select-formats-btn"
              onClick={() => setSelectedCategory("format")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                !isGenre
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
                  : "text-anilytics-text-mid hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${!isGenre ? "bg-emerald-400" : "bg-neutral-600"}`} />
              <span>Formats</span>
            </button>
          </div>
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <HorizontalBarChart<AggregateChartItem>
            key={`chart-${selectedCategory}`}
            data={chartData}
            metrics={currentMetrics}
            defaultMetricKey="average_score"
            nameKey="name"
            yAxisWidth={140}
            title={(metricConfig) => (
              <h3 className="font-display font-medium text-base text-anilytics-text-hi">
                Aggregates by <span style={{ color: metricConfig.color }}>{metricConfig.label}</span>
              </h3>
            )}
            subtitle={({ metricConfig, averageValue }) => (
              <>
                Category overall average:{" "}
                <span className="font-mono text-white font-medium">
                  {metricConfig.avgFormat ? metricConfig.avgFormat(averageValue) : averageValue.toFixed(1)}
                </span>
                . <span className={accentTextColor}>(Click any bar to apply filter & close)</span>
              </>
            )}
            onBarClick={(_, name) => {
              if (name) {
                onSelectCategory(name, selectedCategory);
                onClose();
              }
            }}
            emptyMessage={`No ${isGenre ? "genre" : "format"} aggregate data available.`}
          />
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-anilytics-line-soft bg-anilytics-panel flex items-center justify-between font-mono text-label text-anilytics-text-low shrink-0">
          <span>
            {chartData.length} {isGenre ? "genres" : "formats"} loaded
          </span>
          <span className={accentTextColor}>Click bar to filter</span>
        </div>
      </div>
    </div>
  );
});
