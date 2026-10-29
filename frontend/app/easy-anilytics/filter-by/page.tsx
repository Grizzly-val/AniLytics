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
    <div className="flex-1 flex flex-col w-full max-w-350 mx-auto">
      {/* Header Row: Breadcrumb & Active Subject Indicator */}
      <div className="flex items-center justify-between px-6 sm:px-10 lg:px-12 pt-7 pb-3">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-mono text-caption tracking-wide-lg uppercase text-anilytics-text-low"
        >
          <Link
            href="/"
            className="hover:text-anilytics-text-mid transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-anilytics-purple-400 rounded-sm"
          >
            Home
          </Link>
          <span className="text-anilytics-line" aria-hidden="true">
            /
          </span>
          <span className="text-anilytics-purple-300 font-medium">
            Easy-AniLytics
          </span>
        </nav>

        {/* Active Subject Indicator */}
        <div className="flex items-center gap-2 font-mono text-label tracking-widest-sm uppercase text-anilytics-text-low select-none">
          <span className="w-1.25 h-1.25 rounded-full bg-anilytics-purple-400 animate-pulse-dot" />
          <span>Active Subject</span>
        </div>
      </div>

      {/* Main Layout Container with Floating Vertical Rail */}
      <div className="relative flex-1 flex flex-col lg:flex-row min-h-content-screen">
        {/* Slim Vertical Rail Subject Switcher */}
        <SubjectRail
          subjects={EASY_ANILYTICS_SUBJECTS}
          activeSubjectId={activeSubjectId}
          onSelectSubject={setActiveSubjectId}
        />

        {/* Main Content Area */}
        <main
          key={currentSubject.id}
          className="relative z-10 flex-1 px-6 sm:px-10 lg:pl-65 lg:pr-12 pt-3 pb-20 max-w-310 animate-fade-in"
        >
          {/* Subject Headline */}
          <h1 className="font-display font-light text-heading-sm sm:text-heading-lg tracking-tight-2 bg-gradient-heading-text bg-clip-text text-transparent mt-4 mb-3.5 select-none">
            {currentSubject.title}
          </h1>

          {/* Subject Description */}
          <p className="font-body text-body-lg leading-loose-sm text-anilytics-text-mid max-w-160 mb-5">
            {currentSubject.description}
          </p>

          {/* Subject Meta Row */}
          <div className="flex items-center justify-between pt-5 border-t border-anilytics-line-soft mb-10 font-mono text-caption tracking-wide-md text-anilytics-text-low">
            <span>{currentSubject.categoryLabel || "Filter Analytics"}</span>
            {currentSubject.dashboards && (
              <span className="text-anilytics-purple-300">
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
