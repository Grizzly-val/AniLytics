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

export interface SeasonalSubjectItem {
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

export const SEASONAL_SUBJECTS: SeasonalSubjectItem[] = [
  {
    id: "genres",
    label: "Genres",
    title: "Genres",
    description:
      "Categorical breakdown of seasonal anime metrics, score distributions, popularity trends, and individual genre inspection.",
    categoryLabel: "Genre Analytics",
    dashboards: [
      {
        slug: "aggregates",
        path: "/seasonal/genres/aggregates",
        title: "Genre Aggregates",
        shortTitle: "Aggregates",
        description:
          "Macro-level analytics comparing total anime count, average score, popularity, and trending metrics across all genres for any season.",
        badge: "Macro Overview",
        features: ["Genre Rankings", "Metric Comparisons", "Seasonal Filters"],
        tags: ["Genre Rankings", "Metric Comparisons", "Seasonal Filters"],
        icon: "chart-bar",
      },
      {
        slug: "genre-animes",
        path: "/seasonal/genres/genre-animes",
        title: "Genre Anime Breakdown",
        shortTitle: "Genre Animes",
        description:
          "Micro-level inspection of anime entries within specific genres. Features interactive search, score sorting, grid/table views, and direct AniList links.",
        badge: "Micro Inspection",
        features: ["Genre Filtering", "Score Distribution Chart", "Grid & Table View"],
        tags: ["Genre Filtering", "Score Distribution Chart", "Grid & Table View"],
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

export const SUBJECTS: SubjectConfig[] = [
  {
    id: "seasonal",
    title: "Seasonal Analytics",
    navLabel: "Seasonal Analytics",
    path: "/seasonal",
    tagline: "Comprehensive analytics for anime released across seasonal periods",
    description:
      "Explore real-time seasonal data from AniList, organized into categorical sections such as genre aggregates, popularity metrics, and anime breakdowns.",
    badge: "Active Subject",
    icon: "calendar",
    sections: [
      {
        id: "genres",
        title: "Genres Dashboards",
        description:
          "Categorical breakdown of seasonal anime metrics, score distributions, popularity trends, and individual genre inspection.",
        badge: "Genre Analytics",
        dashboards: SEASONAL_SUBJECTS[0].dashboards!,
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

export function getSeasonalSubjectById(id: string): SeasonalSubjectItem | undefined {
  return SEASONAL_SUBJECTS.find((s) => s.id === id);
}
