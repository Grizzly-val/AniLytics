"use client";

import Link from "next/link";
import { DashboardConfig } from "@/lib/subjects";

interface DashboardCardProps {
  dashboard: DashboardConfig;
  index?: number;
}

export function DashboardCard({ dashboard, index = 0 }: DashboardCardProps) {
  const tags = dashboard.tags || dashboard.features || [];

  return (
    <div
      className="group relative flex flex-col justify-between bg-gradient-card-surface border border-anilytics-line rounded-panel p-card sm:p-card-lg transition-all duration-300 ease-custom hover:border-anilytics-purple-light-35 hover:-translate-y-1 shadow-card h-full animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex flex-col grow">
        {/* Card Top Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-icon-box-lg h-icon-box-lg rounded-pill bg-anilytics-purple-glow-12 border border-anilytics-line flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-icon-title h-icon-title stroke-anilytics-purple-300"
            >
              {dashboard.icon === "chart-bar" ? (
                <>
                  <path d="M3 3v18h18" />
                  <path d="M18 17V9" />
                  <path d="M13 17V5" />
                  <path d="M8 17v-3" />
                </>
              ) : (
                <>
                  <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
                  <path d="M9 22H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2h-2" />
                  <path d="M12 12v6" />
                  <path d="M9 15h6" />
                </>
              )}
            </svg>
          </div>

          {dashboard.badge && (
            <span className="no-bubble-label text-label-sm tracking-widest-sm uppercase text-anilytics-purple-300 font-mono">
              {dashboard.badge}
            </span>
          )}
        </div>

        {/* Card Title */}
        <h3 className="font-display font-medium text-title-lg tracking-snug-2 text-anilytics-text-hi mb-2.5 group-hover:text-white transition-colors truncate">
          {dashboard.title}
        </h3>

        {/* Card Description */}
        <p className="font-body text-body leading-relaxed-sm text-anilytics-text-mid mb-4.5 grow line-clamp-3">
          {dashboard.description}
        </p>

        {/* Card Tags - Slash Separated */}
        {tags.length > 0 && (
          <div className="no-bubble-tag text-label-sm tracking-wide-sm text-anilytics-text-low mb-5 truncate font-mono">
            {tags.map((tag, idx) => (
              <span key={tag}>
                {idx > 0 && <span className="text-anilytics-line mx-2">/</span>}
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Foot */}
      <div className="flex items-center justify-end pt-4 border-t border-anilytics-line-soft mt-auto">
        <Link
          href={dashboard.path}
          className="group/link inline-flex items-center gap-1.75 font-body font-medium text-body-md text-anilytics-purple-300 transition-all hover:gap-2.75 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-anilytics-purple-400 rounded-sm"
        >
          <span>Open dashboard</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.25 h-3.25 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover:translate-x-0.5"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
