"use client";

import { useState } from "react";
import Link from "next/link";
import { EASY_ANILYTICS_SUBJECTS } from "@/lib/subjects";
import { SubjectRail } from "@/components/easy-anilytics/SubjectRail";
import { DashboardCard } from "@/components/easy-anilytics/DashboardCard";

export default function FilterByPage() {
  const [activeSubjectId, setActiveSubjectId] = useState<string>("filter-by");

  const currentSubject =
    EASY_ANILYTICS_SUBJECTS.find((s) => s.id === activeSubjectId) || EASY_ANILYTICS_SUBJECTS[0];

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
            Easy-AniLytics
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
          subjects={EASY_ANILYTICS_SUBJECTS}
          activeSubjectId={activeSubjectId}
          onSelectSubject={setActiveSubjectId}
        />

        {/* Main Content Area */}
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
            <span>{currentSubject.categoryLabel || "Filter Analytics"}</span>
            {currentSubject.dashboards && (
              <span className="text-[var(--purple-300)]">
                {currentSubject.dashboards.length} Dashboard
                {currentSubject.dashboards.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {/* Dashboards Cards */}
          {currentSubject.dashboards ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentSubject.dashboards.map((dash, i) => (
                <DashboardCard key={dash.slug} dashboard={dash} index={i} />
              ))}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
