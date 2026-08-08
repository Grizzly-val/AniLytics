export type Season = "WINTER" | "SPRING" | "SUMMER" | "FALL";

export type MediaFormat =
  | "TV"
  | "TV_SHORT"
  | "MOVIE"
  | "SPECIAL"
  | "OVA"
  | "ONA"
  | "MUSIC";

export interface AnimeTitle {
  english?: string | null;
  native?: string | null;
  romaji?: string | null;
}

export interface AnimeItem {
  title: AnimeTitle;
  score: number;
  popularity: number;
  trending: number;
  siteUrl: string;
}

export interface GenreStats {
  count: number;
  average_score: number;
  average_popularity: number;
  average_trending: number;
  animes: AnimeItem[];
  total_score?: number;
  total_popularity?: number;
  total_trending?: number;
}

export type GenreDataResponse = Record<string, GenreStats>;

