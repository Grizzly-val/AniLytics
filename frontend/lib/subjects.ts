export interface DashboardConfig {
  slug: string;
  path: string;
  title: string;
  shortTitle: string;
  description: string;
  badge?: string;
  features?: string[];
  tags?: string[];
  icon: "chart-bar" | "list-bullet" | "sparkles" | "fire" | "film" | string;
}

export interface SectionConfig {
  id: string;
  title: string;
  description: string;
  badge?: string;
  dashboards: DashboardConfig[];
}

export interface EasyAnilyticsSubjectItem {
  id: string;
  label: string;
  title: string;
  description: string;
  categoryLabel?: string;
  dashboards: DashboardConfig[] | null;
}

export interface SubjectConfig {
  id: string;
  title: string;
  navLabel: string;
  path: string;
  tagline: string;
  description: string;
  badge?: string;
  icon?: string;
  sections: SectionConfig[];
}

export const EASY_ANILYTICS_SUBJECTS: EasyAnilyticsSubjectItem[] = [
  {
    id: "filter-by",
    label: "Filter by",
    title: "Filter by",
    description:
      "Categorical breakdown of seasonal anime metrics, score distributions, and individual entry inspection by genre or format.",
    categoryLabel: "Filter Analytics",
    dashboards: [
      {
        slug: "seasonal",
        path: "/easy-anilytics/filter-by/seasonal",
        title: "Seasonal Analytics",
        shortTitle: "Seasonal",
        description:
          "Real-time seasonal anime metrics and breakdowns, filterable by genre or format. Interactive search, score sorting, grid/table views, and direct AniList links.",
        badge: "Macro & Micro Inspection",
        features: ["Season & Year Controls", "Genre & Format Filtering", "Score Distribution Chart", "Grid & Table View"],
        tags: ["Season & Year Controls", "Genre & Format Filtering", "Score Distribution Chart", "Grid & Table View"],
        icon: "list-bullet",
      },
    ],
  },
  {
    id: "unknown",
    label: "Unknown",
    title: "Unknown",
    description: "This subject hasn't been mapped yet.",
    dashboards: null,
  },
];

// Backwards compatibility alias
export const SEASONAL_SUBJECTS = EASY_ANILYTICS_SUBJECTS;
export type SeasonalSubjectItem = EasyAnilyticsSubjectItem;

export const SUBJECTS: SubjectConfig[] = [
  {
    id: "easy-anilytics",
    title: "Easy-AniLytics",
    navLabel: "Easy-AniLytics",
    path: "/easy-anilytics/filter-by",
    tagline: "Streamlined anime analytics filtered by genres and media formats",
    description:
      "Explore real-time seasonal data from AniList, organized into categorical sections filterable by genre or format.",
    badge: "Active Subject",
    icon: "calendar",
    sections: [
      {
        id: "filter-by",
        title: "Filter by Dashboards",
        description:
          "Categorical breakdown of seasonal anime metrics, score distributions, and entry inspection.",
        badge: "Filter Analytics",
        dashboards: EASY_ANILYTICS_SUBJECTS[0].dashboards!,
      },
    ],
  },
];

export function getSubjectById(id: string): SubjectConfig | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function getSubjectByPath(pathname: string): SubjectConfig | undefined {
  return SUBJECTS.find(
    (s) => pathname === s.path || pathname.startsWith(`${s.path}/`)
  );
}

export function getAllSubjects(): SubjectConfig[] {
  return SUBJECTS;
}

export function getEasyAnilyticsSubjectById(id: string): EasyAnilyticsSubjectItem | undefined {
  return EASY_ANILYTICS_SUBJECTS.find((s) => s.id === id);
}

export const getSeasonalSubjectById = getEasyAnilyticsSubjectById;

