import { SUBJECTS } from "./subjects";

export interface Dashboard {
  slug: string;
  label: string;
  path: string;
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
