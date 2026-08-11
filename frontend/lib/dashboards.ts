export interface Dashboard {
  slug: string;
  label: string;
}

export const dashboards: Dashboard[] = [
  { slug: "genre-data", label: "Genre Data" },
  { slug: "genre-detail", label: "Genre Detail" },
];
