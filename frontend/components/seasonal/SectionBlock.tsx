import { SectionConfig } from "@/lib/subjects";
import { DashboardCard } from "./DashboardCard";

interface SectionBlockProps {
  section: SectionConfig;
}

export function SectionBlock({ section }: SectionBlockProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {section.title}
            </h2>
            {section.badge && (
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                {section.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-400 max-w-3xl">
            {section.description}
          </p>
        </div>
        <span className="text-xs text-neutral-400 mt-2 sm:mt-0 font-medium shrink-0">
          {section.dashboards.length} Dashboards
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {section.dashboards.map((dashboard) => (
          <DashboardCard key={dashboard.slug} dashboard={dashboard} />
        ))}
      </div>
    </section>
  );
}
