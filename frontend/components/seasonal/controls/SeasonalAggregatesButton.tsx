"use client";

import { memo } from "react";

export interface SeasonalAggregatesButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export const SeasonalAggregatesButton = memo(function SeasonalAggregatesButton({
  onClick,
  disabled = false,
}: SeasonalAggregatesButtonProps) {
  return (
    <button
      type="button"
      id="seasonal-show-aggregates-button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-anilytics-purple-400/30 bg-anilytics-purple-glow-10 text-anilytics-purple-300 text-body-xs font-mono hover:bg-anilytics-purple-glow-20 hover:border-anilytics-purple-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm ml-auto"
      title="Open Aggregates Overview Drawer"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-3.5 h-3.5 text-anilytics-purple-400"
      >
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
      <span>Show Aggregates</span>
    </button>
  );
});
