"use client";

import { useState } from "react";
import Link from "next/link";
import { SEASONAL_SUBJECTS } from "@/lib/subjects";
import { SubjectRail } from "@/components/seasonal/SubjectRail";
import { DashboardCard } from "@/components/seasonal/DashboardCard";

export default function SeasonalPage() {
  const [activeSubjectId, setActiveSubjectId] = useState<string>("genres");

  const currentSubject =
    SEASONAL_SUBJECTS.find((s) => s.id === activeSubjectId) || SEASONAL_SUBJECTS[0];

  return (
    <div className="flex-1 flex flex-col w-full max-w-[1400px] mx-auto">
      {/* Header Row: Breadcrumb & Active Subject Indicator */}
      <div className="flex items-center justify-between px-6 sm:px-10 lg:px-12 pt-7 pb-3">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-mono text-[11.5px] tracking-[0.04em] uppercase text-[var(--text-low)]"
        >
          <Link
            href="/"
            className="hover:text-[var(--text-mid)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--purple-400)] rounded-sm"
          >
            Home
          </Link>
          <span className="text-[var(--line)]" aria-hidden="true">
            /
          </span>
          <span className="text-[var(--purple-300)] font-medium">
            Seasonal Analytics
          </span>
        </nav>

        {/* Active Subject Indicator */}
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--text-low)] select-none">
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--purple-400)] animate-pulse-dot" />
          <span>Active Subject</span>
        </div>
      </div>

      {/* Main Layout Container with Floating Vertical Rail */}
      <div className="relative flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-140px)]">
        {/* Slim Vertical Rail Subject Switcher */}
        <SubjectRail
          subjects={SEASONAL_SUBJECTS}
          activeSubjectId={activeSubjectId}
          onSelectSubject={setActiveSubjectId}
        />

        {/* Main Content Area (reserves left space for rail on desktop) */}
        <main
          key={currentSubject.id}
          className="relative z-10 flex-1 px-6 sm:px-10 lg:pl-[260px] lg:pr-12 pt-3 pb-20 max-w-[1240px] animate-fade-in"
        >
          {/* Subject Headline */}
          <h1 className="font-display font-light text-[34px] sm:text-[44px] tracking-[-0.02em] bg-[linear-gradient(180deg,#ffffff_0%,var(--purple-300)_140%)] bg-clip-text text-transparent mt-4 mb-3.5 select-none">
            {currentSubject.title}
          </h1>

          {/* Subject Description */}
          <p className="font-body text-[15px] leading-[1.65] text-[var(--text-mid)] max-w-[640px] mb-5">
            {currentSubject.description}
          </p>

          {/* Subject Meta Row */}
          <div className="flex items-center justify-between pt-5 border-t border-[var(--line-soft)] mb-10 font-mono text-[11.5px] tracking-[0.03em] text-[var(--text-low)]">
            <span>{currentSubject.categoryLabel || "Seasonal Analytics"}</span>
            {currentSubject.dashboards && (
              <span className="text-[var(--purple-300)]">
                {currentSubject.dashboards.length} Dashboard
                {currentSubject.dashboards.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {/* Dashboards Cards or Placeholder State */}
          {currentSubject.dashboards ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentSubject.dashboards.map((dash, i) => (
                <DashboardCard key={dash.slug} dashboard={dash} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-start gap-2.5 py-14 border-t border-[var(--line-soft)] max-w-[480px]">
              <div className="w-[40px] h-[40px] rounded-[11px] border border-dashed border-[var(--line)] flex items-center justify-center mb-1.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-[17px] h-[17px] stroke-[var(--text-low)]"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>
              <div className="font-display font-normal text-[19px] text-[var(--text-mid)]">
                Under construction
              </div>
              <div className="font-body text-[13.5px] text-[var(--text-low)] leading-[1.6]">
                This subject has no data yet. Check back once it's wired up.
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
