import { SUBJECTS } from "./subjects";

export interface Dashboard {
  slug: string;
  label: string;
  path: string;
}

export interface DeckDashboard {
  id: string;
  badge: string;
  title: string;
  desc: string;
  tags: string[];
  href: string;
  iconType: "chart-bar" | "list-bullet" | string;
}

// Flat export of all dashboards across all subjects and sections for backwards compatibility
export const dashboards: Dashboard[] = SUBJECTS.flatMap((subject) =>
  subject.sections.flatMap((section) =>
    section.dashboards.map((dash) => ({
      slug: dash.slug,
      label: dash.title,
      path: dash.path,
    }))
  )
);

// Get structured dashboard card models for the homepage stack
export function getFeaturedDashboards(): DeckDashboard[] {
  const easyAnilyticsSubject = SUBJECTS.find((s) => s.id === "easy-anilytics");
  if (!easyAnilyticsSubject) return [];

  return easyAnilyticsSubject.sections.flatMap((section) =>
    section.dashboards.map((dash) => ({
      id: dash.slug,
      badge: dash.badge || "Macro & Micro Inspection",
      title: dash.title,
      desc: dash.description,
      tags: dash.features || [],
      href: dash.path,
      iconType: dash.icon,
    }))
  );
}

