"use client";

import Link from "next/link";
import { DashboardConfig } from "@/lib/subjects";
import { ScrollReveal } from "@/components/common/ScrollReveal";

interface DashboardCardProps {
  dashboard: DashboardConfig;
}

export function DashboardCard({ dashboard }: DashboardCardProps) {
  return (
    <ScrollReveal direction="left" duration={500} className="h-full">
      <div className="group flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-sm transition-all duration-200 hover:border-indigo-500/50 hover:bg-neutral-900/90 shadow-xl h-full">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 text-indigo-300 border border-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
              {dashboard.icon === "chart-bar" ? (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              )}
            </div>
            {dashboard.badge && (
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                {dashboard.badge}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
              {dashboard.title}
            </h3>
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
              {dashboard.description}
            </p>
          </div>

          {dashboard.features && (
            <div className="flex flex-wrap gap-2 pt-1">
              {dashboard.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-lg bg-neutral-800/90 px-3 py-1 text-xs font-medium text-neutral-300 border border-neutral-700/60"
                >
                  ✨ {feature}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-neutral-800/80 mt-6">
          <Link
            href={dashboard.path}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 group-hover:bg-indigo-500 hover:shadow-indigo-500/30 transition duration-150"
          >
            <span>Open {dashboard.title}</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </ScrollReveal>
  );
}
